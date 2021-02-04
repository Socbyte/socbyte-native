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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import COLORS from '../../val/colors/Colors';

const image1 = 'https://raw.githubusercontent.com/Socbyte/src/main/images/intros/screen_1.png';
const image2 = 'https://raw.githubusercontent.com/Socbyte/src/main/images/intros/screen_2.png';
const image3 = 'https://raw.githubusercontent.com/Socbyte/src/main/images/intros/screen_3.png';
const image4 = 'https://raw.githubusercontent.com/Socbyte/src/main/images/intros/screen_4.png';
const image5 = 'https://raw.githubusercontent.com/Socbyte/src/main/images/intros/screen_5.png';

const IntroScreen = props => {
	const [sliderState, setSliderState] = useState({ currentPage: 0 });
	const { width, height } = Dimensions.get('window');
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' || !theme ? f : s;
	};

	const scroller = useRef(null);

	const setSliderPage = event => {
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

	const { currentPage: pageIndex } = sliderState;

	return (
		<>
			<StatusBar barStyle='dark-content' />
			<SafeAreaView style={{ flex: 1, backgroundColor: '#fc8941' || '#fedd00' || '#e7e7e7' }}>
				<ScrollView
					ref={scroller}
					onScroll={event => {
						setSliderPage(event);
					}}
					style={{ flex: 1 }}
					horizontal
					scrollEventThrottle={16}
					showsHorizontalScrollIndicator={false}
					pagingEnabled>
					<View style={{ width, height }}>
						<Image source={{ uri: image1 }} style={styles.image} />
						<Text style={whatIsTheme(styles.headingDark, styles.headingLight)}>
							Enjoy Music
						</Text>
						<Text style={whatIsTheme(styles.contentDark, styles.contentLight)}>
							Enjoy listening to music anytime, anywhere. Whatever the time is get
							ready to listen music of any mood.
						</Text>
					</View>
					<View style={{ width, height }}>
						<Image source={{ uri: image2 }} style={styles.image} />
						<Text style={whatIsTheme(styles.headingDark, styles.headingLight)}>
							Distraction-Free Interface!
						</Text>
						<Text style={whatIsTheme(styles.contentDark, styles.contentLight)}>
							The UI is pretty clean and easy to use. UI also contains many hidden
							features. You should explore them all.
						</Text>
					</View>
					<View style={{ width, height }}>
						<Image source={{ uri: image3 }} style={styles.image} />
						<Text style={whatIsTheme(styles.headingDark, styles.headingLight)}>
							Listening to every song you want.
						</Text>
						<Text style={whatIsTheme(styles.contentDark, styles.contentLight)}>
							Listen to whatever song you want to. It is available, Don't ask how!
						</Text>
					</View>
					<View style={{ width, height }}>
						<Image source={{ uri: image4 }} style={styles.image} />
						<Text style={whatIsTheme(styles.headingDark, styles.headingLight)}>
							Group Chats
						</Text>
						<Text style={whatIsTheme(styles.contentDark, styles.contentLight)}>
							Create Groups, Join existing groups, chat with anybody, anywhere, and
							about anything. Future updates will contains more exciting features
							related to group chats.
						</Text>
					</View>
					<View style={{ width, height }}>
						<Image source={{ uri: image5 }} style={styles.image} />
						<Text style={whatIsTheme(styles.headingDark, styles.headingLight)}>
							Themes
						</Text>
						<Text style={whatIsTheme(styles.contentDark, styles.contentLight)}>
							If Light Mode cause strain to your eye don't worry I created Dark mode
							to. Future updates may contain more modes like (colorish mode).
						</Text>
					</View>
				</ScrollView>
				<View style={styles.paginationWrapper}>
					{Array.from(Array(5).keys()).map((key, index) => (
						<View
							style={[
								styles.paginationDots,
								{ opacity: pageIndex === index ? 1 : 0.1 },
								{
									borderRadius: 10,
									backgroundColor: COLORS.BLACK,
								},
							]}
							key={index}
						/>
					))}
				</View>
				<View style={styles.buttonHolder}>
					{pageIndex > 0 ? (
						<TouchableOpacity
							onPress={() =>
								scroller.current.scrollTo({ x: (pageIndex - 1) * width })
							}>
							<View style={styles.buttonContainerFirst}>
								<Icon
									name='controller-play'
									type='entypo'
									size={21}
									color={COLORS.BLACK}
									iconStyle={{ transform: [{ rotateZ: '180deg' }] }}
								/>
							</View>
						</TouchableOpacity>
					) : (
						<View></View>
					)}
					{pageIndex >= 0 && pageIndex < 4 ? (
						<TouchableOpacity
							onPress={() =>
								scroller.current.scrollTo({ x: (pageIndex + 1) * width })
							}>
							<View style={styles.buttonContainerLast}>
								<Icon
									name='controller-play'
									type='entypo'
									size={21}
									color={COLORS.WHITE}
								/>
							</View>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={() => props.navigation.replace('TandCandPP')}>
							<View style={styles.getStartedButton}>
								<Text style={styles.getStartedText}>Get Started</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	paginationWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 42,
	},
	paginationDots: {
		marginLeft: 6,
		height: 8,
		width: 8,
	},
	image: {
		width: '100%',
		height: 400,
		resizeMode: 'cover',
	},

	headingDark: {
		color: COLORS.BLACK,
		fontSize: 26,
		fontFamily: 'karlaBold',
		textAlign: 'center',
		marginTop: 22,
		padding: 4,
	},
	headingLight: {
		color: COLORS.BLACK,
		fontSize: 26,
		fontFamily: 'karlaBold',
		textAlign: 'center',
		marginTop: 22,
		padding: 4,
	},
	contentDark: {
		color: COLORS.DARKTEXT,
		textAlign: 'center',
		padding: 10,
		marginHorizontal: 16,
	},
	contentLight: {
		color: COLORS.DARKTEXT,
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
		paddingHorizontal: 18,
	},
	buttonContainerFirst: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 60,
		padding: 6,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: COLORS.WHITE,
	},
	buttonContainerLast: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 60,
		padding: 0,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: COLORS.BLACK,
	},
	getStartedButton: {
		backgroundColor: COLORS.BLACK,
		borderRadius: 50,
		padding: 16,
	},
	getStartedText: {
		color: COLORS.WHITE,
		fontSize: 17,
		fontFamily: 'karla',
	},
});

export default IntroScreen;