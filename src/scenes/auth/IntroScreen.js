import React, { useEffect, useRef, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Text,
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import COLORS from '../../val/colors/Colors';
import { setDefaultsValuesLogOUt } from '../../store/MainStore';

const image1 =
	'https://raw.githubusercontent.com/Socbyte/src/main/images/introswb/screen_1.png';
const image2 =
	'https://raw.githubusercontent.com/Socbyte/src/main/images/introswb/screen_2.png';
const image3 =
	'https://raw.githubusercontent.com/Socbyte/src/main/images/introswb/screen_3.png';
const image4 =
	'https://raw.githubusercontent.com/Socbyte/src/main/images/introswb/screen_4.png';
const image5 =
	'https://raw.githubusercontent.com/Socbyte/src/main/images/introswb/screen_5.png';

const IntroScreen = (props) => {
	const [sliderState, setSliderState] = useState({ currentPage: 0 });
	const { width, height } = Dimensions.get('window');
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' || !theme ? f : s;
	};

	const scroller = useRef(null);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setDefaultsValuesLogOUt());
	}, []);

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
		// console.log(event.nativeEvent.contentOffset.x, );
	};

	const { currentPage: pageIndex } = sliderState;

	const openPolicies = () => {
		props.navigation.replace('TandCandPP');
	};

	return (
		<>
			<StatusBar barStyle='dark-content' backgroundColor={'#0F60B6'} />
			<SafeAreaView
				style={{
					flex: 1,
					// backgroundColor: '#fc8941' || '#fedd00' || '#e7e7e7',
				}}
			>
				<LinearGradient
					colors={[
						'#0F60B6',
						'#0F60B6',
						'#0F60B6',
						'#008BD2',
						'#008BD2',
					]}
					style={{ flex: 1 }}
				>
					<View style={styles.paginationWrapper}>
						{Array.from(Array(5).keys()).map((key, index) => (
							<TouchableOpacity
								onPress={() => {
									scroller.current.scrollTo({
										x: index * width,
									});
								}}
							>
								<View
									style={[
										{
											opacity:
												pageIndex === index ? 1 : 0.3,
										},
										{
											marginLeft: 6,
											height: 9,
											width: 9,
											borderRadius: 10,
											backgroundColor: COLORS.WHITE,
										},
									]}
									key={index}
								/>
							</TouchableOpacity>
						))}
					</View>

					<ScrollView
						ref={scroller}
						onScroll={(event) => {
							setSliderPage(event);
						}}
						style={{ flex: 1 }}
						horizontal
						scrollEventThrottle={16}
						showsHorizontalScrollIndicator={false}
						pagingEnabled
					>
						<View style={{ width, height }}>
							<Image
								source={{ uri: image1 }}
								style={styles.image}
							/>
							<Text
								style={whatIsTheme(
									styles.headingDark,
									styles.headingLight
								)}
							>
								Enjoy Music
							</Text>
							<Text
								style={whatIsTheme(
									styles.contentDark,
									styles.contentLight
								)}
							>
								Enjoy listening to music anytime, anywhere.
								Whatever the time is get ready to listen music
								of any mood.
							</Text>
						</View>
						<View style={{ width, height }}>
							<Image
								source={{ uri: image2 }}
								style={styles.image}
							/>
							<Text
								style={whatIsTheme(
									styles.headingDark,
									styles.headingLight
								)}
							>
								Distraction-Free Interface!
							</Text>
							<Text
								style={whatIsTheme(
									styles.contentDark,
									styles.contentLight
								)}
							>
								The UI is pretty clean and easy to use. UI also
								contains many hidden features. You should
								explore them all.
							</Text>
						</View>
						<View style={{ width, height }}>
							<Image
								source={{ uri: image3 }}
								style={styles.image}
							/>
							<Text
								style={whatIsTheme(
									styles.headingDark,
									styles.headingLight
								)}
							>
								Listening to every song you want.
							</Text>
							<Text
								style={whatIsTheme(
									styles.contentDark,
									styles.contentLight
								)}
							>
								Listen to whatever song you want to. It is
								available, Don't ask how!
							</Text>
						</View>
						<View style={{ width, height }}>
							<Image
								source={{ uri: image4 }}
								style={styles.image}
							/>
							<Text
								style={whatIsTheme(
									styles.headingDark,
									styles.headingLight
								)}
							>
								Group Chats
							</Text>
							<Text
								style={whatIsTheme(
									styles.contentDark,
									styles.contentLight
								)}
							>
								Create Groups, Join existing groups, chat with
								anybody, anywhere, and about anything. Future
								updates will contains more exciting features
								related to group chats.
							</Text>
						</View>
						<View style={{ width, height }}>
							<Image
								source={{ uri: image5 }}
								style={styles.image}
							/>
							<Text
								style={whatIsTheme(
									styles.headingDark,
									styles.headingLight
								)}
							>
								Themes
							</Text>
							<Text
								style={whatIsTheme(
									styles.contentDark,
									styles.contentLight
								)}
							>
								If Light Mode cause strain to your eye don't
								worry I created Dark mode to. Future updates may
								contain more modes like (colorish mode).
							</Text>
						</View>
					</ScrollView>

					<View style={styles.buttonHolder}>
						<TouchableOpacity onPress={openPolicies}>
							<View style={styles.buttonContainerFirst}>
								<Icon
									name='cross'
									type='entypo'
									size={21}
									color={COLORS.BLACK}
								/>
							</View>
						</TouchableOpacity>

						<View style={{ flexDirection: 'row' }}>
							<>
								{pageIndex > 0 ? (
									<TouchableOpacity
										onPress={() =>
											scroller.current.scrollTo({
												x: (pageIndex - 1) * width,
											})
										}
									>
										<View
											style={[
												styles.buttonContainerLast,
												{ marginRight: 0 },
											]}
										>
											<Icon
												name='controller-play'
												type='entypo'
												size={21}
												color={COLORS.WHITE}
												iconStyle={{
													transform: [
														{ rotateZ: '180deg' },
													],
												}}
											/>
										</View>
									</TouchableOpacity>
								) : (
									<View></View>
								)}
								{pageIndex >= 0 && pageIndex < 4 ? (
									<TouchableOpacity
										onPress={() =>
											scroller.current.scrollTo({
												x: (pageIndex + 1) * width,
											})
										}
									>
										<View
											style={styles.buttonContainerLast}
										>
											<Icon
												name='controller-play'
												type='entypo'
												size={21}
												color={COLORS.WHITE}
											/>
										</View>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={() => openPolicies()}
									>
										<View style={styles.getStartedButton}>
											<Text style={styles.getStartedText}>
												Get Started
											</Text>
										</View>
									</TouchableOpacity>
								)}
							</>
						</View>
					</View>
				</LinearGradient>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	paginationWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 13,
		// position: 'absolute',
		// left: 0,
		// right: 0,
		// top: 13,
		// bottom: 10,
	},
	image: {
		width: '100%',
		height: 400,
		resizeMode: 'contain',
		marginTop: 0,
	},

	headingDark: {
		color: COLORS.INTRO_HEADING,
		fontSize: 26,
		fontFamily: 'karlaBold',
		textAlign: 'center',
		marginTop: 15,
		padding: 4,
		margin: 5,
	},
	headingLight: {
		color: COLORS.INTRO_HEADING,
		fontSize: 26,
		fontFamily: 'karlaBold',
		textAlign: 'center',
		marginTop: 15,
		padding: 4,
		margin: 5,
	},
	contentDark: {
		color: COLORS.INTRO_TEXT,
		textAlign: 'center',
		padding: 10,
		marginHorizontal: 16,
	},
	contentLight: {
		color: COLORS.INTRO_TEXT,
		textAlign: 'center',
		padding: 10,
		marginHorizontal: 16,
	},
	buttonHolder: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 18,
		paddingHorizontal: 0,
	},
	buttonContainerFirst: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 55,
		height: 55,
		padding: 6,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: COLORS.WHITE,
		marginHorizontal: 10,
	},
	buttonContainerLast: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 55,
		height: 55,
		padding: 0,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: COLORS.BLACK,
		marginHorizontal: 8,
	},
	getStartedButton: {
		backgroundColor: COLORS.BLACK,
		borderRadius: 50,
		padding: 16,
		marginHorizontal: 8,
	},
	getStartedText: {
		color: COLORS.WHITE,
		fontSize: 17,
		fontFamily: 'karla',
	},

	skipButton: {
		backgroundColor: COLORS.WHITEINDARKVIDIBLE,
		color: COLORS.WHITE,
		borderRadius: 3,
		right: 10,
		top: 10,
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	skipButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontFamily: 'karla',
		textAlign: 'center',
		textAlignVertical: 'center',
		padding: 3,
	},
});

export default IntroScreen;
