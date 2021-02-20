import React, { useEffect, useRef, useState } from 'react';
import {
	Image,
	StyleSheet,
	Vibration,
	View,
	ImageBackground,
	ScrollView,
	TouchableNativeFeedback,
	Linking,
	ToastAndroid,
} from 'react-native';
import {
	IconButton,
	Button,
	Menu,
	Provider,
	Divider,
	DarkTheme,
	DefaultTheme,
	Text,
	TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ytdl from 'react-native-ytdl';

import COLORS, { ISDARKCOLOR } from '../../val/colors/Colors';
import firebase from '../../firebase/Firebase';
import HomeHeader from '../../components/customs/HomeHeader/HomeHeader';
import { useSelector } from 'react-redux';

import { usePlayerContext } from '../main/music/context/PlayerContext';
import {
	homeImageLink,
	numbers,
	SufflerList,
	currentFeaturesList,
	upcomingFeaturesList,
} from '../../val/constants/Constants';
import { Icon } from 'react-native-elements';
import { Dimensions } from 'react-native';
import CustomSlider from './profileMusic/Slider';
import SongProgressSlider from './music/SongProgress';

const CurrentFeaturesArea = ({ liked }) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const { width, height } = Dimensions.get('window');
	const [sliderState, setSliderState] = useState({ currentPage: 0 });
	const scroller = useRef(null);

	const setSliderPage = (event) => {
		const { currentPage } = sliderState;
		const { x } = event.nativeEvent.contentOffset;
		const indexOfNextScreen = Math.floor(x / width);
		if (indexOfNextScreen !== currentPage) {
			setSliderState({
				...sliderState,
				currentPage: indexOfNextScreen,
			});
		}
	};
	const [s, ss] = useState(false);

	useEffect(() => {
		const interval = setTimeout(() => {
			if (sliderState.currentPage >= currentFeaturesList.length) {
				setSliderPage({
					nativeEvent: { contentOffset: { x: '0' } },
				});
				scroller.current.scrollTo({ x: 0 });
			} else {
				setSliderPage({
					nativeEvent: {
						contentOffset: {
							x: (sliderState.currentPage + 1) * width,
						},
					},
				});
				scroller.current.scrollTo({
					x: (sliderState.currentPage + 1) * width,
				});
			}
			ss(!s);
		}, 9000);

		return () => {
			clearTimeout(interval);
		};
	}, [s]);

	const addLikeToIndexedFeature = (index) => {
		// if already liked then remove the like...
		// or else add a like...
		firebase
			.database()
			.ref('FeaturesLikes')
			.child(firebase.auth().currentUser.uid)
			.child('current')
			.update({
				likes: liked.includes(index)
					? `${liked.replace(index, '')}`
					: `${liked}${index}`,
			});
	};

	return (
		<View>
			<Text
				style={{
					fontSize: 20,
					color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
					textAlign: 'center',
					paddingVertical: 20,
					borderBottomColor: whatIsTheme(
						COLORS.DARKPRIMARY,
						COLORS.NEXTLIGHT
					),
					borderWidth: 0.5,
				}}
			>
				Current Features
			</Text>
			<ScrollView
				// contentContainerStyle={{
				// 	justifyContent: 'center',
				// 	alignItems: 'center',
				// }}
				ref={scroller}
				onScroll={(event) => {
					setSliderPage(event);
				}}
				horizontal
				snapToInterval={Dimensions.get('window').width}
				snapToAlignment='center'
				decelerationRate='fast'
				showsHorizontalScrollIndicator={false}
				style={{
					paddingBottom: 20,
				}}
			>
				{SufflerList.sameArray(currentFeaturesList).map(
					(feature, index) => {
						return (
							<View
								key={feature.index}
								style={{
									width: Dimensions.get('window').width,
									justifyContent: 'center',
									alignItems: 'center',
									marginVertical: 25,
								}}
							>
								<View
									key={feature.color[0]}
									style={{
										backgroundColor: feature.color[0],
										width: 265,
										justifyContent: 'center',
										alignItems: 'center',
										overflow: 'hidden',
										borderRadius: 10,
										elevation: 8,
									}}
								>
									<View
										style={{
											borderRadius: 10,
											height: 300,
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '100%',
										}}
									>
										<View
											style={{
												width: '100%',
												flexDirection: 'row',
											}}
										>
											<Text
												style={{
													color: feature.color[1],
													fontSize: 18,
													padding: 5,
													fontWeight: 'bold',
													paddingVertical: 15,
													textAlign: 'center',
													textAlignVertical: 'center',
													borderBottomColor:
														COLORS.SIMILARTRANSPARENTLIGHT,
													borderBottomWidth: 1,
													fontFamily: 'roboto',
													// width: '100%',
													flex: 1,
												}}
											>
												{feature.heading}
											</Text>
											<Icon
												containerStyle={{
													color: feature.color[1],
													padding: 15,
													position: 'absolute',
												}}
												name={
													liked === '' ||
													!liked.includes(
														feature.index
													)
														? 'hearto'
														: 'heart'
												}
												type='ant-design'
												size={25}
												color={feature.color[1]}
												onPress={() =>
													addLikeToIndexedFeature(
														feature.index
													)
												}
											/>
										</View>
										<Text
											style={{
												color: ISDARKCOLOR.colorIsLight(
													feature.color[0]
												)
													? COLORS.BLACK
													: COLORS.WHITE,
												fontFamily: 'roboto',
												fontSize: 16,
												paddingHorizontal: 15,
												paddingVertical: 8,
												fontFamily: 'roboto',
												overflow: 'scroll',
												flex: 1,
											}}
										>
											{feature.detail}
										</Text>
										{feature.link ? (
											<Text
												style={{
													color: feature.color[1],
													padding: 10,
													margin: 3,
													backgroundColor:
														COLORS.WHITEINDARKVIDIBLE,
													borderRadius: 5,
													fontSize: 16,
													textAlign: 'center',
													textAlignVertical: 'center',
												}}
												onPress={() => {
													if (
														Linking.canOpenURL(
															feature.link
														)
													)
														Linking.openURL(
															feature.link
														);
													else
														ToastAndroid.show(
															"cannot open the link currently. May be your phone doesn't support this"
														);
												}}
											>
												{`\n${feature.linkText}`}
											</Text>
										) : null}
										{feature.time ? (
											<Text
												style={{
													color: feature.color[1],
													fontFamily: 'roboto',
													fontSize: 16,
													fontWeight: 'bold',
													paddingHorizontal: 10,
													paddingVertical: 10,
													textAlign: 'center',
													textAlignVertical: 'center',
													borderTopColor:
														COLORS.SIMILARTRANSPARENTLIGHT,
													borderTopWidth: 1,
													width: '100%',
												}}
											>
												{`Time Spent\n${feature.time}`}
											</Text>
										) : null}
									</View>
								</View>
							</View>
						);
					}
				)}
			</ScrollView>
		</View>
	);
};

const FutureFeaturesArea = ({ liked }) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const { width, height } = Dimensions.get('window');
	const [sliderState, setSliderState] = useState({ currentPage: 0 });
	const scroller = useRef(null);

	const setSliderPage = (event) => {
		const { currentPage } = sliderState;
		const { x } = event.nativeEvent.contentOffset;
		const indexOfNextScreen = Math.floor(x / width);
		if (indexOfNextScreen !== currentPage) {
			setSliderState({
				...sliderState,
				currentPage: indexOfNextScreen,
			});
		}
	};
	const [s, ss] = useState(false);

	useEffect(() => {
		const interval = setTimeout(() => {
			if (sliderState.currentPage >= currentFeaturesList.length) {
				setSliderPage({
					nativeEvent: { contentOffset: { x: '0' } },
				});
				scroller.current.scrollTo({ x: 0 });
			} else {
				setSliderPage({
					nativeEvent: {
						contentOffset: {
							x: (sliderState.currentPage + 1) * width,
						},
					},
				});
				scroller.current.scrollTo({
					x: (sliderState.currentPage + 1) * width,
				});
			}
			ss(!s);
		}, 8000);

		return () => {
			clearTimeout(interval);
		};
	}, [s]);

	const addLikeToIndexedFeature = (index) => {
		// if already liked then remove the like...
		// or else add a like...
		firebase
			.database()
			.ref('FeaturesLikes')
			.child(firebase.auth().currentUser.uid)
			.child('upcomming')
			.update({
				likes: liked.includes(index)
					? `${liked.replace(index, '')}`
					: `${liked}${index}`,
			});
	};

	return (
		<View>
			<Text
				style={{
					fontSize: 20,
					color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
					textAlign: 'center',
					paddingVertical: 20,
					borderBottomColor: whatIsTheme(
						COLORS.DARKPRIMARY,
						COLORS.NEXTLIGHT
					),
					borderWidth: 0.5,
				}}
			>
				Upcomming Features
			</Text>
			<ScrollView
				// contentContainerStyle={{
				// 	justifyContent: 'center',
				// 	alignItems: 'center',
				// }}
				ref={scroller}
				onScroll={(event) => {
					setSliderPage(event);
				}}
				horizontal
				snapToInterval={Dimensions.get('window').width}
				snapToAlignment='center'
				decelerationRate='fast'
				showsHorizontalScrollIndicator={false}
				style={{
					paddingBottom: 20,
				}}
			>
				{SufflerList.sameArray(upcomingFeaturesList).map((feature) => {
					return (
						<View
							key={feature.index}
							style={{
								width: Dimensions.get('window').width,
								justifyContent: 'center',
								alignItems: 'center',
								marginVertical: 25,
							}}
						>
							<View
								key={feature.color[0]}
								style={{
									backgroundColor: feature.color[0],
									width: 265,
									justifyContent: 'center',
									alignItems: 'center',
									overflow: 'hidden',
									borderRadius: 10,
									elevation: 8,
								}}
							>
								<View
									style={{
										borderRadius: 10,
										height: 300,
										justifyContent: 'space-between',
										alignItems: 'center',
										width: '100%',
									}}
								>
									<View
										style={{
											width: '100%',
											flexDirection: 'row',
										}}
									>
										<Text
											style={{
												color: feature.color[1],
												fontSize: 18,
												padding: 5,
												fontWeight: 'bold',
												paddingVertical: 15,
												textAlign: 'center',
												textAlignVertical: 'center',
												borderBottomColor:
													COLORS.SIMILARTRANSPARENTLIGHT,
												borderBottomWidth: 1,
												fontFamily: 'roboto',
												// width: '100%',
												flex: 1,
											}}
										>
											{feature.heading}
										</Text>
										<Icon
											containerStyle={{
												color: feature.color[1],
												padding: 15,
												position: 'absolute',
											}}
											name={
												liked === '' ||
												!liked.includes(feature.index)
													? 'hearto'
													: 'heart'
											}
											type='ant-design'
											size={25}
											color={feature.color[1]}
											onPress={() =>
												addLikeToIndexedFeature(
													feature.index
												)
											}
										/>
									</View>
									<Text
										style={{
											color: ISDARKCOLOR.colorIsLight(
												feature.color[0]
											)
												? COLORS.BLACK
												: COLORS.WHITE,
											fontFamily: 'roboto',
											fontSize: 16,
											paddingHorizontal: 15,
											paddingVertical: 8,
											fontFamily: 'roboto',
											overflow: 'scroll',
											flex: 1,
										}}
									>
										{feature.detail}
									</Text>

									<Text
										style={{
											color: feature.color[1],
											fontFamily: 'roboto',
											fontSize: 16,
											fontWeight: 'bold',
											paddingHorizontal: 10,
											paddingVertical: 10,
											textAlign: 'center',
											textAlignVertical: 'center',
											borderTopColor:
												COLORS.SIMILARTRANSPARENTLIGHT,
											borderTopWidth: 1,
											width: '100%',
										}}
									>
										{`Time Required\n${feature.time}`}
									</Text>
								</View>
							</View>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
};

const Home = (props) => {
	const ran = Math.floor(Math.random() * numbers.length);
	const playerContext = usePlayerContext();
	const { username } = useSelector((state) => state.main.user);
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const cannotPlayFirstPlaySomething = () => {
		ToastAndroid.show('Play Something First...', ToastAndroid.SHORT);
	};

	const [liked, setLiked] = useState({
		current: { likes: '' },
		upcomming: { likes: '' },
	});

	useEffect(() => {
		firebase
			.database()
			.ref('FeaturesLikes')
			.child(firebase.auth().currentUser.uid)
			.on('value', (snap) => {
				if (snap.val()) {
					setLiked({
						...liked,
						...snap.val(),
					});
					console.log({
						...liked,
						...snap.val(),
					});
					// } else {
					// 	console.log("doesn't exists");
				}
			});
	}, []);

	return (
		<View>
			<HomeHeader {...props} />
			<ScrollView>
				{/* this is the main area of showing future features... */}
				{/* music area */}
				<View
					style={[
						styles.mainmainmu,
						{
							borderColor: whatIsTheme(
								COLORS.DARKPRIMARY,
								COLORS.NEXTLIGHT
							),
						},
					]}
				>
					<View style={styles.userTextHolder}>
						<Text
							style={[
								styles.userText,
								{
									color: whatIsTheme(
										COLORS.WHITE,
										COLORS.BLACK
									),
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
						>
							{playerContext.currentTrack
								? `Playing...\n${playerContext.currentTrack.title}`
								: 'Play Something...'}
						</Text>
					</View>
					<View style={styles.startingMusic}>
						<View style={styles.mainMusic}>
							<View style={styles.musicFirstRow}>
								<ImageBackground
									source={{
										uri: playerContext.currentTrack?.artwork
											? playerContext.currentTrack
													?.artwork
											: `${homeImageLink}${numbers[ran]}.jpeg`,
									}}
									style={[
										styles.musicImage,
										{
											borderColor: whatIsTheme(
												COLORS.DARKPRIMARY,
												COLORS.LIGHTBACKGROUND
											),
										},
									]}
								>
									<TouchableNativeFeedback
										onPress={() =>
											playerContext.isPlaying
												? playerContext.pause()
												: playerContext.isPaused
												? playerContext.play()
												: cannotPlayFirstPlaySomething()
										}
									>
										<View
											style={{
												backgroundColor: `${whatIsTheme(
													COLORS.BLACK,
													COLORS.WHITE
												)}2f`,
												width: 200,
												height: 200,
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<Icon
												onPress={() =>
													playerContext.isPlaying
														? playerContext.pause()
														: playerContext.isPaused
														? playerContext.play()
														: cannotPlayFirstPlaySomething()
												}
												name={
													!playerContext.isPlaying
														? 'controller-play'
														: 'pause'
												}
												type={
													!playerContext.isPlaying
														? 'entypo'
														: 'ionicons'
												}
												size={75}
												color={whatIsTheme(
													COLORS.WHITE,
													COLORS.BLACK
												)}
												containerStyle={{
													backgroundColor: `${COLORS.BLACK}50`,
													width: 200,
													height: 200,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											/>
										</View>
									</TouchableNativeFeedback>
								</ImageBackground>
								<View style={styles.musicSecInsideFirstRow}>
									<Icon
										onPress={() => {
											if (playerContext.currentTrack)
												playerContext.seekTo(-10);
										}}
										iconStyle={styles.musicIcon}
										name='angle-double-left'
										type='font-awesome-5'
										size={38}
										color={whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										)}
									/>
									<Icon
										onPress={() => {
											if (playerContext.currentTrack)
												playerContext.seekTo(-10);
										}}
										iconStyle={styles.musicIcon}
										name='angle-double-right'
										type='font-awesome-5'
										size={38}
										color={whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										)}
									/>
								</View>
							</View>
							<View style={styles.musicSecondRow}>
								<Icon
									onPress={() => {
										if (playerContext.currentTrack)
											playerContext.playPrev();
									}}
									iconStyle={styles.musicIcon}
									name='skip-previous'
									type='ionicons'
									size={38}
									color={whatIsTheme(
										COLORS.WHITE,
										COLORS.BLACK
									)}
								/>
								<Icon
									onPress={() => {
										if (playerContext.currentTrack)
											playerContext.playNext();
									}}
									iconStyle={styles.musicIcon}
									name='skip-next'
									type='ionicons'
									size={38}
									color={whatIsTheme(
										COLORS.WHITE,
										COLORS.BLACK
									)}
								/>
							</View>
							<View></View>
						</View>

						<SongProgressSlider />
					</View>
				</View>

				<CurrentFeaturesArea liked={liked.current.likes} />

				<FutureFeaturesArea liked={liked.upcomming.likes} />

				<Text
					style={[
						styles.lastText,
						whatIsTheme(styles.textDark, styles.textLight),
					]}
				>
					This tab will be deprecated and not be used in next
					upcomming version.
				</Text>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},
	userText: {
		fontSize: 16,
		fontFamily: 'roboto',
		fontWeight: 'bold',
		padding: 3,
		marginLeft: 5,
		marginTop: 5,
	},
	userTextHolder: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	lastText: {
		fontSize: 16,
		textAlign: 'center',
		paddingVertical: 100,
		paddingTop: 20,
	},

	mainmainmu: {
		borderBottomWidth: 0.5,
	},
	startingMusic: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	mainMusic: {
		marginVertical: 15,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	musicImage: {
		width: 200,
		height: 200,
		borderRadius: 8,
		overflow: 'hidden',
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.4,
		padding: 3,
		elevation: 8,
	},
	musicFirstRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 3,
		paddingVertical: 4,
		justifyContent: 'center',
	},
	musicSecInsideFirstRow: {
		justifyContent: 'space-around',
		alignItems: 'center',
		height: 200,
		paddingHorizontal: 25,
	},
	musicSecondRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingHorizontal: 3,
		paddingVertical: 4,
		width: 200,
		borderRadius: 5,
	},
	musicIcon: {
		padding: 5,
		paddingHorizontal: 8,
		borderRadius: 100,
	},
});

export default Home;

/*
	return (
		<View style={styles.screen}>
			/* <Provider theme={DarkTheme}>
				<View>
					<Menu
						visible={menu}
						onDismiss={() => setMenu(false)}
						anchor={
							<Button
								onPress={() => {
									setMenu(true);
								}}>
								Show Menu
							</Button>
						}>
						<Menu.Item onPress={() => {}} title='Item 1' />
						<Menu.Item onPress={() => {}} title='Item 2' />
						<Divider />
						<Menu.Item onPress={() => {}} title='Item 3' />
					</Menu>
				</View>
			</Provider>

			<Provider theme={DarkTheme}>
				<View
					style={{
						flex: 1,
						alignContent: 'center',
						justifyContent: 'center',
						// backgroundColor: COLORS.ACCENT,
					}}>
					<Menu
						style={
							{
								// backgroundColor: COLORS.ACCENT,
							}
						}
						visible={menu}
						onDismiss={() => setMenu(false)}
						anchor={
							<IconButton
								style={{
									margin: 0,
								}}
								onPress={() => {
									props.navigation.toggleDrawer();
								}}
								icon={() => <Ionicons name='menu' color={COLORS.MID} size={26} />}
							/>
						}>
						<Menu.Item onPress={() => {}} title='Item 1' />
						<Menu.Item onPress={() => {}} title='Item 2' />
						<Divider />
						<Menu.Item onPress={() => {}} title='Item 3' />
					</Menu>
				</View>
			</Provider>
		</View>
	);
*/
