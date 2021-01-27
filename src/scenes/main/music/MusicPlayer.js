import React, { useCallback, useEffect, useState } from 'react';
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
} from 'react-native';
import { Text, Icon, Slider, BottomSheet, ListItem } from 'react-native-elements';
import Marquee from 'react-native-text-ticker';

import COLORS from '../../../val/colors/Colors';
import { usePlayerContext } from './context/PlayerContext';
import { useSelector } from 'react-redux';
import SongProgressSlider from './SongProgress';
import TrackPlayer from 'react-native-track-player';
import firebase from '../../../firebase/Firebase';

const MusicPlayer = props => {
	const playerContext = usePlayerContext();
	const {
		play,
		pause,
		playPrev,
		playNext,
		isPlaying,
		isPaused,
		// isStopped,
		isLoading,

		currentTrack,
		seekTo,
		// seekLevel,

		rate,
		getRateText,
		setRate,
		volume,
		setVolume,
	} = playerContext;
	const { sound } = useSelector(state => state.main.user);
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [showRateChanger, setShowRateChanger] = useState(false);
	const [queue, setQueue] = useState([]);

	const getQueue = useCallback(async () => {
		const track = await TrackPlayer.getQueue();
		// console.log(track);
		setQueue(track);
		// console.log(queue);
	}, []);

	const updateProfileSong = () => {
		let removeSong = false;
		if (sound.id === currentTrack.id) {
			removeSong = true;
		}
		firebase
			.database()
			.ref('Users')
			.child(firebase.auth().currentUser.uid)
			.update({
				sound: {
					id: removeSong ? 'app' : currentTrack.id,
					url: removeSong ? '' : currentTrack.url,
					duration: removeSong ? 0 : currentTrack.duration,
				},
			})
			.then(res => {
				ToastAndroid.showWithGravity(
					'Profile Updated!',
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
			})
			.catch(err => {
				ToastAndroid.showWithGravity(
					'Cannot Update Profile Currently! Error in server. Please try again.',
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
			});
	};

	useEffect(() => {
		getQueue();
	}, []);

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

	return (
		<SafeAreaView>
			<ScrollView>
				<View style={styles.imageContainer}>
					{/* SONG IMAGE WITH BACKGROUND IMAGE */}
					<ImageBackground
						source={{ uri: currentTrack.artwork }}
						blurRadius={7}
						resizeMode='cover'
						style={styles.backgroundImage}>
						<View style={styles.navigator}>
							<Icon
								onPress={() => props.navigation.goBack()}
								name='chevron-thin-down'
								type='entypo'
								size={26}
								color={COLORS.WHITE}
								style={styles.navigationIcon}
							/>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center',
									flex: 1,
								}}>
								<Slider
									allowTouchTrack={true}
									animateTransitions={true}
									animationType='timing'
									style={{
										padding: 0,
										width: '45%',
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
									onSlidingComplete={level => {
										setVolume(level);
									}}
								/>
								<Text
									onPress={() => setShowRateChanger(true)}
									style={styles.rateText}>
									{getRateText()}
								</Text>
							</View>
						</View>
						<View style={styles.mainImage}>
							<ImageBackground
								source={{ uri: currentTrack.artwork }}
								style={[
									styles.image,
									{
										borderRadius: 5,
										overflow: 'hidden',
										justifyContent: 'flex-start',
										alignItems: 'flex-end',
									},
								]}>
								<Icon
									name={currentTrack?.id === sound?.id ? 'heart' : 'hearto'}
									type='ant-design'
									size={25}
									onPress={updateProfileSong}
									color={
										currentTrack?.id === sound?.id ? COLORS.RED : COLORS.WHITE
									}
									containerStyle={{ marginRight: 5, marginTop: 5 }}
								/>
							</ImageBackground>
						</View>
					</ImageBackground>
				</View>

				<View style={styles.restContainer}>
					{/* SONG TITLE MARQUEE */}
					<Marquee
						style={whatIsTheme(styles.songTitleDark, styles.songTitleLight)}
						duration={6500}
						marqueeDelay={4500}
						useNativeDriver={true}
						loop
						isRTL={false}
						isInteraction={false}
						bounce
						easing={Easing.ease}>
						{currentTrack?.title ? currentTrack?.title : 'Loading...'}
					</Marquee>

					{/* ARTIST LIST */}
					<View>
						<Text
							style={{
								color: whatIsTheme(COLORS.DARKFORLIGHT, COLORS.DARKSECONDARY),
							}}
							numberOfLines={1}>
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
						}}>
						{/* PROGRESS BAR */}
						{/* <SongProgressBar whatIsTheme={whatIsTheme} /> */}
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
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						</View>
						<View style={styles.iconContainerSimple}>
							<Icon
								onPress={playPrev}
								name='skip-previous'
								type='ionicons'
								size={42}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						</View>
						<View
							style={whatIsTheme(
								styles.iconContainerDark,
								styles.iconContainerLight
							)}>
							{playerContext.isPaused ? (
								<Icon
									onPress={() => play()}
									name='play-arrow'
									type='ionicons'
									size={48}
									color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
								/>
							) : playerContext.isPlaying ? (
								<Icon
									onPress={() => pause()}
									name='pause'
									type='ant-design'
									size={48}
									color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
								/>
							) : playerContext.isLoading ? (
								<ActivityIndicator
									size={48}
									color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
								/>
							) : (
								<ActivityIndicator
									size={48}
									color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
								/>
							)}
						</View>
						<View style={styles.iconContainerSimple}>
							<Icon
								onPress={playNext}
								name='skip-next'
								type='ionicons'
								size={42}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						</View>
						<View style={[styles.iconContainerSimple]}>
							<Icon
								onPress={() => seekTo(10)}
								name='rotate-right'
								type='font-awesome'
								size={28}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						</View>
					</View>

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
						}}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
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
							}}>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(styles.textDark, styles.textLight)}>
									2.0x
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setShowRateChanger(false);
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(COLORS.BLACK, COLORS.BEFORELIGHT),
							}}>
							<ListItem.Content>
								<ListItem.Title style={styles.cancelButton}>Cancel</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</BottomSheet>
				</View>

				{/* SONGS QUEUE */}
				<View style={styles.queueContainer}>
					<View
						style={whatIsTheme(
							styles.queueTextContianerDark,
							styles.queueTextContianerLight
						)}>
						<Text
							style={[
								whatIsTheme(styles.textDark, styles.textLight),
								styles.queueText,
							]}>
							Queue
						</Text>
					</View>
					{queue.map(song => {
						return (
							<ListItem
								// bottomDivider
								onPress={async () => {
									await playerContext.play(song);
								}}
								key={song.id}
								underlayColor={whatIsTheme(COLORS.DARKPRIMARY, COLORS.BEFORELIGHT)}
								// bottomDivider
								containerStyle={[
									// index === searchResults.length - 1 ? styles.lastElement : null,
									{
										paddingVertical: 5,
										alignItems: 'flex-start',
										backgroundColor:
											currentTrack.id === song.id
												? whatIsTheme(
														COLORS.DARKPRIMARY,
														COLORS.SIMILARTRANSPARENTDARK
												  )
												: COLORS.TRANSPARENT,
									},
								]}>
								{currentTrack.id === song.id ? (
									<View
										style={{ alignItems: 'center', justifyContent: 'center' }}>
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
									}}>
									<View style={{ flex: 1 }}>
										<ListItem.Title
											numberOfLines={1}
											style={[
												whatIsTheme(styles.textDark, styles.textLight),
												{ fontSize: 16 },
											]}>
											{song.title}
										</ListItem.Title>
										<ListItem.Subtitle
											style={{ color: COLORS.MID }}
											numberOfLines={1}>
											{song.artist}
										</ListItem.Subtitle>
									</View>
									<ListItem.Subtitle
										style={{ color: COLORS.MID }}
										numberOfLines={1}>
										{song.durationEdited}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						);
					})}
				</View>
				<View style={styles.lastElement}></View>
			</ScrollView>
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
	navigationIcon: {},
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
		height: 333,
		resizeMode: 'cover',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	mainImage: {
		width: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 230,
		height: 230,
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
		// paddingHorizontal: 12,
		// paddingVertical: 10,
		marginHorizontal: 10,
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: COLORS.WHITEINDARKVIDIBLE,
		color: COLORS.WHITE,
		borderRadius: 100,
		width: 45,
		height: 45,
		fontSize: 15,
		fontWeight: 'bold',
	},

	queueContainer: {},
	queueTextContianerDark: {
		borderBottomColor: COLORS.DARKSECONDARY,
		borderBottomWidth: 1,
		borderTopColor: COLORS.DARKSECONDARY,
		borderTopWidth: 1,
		paddingVertical: 5,
		marginTop: 100,
	},
	queueTextContianerLight: {
		borderBottomColor: COLORS.DARKFORLIGHT,
		borderBottomWidth: 1,
		borderTopColor: COLORS.DARKFORLIGHT,
		borderTopWidth: 1,
		paddingVertical: 5,
		marginTop: 100,
	},
	queueText: {
		fontSize: 20,
		fontWeight: 'bold',
		paddingHorizontal: 15,
		paddingVertical: 5,
		// backgroundColor: COLORS.GREEN,
	},
	queueImageContainer: {
		overflow: 'hidden',
	},
	queueImage: {
		width: 45,
		height: 45,
		borderRadius: 3,
	},

	lastElement: {
		marginBottom: 100,
	},
});

export default MusicPlayer;
