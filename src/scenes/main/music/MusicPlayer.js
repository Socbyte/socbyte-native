import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	View,
	Image,
	ImageBackground,
	Easing,
	Dimensions,
	ActivityIndicator,
	ScrollView,
	ToastAndroid,
	TouchableOpacity,
	Animated,
} from 'react-native';
import {
	Text,
	Icon,
	Slider,
	BottomSheet,
	ListItem,
	Divider,
} from 'react-native-elements';
import Marquee from 'react-native-text-ticker';
import LottieView from 'lottie-react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import COLORS from '../../../val/colors/Colors';
import { usePlayerContext } from './context/PlayerContext';
import { useSelector } from 'react-redux';
import SongProgressSlider from './SongProgress';
import TrackPlayer from 'react-native-track-player';
import firebase from '../../../firebase/Firebase';
import { SufflerList } from '../../../val/constants/Constants';
import ytdl from 'react-native-ytdl';

const MusicPlayer = (props) => {
	const playerContext = usePlayerContext();
	const {
		play,
		pause,
		playPrev,
		playNext,
		isPlaying,
		isPaused,
		// isStopped,

		currentTrack,
		seekTo,
		// seekLevel,

		rate,
		getRateText,
		setRate,
		volume,
		setVolume,
	} = playerContext;
	const { sound } = useSelector((state) => state.main.user);
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [showRateChanger, setShowRateChanger] = useState(false);
	const [queue, setQueue] = useState([]);
	const likeAnimation = useRef(null);
	const firstTimeAnim = useRef(true);
	const [added, setAdded] = useState(false);

	useEffect(() => {
		if (firstTimeAnim.current) {
			if (currentTrack?.id === sound.id) {
				likeAnimation.current.play(50, 50);
			} else {
				likeAnimation.current.play(9, 9);
			}
			firstTimeAnim.current = false;
		} else if (currentTrack?.id === sound.id) {
			likeAnimation.current.play(9, 50);
		} else {
			likeAnimation.current.play(0, 9);
		}
	}, [currentTrack?.id, sound.id]);

	const getQueue = useCallback(async () => {
		const track = await TrackPlayer.getQueue();
		// console.log(track);
		setQueue(track);
		// console.log(queue);
	}, []);

	function formatDuration(num) {
		function numPadding(n, z) {
			z = z || 2;
			return ('00' + n).slice(-z);
		}

		var ms = num % 1000;
		num = (num - ms) / 1000;
		var secs = num % 60;
		num = (num - secs) / 60;
		var mins = num % 60;
		var hrs = (num - mins) / 60;

		return hrs > 0
			? numPadding(hrs) + ':'
			: '' + numPadding(mins) + ':' + numPadding(secs);
	}

	const updateProfileSong = () => {
		let removeSong = false;
		if (sound.id === currentTrack?.id) {
			removeSong = true;
		}
		firebase
			.database()
			.ref('Users')
			.child(firebase.auth().currentUser.uid)
			.update({
				sound: {
					id: removeSong ? 'app' : currentTrack?.id,
					url: removeSong ? '' : currentTrack.url,
					duration: removeSong ? 0 : currentTrack.duration,
				},
			})
			.then((res) => {
				ToastAndroid.showWithGravity(
					'Profile Updated!',
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
			})
			.catch((err) => {
				ToastAndroid.showWithGravity(
					'Cannot Update Profile Currently! Error in server. Please try again.',
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
			});
	};

	useEffect(() => {
		getQueue();
	}, [added]);

	useEffect(() => {
		if (
			!currentTrack ||
			!currentTrack.artwork ||
			currentTrack === null ||
			!currentTrack.artwork
		) {
			props.navigation.goBack();
		}
	}, [currentTrack]);

	const translateX = new Animated.Value(0);
	// const translateY = new Animated.Value(0);
	const gesturHandler = Animated.event(
		[
			{
				nativeEvent: {
					translationX: translateX,
					// translationY: translateY,
				},
			},
		],
		{ useNativeDriver: false }
	);

	const onHandlerStateChange = (event) => {
		if (event.nativeEvent.oldState == State.ACTIVE) {
			const value = translateX._value;
			// Animated.parallel([
			Animated.timing(translateX, {
				toValue: 0,
				duration: 450,
				useNativeDriver: false,
			}).start(() => {
				if (value <= -145.0) playerContext.playPrev();
				else if (value >= 145.0) playerContext.playNext();
			});
			// 	Animated.timing(translateY, {
			// 		toValue: 0,
			// 		duration: 300,
			// 		useNativeDriver: false,
			// 	}),
			// ]).start();
		}
	};

	// console.log(playerContext.recommendedSongsList);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{/* MAIN CONTENT FOR MUSIC PLAYER */}
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			>
				<View style={[styles.imageContainer, { overflow: 'hidden' }]}>
					{/* SONG IMAGE WITH BACKGROUND IMAGE */}
					<ImageBackground
						source={{ uri: currentTrack.artwork }}
						blurRadius={15}
						resizeMode='cover'
						style={styles.backgroundImage}
					>
						{/*  */}
						<View style={styles.navigator}>
							<TouchableOpacity
								onPress={() => props.navigation.goBack()}
								style={{
									// backgroundColor: `${COLORS.WHITE}25`,
									borderRadius: 20,
									padding: 2,
								}}
							>
								<Icon
									name='chevron-thin-down'
									type='entypo'
									size={26}
									color={COLORS.WHITE}
									style={styles.navigationIcon}
								/>
							</TouchableOpacity>

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center',
									flex: 1,
								}}
							>
								<Slider
									allowTouchTrack={true}
									animateTransitions={true}
									animationType='timing'
									style={{
										padding: 0,
										width: '40%',
									}}
									value={volume}
									minimumValue={0}
									maximumValue={1}
									step={0.01}
									trackStyle={{
										height: 4,
										backgroundColor: COLORS.BLACK,
										borderRadius: 10,
									}}
									maximumTrackTintColor={COLORS.BLACK}
									minimumTrackTintColor={COLORS.WHITE}
									thumbStyle={{
										borderRadius: 100,
										height: 6,
										width: 6,
										backgroundColor: COLORS.WHITE,
									}}
									onSlidingComplete={(level) => {
										setVolume(level);
									}}
								/>

								<TouchableOpacity onPress={updateProfileSong}>
									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											width: 40,
											height: 40,
											borderRadius: 50,
											overflow: 'hidden',
											marginHorizontal: 12,
											backgroundColor:
												COLORS.DARKINLIGHTVIDIBLE,
											// padding: 15,
										}}
									>
										<LottieView
											source={require('../../../assets/animations/likeWhite.json')}
											style={styles.likeAnimation}
											autoPlay={false}
											loop={false}
											ref={likeAnimation}
											autoSize={true}
										/>
									</View>
								</TouchableOpacity>

								<Text
									onPress={() => setShowRateChanger(true)}
									style={styles.rateText}
								>
									{getRateText()}
								</Text>
							</View>
						</View>

						{/*  */}
						<View style={styles.mainImage}>
							<PanGestureHandler
								onGestureEvent={gesturHandler}
								onHandlerStateChange={onHandlerStateChange}
							>
								<Animated.View
									style={[
										styles.mainImage,
										{
											width: 100,
											height: 100,
											backgroundColor: COLORS.GREEN,
											transform: [
												{ translateX: translateX },
												// { translateY: translateY },
											],
										},
									]}
								>
									<Image
										source={{ uri: currentTrack.artwork }}
										style={[
											styles.image,
											{
												borderRadius: 5,
												overflow: 'hidden',
												justifyContent: 'flex-start',
												alignItems: 'flex-end',
											},
										]}
									/>
								</Animated.View>
							</PanGestureHandler>
						</View>

						{/* SONG TITLE, SONG'S AUTHORS, CONTROL BUTTONS, PROGRESS BAR TIMELINE OF PLAYER, ETC */}
						<View
							style={[
								styles.restContainer,
								{
									backgroundColor: whatIsTheme(
										COLORS.WHITEINDARKVIDIBLE,
										COLORS.DARKINLIGHTVIDIBLE
									),
									paddingBottom: 30,
								},
							]}
						>
							{/* SONG TITLE MARQUEE */}
							<Marquee
								style={whatIsTheme(
									styles.songTitleDark,
									styles.songTitleLight
								)}
								duration={6500}
								marqueeDelay={4500}
								useNativeDriver={true}
								loop
								isRTL={false}
								isInteraction={false}
								bounce
								easing={Easing.ease}
							>
								{currentTrack?.title
									? currentTrack?.title
									: 'Loading...'}
							</Marquee>

							{/* ARTIST LIST */}
							<View>
								<Text
									style={{
										color: whatIsTheme(
											COLORS.DARKFORLIGHT,
											COLORS.DARKSECONDARY
										),
									}}
									numberOfLines={1}
								>
									{currentTrack.artist}
								</Text>
							</View>

							{/* SONG PROGRESS BAR */}
							<View
								style={{
									width: '100%',
									flexDirection: 'row',
									justifyContent: 'space-around',
									alignItems: 'center',
								}}
							>
								{/* PROGRESS BAR */}
								{/* <SongProgressBar whatIsTheme={whatIsTheme} /> */}
								{/* the view inside this progress slider also contains the same styles as above view */}
								<SongProgressSlider />
							</View>

							{/* PLAY, PAUSE, SKIP NEXT, SKIP PREVIOUS AND SKIP TO BUTTONS */}
							<View style={styles.allIconContainer}>
								<View style={[styles.iconContainerSimple]}>
									<Icon
										onPress={() => seekTo(-10)}
										name='rotate-left'
										type='font-awesome'
										size={28}
										color={whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										)}
									/>
								</View>
								<View style={styles.iconContainerSimple}>
									<Icon
										onPress={playPrev}
										name='skip-previous'
										type='ionicons'
										size={42}
										color={whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										)}
									/>
								</View>
								<View
									style={whatIsTheme(
										styles.iconContainerDark,
										styles.iconContainerLight
									)}
								>
									{playerContext.isPaused ? (
										<Icon
											onPress={() => play()}
											name='play-arrow'
											type='ionicons'
											size={48}
											color={whatIsTheme(
												COLORS.WHITE,
												COLORS.BLACK
											)}
										/>
									) : playerContext.isPlaying ? (
										<Icon
											onPress={() => pause()}
											name='pause'
											type='ant-design'
											size={48}
											color={whatIsTheme(
												COLORS.WHITE,
												COLORS.BLACK
											)}
										/>
									) : (
										<Icon
											// onPress={() => play()}here
											name='play-arrow'
											type='ionicons'
											size={48}
											color={whatIsTheme(
												COLORS.WHITE,
												COLORS.BLACK
											)}
										/>
									)}
								</View>
								<View style={styles.iconContainerSimple}>
									<Icon
										onPress={playNext}
										name='skip-next'
										type='ionicons'
										size={42}
										color={whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										)}
									/>
								</View>
								<View style={[styles.iconContainerSimple]}>
									<Icon
										onPress={() => seekTo(10)}
										name='rotate-right'
										type='font-awesome'
										size={28}
										color={whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										)}
									/>
								</View>
							</View>
						</View>
					</ImageBackground>
				</View>
				{/* SONGS QUEUE */}
				<View style={styles.queueContainer}>
					<View
						style={whatIsTheme(
							styles.queueTextContianerDark,
							styles.queueTextContianerLight
						)}
					>
						<Text
							style={[
								whatIsTheme(styles.textDark, styles.textLight),
								styles.queueText,
							]}
						>
							Queue
						</Text>
					</View>
					{queue.map((song) => {
						return (
							<ListItem
								// bottomDivider
								onPress={async () => {
									await playerContext.play(song);
								}}
								key={song.id}
								underlayColor={whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.BEFORELIGHT
								)}
								// bottomDivider
								containerStyle={[
									// index === searchResults.length - 1 ? styles.lastElement : null,
									{
										paddingVertical: 5,
										alignItems: 'flex-start',
										backgroundColor:
											currentTrack?.id === song.id
												? whatIsTheme(
														COLORS.DARKPRIMARY,
														COLORS.SIMILARTRANSPARENTDARK
												  )
												: COLORS.TRANSPARENT,
									},
								]}
							>
								{/* {currentTrack.id === song.id ? (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											width: 30,
											height: 30,
											overflow: 'hidden',
										}}>
										<Text
											style={{
												color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
												textAlignVertical: 'center',
												textAlign: 'center',
												flex: 1,
												fontSize: 18,
												includeFontPadding: false,
												padding: 0,
												margin: 0,
												fontWeight: 'bold',
											}}>
											{'\u2022'}
										</Text>
									</View>
								) : null} */}
								<View style={styles.queueImageContainer}>
									<ImageBackground
										source={{ uri: song.artwork }}
										style={styles.queueImage}
									>
										{currentTrack?.id === song.id ? (
											<LottieView
												source={require('../../../assets/animations/waves.json')}
												style={{
													width: 45,
													height: 45,
													padding: 0,
													margin: 0,
													backgroundColor: `${COLORS.BLACK}30`,
												}}
												autoPlay={true}
												loop={true}
												autoSize={true}
												resizeMode='cover'
											/>
										) : null}
									</ImageBackground>
								</View>
								<ListItem.Content
									style={{
										flexDirection: 'row',
										justifyContent: 'flex-start',
									}}
								>
									<View style={{ flex: 1 }}>
										<ListItem.Title
											numberOfLines={1}
											style={[
												whatIsTheme(
													styles.textDark,
													styles.textLight
												),
												{ fontSize: 16 },
											]}
										>
											{song.title}
										</ListItem.Title>
										<ListItem.Subtitle
											style={{ color: COLORS.MID }}
											numberOfLines={1}
										>
											{song.artist}
										</ListItem.Subtitle>
									</View>
									<ListItem.Subtitle
										style={{ color: COLORS.MID }}
										numberOfLines={1}
									>
										{song.durationEdited}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						);
					})}
				</View>

				{/* RECOMMENDED SONGS LIST TO ADD IN QUEUE */}
				{playerContext.recommendedSongsList.length ? (
					<View style={styles.queueContainer}>
						<View
							style={[
								whatIsTheme(
									styles.queueTextContianerDark,
									styles.queueTextContianerLight
								),
								{
									// marginTop: 100,
								},
							]}
						>
							<Text
								style={[
									whatIsTheme(
										styles.textDark,
										styles.textLight
									),
									styles.queueText,
								]}
							>
								Recommended - Add To Queue
							</Text>
						</View>
						{playerContext.recommendedSongsList.map((song) => {
							return (
								<ListItem
									// bottomDivider
									onPress={async () => {
										const youtubeURL = `http://www.youtube.com/watch?v=${song.id}`;
										const urls = await ytdl(youtubeURL, {
											quality: 'highestaudio',
										});

										await playerContext.addToQueue({
											...song,
											url: urls[0].url,
											durationEdited: song.durationEdited,
										});

										setAdded(!added);
									}}
									key={song.id}
									underlayColor={whatIsTheme(
										COLORS.DARKPRIMARY,
										COLORS.BEFORELIGHT
									)}
									// bottomDivider
									containerStyle={[
										// index === searchResults.length - 1 ? styles.lastElement : null,
										{
											paddingVertical: 5,
											alignItems: 'flex-start',
											backgroundColor:
												currentTrack?.id === song.id
													? whatIsTheme(
															COLORS.DARKPRIMARY,
															COLORS.SIMILARTRANSPARENTDARK
													  )
													: COLORS.TRANSPARENT,
										},
									]}
								>
									{currentTrack?.id === song.id ? (
										<View
											style={{
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Text
												style={{
													color: whatIsTheme(
														COLORS.WHITE,
														COLORS.BLACK
													),
													textAlignVertical: 'center',
													textAlign: 'center',
													flex: 1,
													fontSize: 18,
													includeFontPadding: false,
													padding: 0,
													margin: 0,
													fontWeight: 'bold',
												}}
											>
												{'\u2022'}
											</Text>
										</View>
									) : null}
									<View style={styles.queueImageContainer}>
										<Image
											source={{ uri: song.artwork }}
											style={styles.queueImage}
										/>
									</View>
									<ListItem.Content
										style={{
											flexDirection: 'row',
											justifyContent: 'flex-start',
										}}
									>
										<View style={{ flex: 1 }}>
											<ListItem.Title
												numberOfLines={1}
												style={[
													whatIsTheme(
														styles.textDark,
														styles.textLight
													),
													{ fontSize: 16 },
												]}
											>
												{song.title}
											</ListItem.Title>
											<ListItem.Subtitle
												style={{ color: COLORS.MID }}
												numberOfLines={1}
											>
												{song.artist}
											</ListItem.Subtitle>
										</View>
										<ListItem.Subtitle
											style={{ color: COLORS.MID }}
											numberOfLines={1}
										>
											{song.durationEdited}
										</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							);
						})}
					</View>
				) : null}

				{/* LAST ELEMENT TAG TO GIVE SOME MARGIN BOTTOM */}
				<View style={styles.lastElement}></View>
			</ScrollView>

			{/* BOTTOM SHEET FOR PLAYER SPEED CONTROL */}
			<BottomSheet
				modalProps={{
					style: {
						backgroundColor: COLORS.TRANSPARENT,
					},
				}}
				isVisible={showRateChanger}
				containerStyle={{
					backgroundColor: whatIsTheme(
						`${COLORS.DARKPRIMARY}9f`,
						`${COLORS.DARKFORLIGHT}9f`
					),
				}}
			>
				<ListItem
					onPress={() => {
						setRate(0.25);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 0.25
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							0.25x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
				<ListItem
					onPress={() => {
						setRate(0.5);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 0.5
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							0.50x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
				<ListItem
					onPress={() => {
						setRate(0.75);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 0.75
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							0.75x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
				<ListItem
					onPress={() => {
						setRate(1);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 1
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							Normal
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				<ListItem
					onPress={() => {
						setRate(1.25);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 1.25
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							1.25x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				<ListItem
					onPress={() => {
						setRate(1.5);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 1.5
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							1.50x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				<ListItem
					onPress={() => {
						setRate(1.75);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 1.75
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							1.75x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				<ListItem
					onPress={() => {
						setRate(2);
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor:
							rate === 2
								? whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT)
								: whatIsTheme(COLORS.DARKPRIMARY, COLORS.WHITE),
					}}
				>
					<ListItem.Content>
						<ListItem.Title
							style={whatIsTheme(
								styles.textDark,
								styles.textLight
							)}
						>
							2.0x
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				<ListItem
					onPress={() => {
						setShowRateChanger(false);
					}}
					containerStyle={{
						backgroundColor: whatIsTheme(
							COLORS.BLACK,
							COLORS.BEFORELIGHT
						),
					}}
				>
					<ListItem.Content>
						<ListItem.Title style={styles.cancelButton}>
							Cancel
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
			</BottomSheet>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	navigator: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	navigationIcon: {
		padding: 5,
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	restContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	backgroundImage: {
		width: '100%',
		flex: 1,
		minHeight: 580,
		resizeMode: 'cover',
		alignItems: 'center',
		justifyContent: 'space-between',
		// paddingBottom: 0,
	},
	mainImage: {
		width: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 40,
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 6,
	},

	songTitleDark: {
		color: COLORS.WHITE,
		fontSize: 21,
		textAlign: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		fontWeight: 'bold',
	},
	songTitleLight: {
		color: COLORS.BLACK,
		fontSize: 21,
		textAlign: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		fontWeight: 'bold',
	},

	allIconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
	},
	iconContainerDark: {
		borderRadius: 100,
		borderWidth: 2,
		borderColor: COLORS.WHITE,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 12,
		padding: 8,
	},
	iconContainerLight: {
		borderRadius: 100,
		borderWidth: 2,
		borderColor: COLORS.BLACK,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 12,
		padding: 8,
	},
	iconContainerSimple: {
		borderRadius: 100,
		// borderWidth: 2,
		marginHorizontal: 3,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 3,
	},
	marginHori: {
		marginHorizontal: 20,
		padding: 10,
	},

	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},
	cancelButton: {
		textAlign: 'center',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		color: COLORS.RED,
	},
	rateText: {
		marginRight: 10,
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: COLORS.DARKINLIGHTVIDIBLE,
		color: COLORS.BLACK,
		borderRadius: 100,
		width: 40,
		height: 40,
		fontSize: 14,
		fontWeight: 'bold',
	},

	queueContainer: {},
	queueTextContianerDark: {
		borderBottomColor: COLORS.DARKSECONDARY,
		borderBottomWidth: 1,
		borderTopColor: COLORS.DARKSECONDARY,
		borderTopWidth: 1,
		paddingVertical: 5,
		marginTop: 0,
	},
	queueTextContianerLight: {
		borderBottomColor: COLORS.DARKFORLIGHT,
		borderBottomWidth: 1,
		borderTopColor: COLORS.DARKFORLIGHT,
		borderTopWidth: 1,
		paddingVertical: 5,
		marginTop: 0,
	},
	queueText: {
		fontSize: 18,
		fontWeight: 'bold',
		paddingHorizontal: 15,
		paddingVertical: 8,
		// backgroundColor: COLORS.GREEN,
	},
	queueImageContainer: {
		overflow: 'hidden',
	},
	queueImage: {
		width: 45,
		height: 45,
		borderRadius: 3,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
	},

	likeAnimation: {
		width: 105,
		height: 105,
		padding: 0,
		margin: 0,
	},

	lastElement: {
		marginBottom: 100,
	},
});

export default MusicPlayer;
