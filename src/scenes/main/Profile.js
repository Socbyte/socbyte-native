import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	ImageBackground,
	FlatList,
	Animated,
	Platform,
	TouchableWithoutFeedback,
	Easing,
	Linking,
	ToastAndroid,
} from 'react-native';
import {
	TouchableRipple,
	Avatar,
	Caption,
	Title,
	Text,
	ProgressBar,
	Paragraph,
	Banner,
	Menu,
	Button,
	IconButton,
	Card,
	Switch,
	Searchbar,
	Provider,
	Divider,
	DarkTheme,
	DefaultTheme,
} from 'react-native-paper';
import { Icon, SocialIcon } from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import ImageColors from 'react-native-image-colors';

import Header from '../../components/customs/Header/Header';
import { databaseInit, fetchDatabase, insertDatabase, updateDatabase } from '../../sql/SQLStarter';
import { updateSettings } from '../../store/Settings';
import COLORS, { ISDARKCOLOR } from '../../val/colors/Colors';

const imageCoverTemp =
	'https://user-images.githubusercontent.com/50291544/104044423-4de27b80-5203-11eb-84e8-11fd627a7fc4.png';
const textLengthLimit = 200; //number of characters

const Arrows = props => {
	// let arr = [];
	// useEffect(() => {
	// 	for (let i = 1; i <= props.num; ++i) arr.push(i);
	// }, []);

	return (
		<>
			<Ionicons
				size={24}
				name={props.way === 'r' ? 'chevron-forward' : 'chevron-back'}
				color={props.delete ? COLORS.RED : props.color}
			/>
			<Ionicons
				size={24}
				name={props.way === 'r' ? 'chevron-forward' : 'chevron-back'}
				color={props.delete ? COLORS.RED : props.color}
			/>
			<Ionicons
				size={24}
				name={props.way === 'r' ? 'chevron-forward' : 'chevron-back'}
				color={props.delete ? COLORS.RED : props.color}
			/>
			<Ionicons
				size={24}
				name={props.way === 'r' ? 'chevron-forward' : 'chevron-back'}
				color={props.delete ? COLORS.RED : props.color}
			/>
			<Ionicons
				size={24}
				name={props.way === 'r' ? 'chevron-forward' : 'chevron-back'}
				color={props.delete ? COLORS.RED : props.color}
			/>
		</>
	);
};

const Profile = props => {
	// coverImg
	// profileImg
	// fullname
	// username
	// email
	// status
	// about
	// location
	// education
	// expertise
	// ratings
	// facolor
	// phoneNo
	// profileType
	// publics
	const { theme } = useSelector(state => state.settings.settings);
	const {
		coverImg,
		profileImg,
		fullname,
		username,
		email,
		status,
		about,
		location,
		expertise,
		education,
		social,
		joinedOn,
		ratings,
		facolor,
	} = useSelector(state => state.main.user);
	const dispatch = useDispatch();

	const [lengthOfAbout, setLengthOfAbout] = useState(textLengthLimit);
	const [socialAvailable, setSocialAvailable] = useState(false);

	// this is the final expertise list shown to the user
	let finalExpertise = [];
	if (expertise) finalExpertise = expertise.split(',');

	// this is the final education list shown to the user
	let finalEducation = [];
	if (education) for (let i in education) finalEducation.push(education[i]);

	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	// user social links
	// let facebook, github, twitter, instagram, linkedin, dribbble;
	// if (social) {
	// 	github = social.github;
	// 	linkedin = social.linkedin;
	// 	dribbble = social.dribbble;
	// 	facebook = social.facebook;
	// 	instagram = social.instagram;
	// 	twitter = social.twitter;
	// }

	const toggleAboutLength = () => {
		if (about.length > textLengthLimit - 3)
			setLengthOfAbout(lengthOfAbout === textLengthLimit ? -1 : textLengthLimit);
	};

	const openLink = async link => {
		const linkSupported = await Linking.canOpenURL(link);
		if (linkSupported) {
			await Linking.openURL(link);
		} else {
			ToastAndroid.showWithGravity(
				`Cannot open the link in browser, Since your phone doesn\'t support to this link -> ${link}`,
				ToastAndroid.LONG,
				ToastAndroid.CENTER
			);
		}
	};

	const posLength = text => {
		return text.length > 0;
	};

	const socialArePresent = () => {
		// social.dribbble ||
		if (
			posLength(social.github) ||
			posLength(social.linkedin) ||
			posLength(social.facebook) ||
			posLength(social.instagram) ||
			posLength(social.twitter)
		) {
			setSocialAvailable(true);
		} else {
			setSocialAvailable(false);
		}
	};

	const updateProfileStatus = () => {
		props.navigation.navigate('EditProfilePart', { part: 'status', edit: true });
	};
	const updateProfileAbout = () => {
		props.navigation.navigate('EditProfilePart', { part: 'about', edit: true });
	};

	const updateSocialLinks = () => {
		props.navigation.navigate('EditProfilePart', { part: 'social', edit: true });
	};

	const updateExpertise = () => {
		props.navigation.navigate('EditProfilePart', { part: 'expertise', edit: true });
	};

	const updateLocation = () => {
		props.navigation.navigate('EditProfilePart', { part: 'location', edit: true });
	};

	const updateEducation = () => {
		props.navigation.navigate('EditProfilePart', { part: 'edu', edit: true });
	};

	const removeProfileStatus = () => {
		props.navigation.navigate('EditProfilePart', { part: 'status', edit: false });
	};

	const removeProfileAbout = () => {
		props.navigation.navigate('EditProfilePart', { part: 'about', edit: false });
	};

	const removeProfileLocation = () => {
		props.navigation.navigate('EditProfilePart', { part: 'location', edit: false });
	};

	const renderLeftActions = (progress, dragX) => {
		const scale = dragX.interpolate({
			inputRange: [0, 100],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		});

		return (
			<View style={styles.noBackRow}>
				<Animated.Text
					style={[
						styles.hiddenText,
						{
							color: whatIsTheme(COLORS.GREEN, COLORS.PRIMARY),
							transform: [{ scale }],
						},
					]}>
					Edit
				</Animated.Text>
				<Arrows color={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)} way='r' />
			</View>
		);
	};

	const renderRightActionss = (which, progress, dragX) => {
		if (
			(which === 'about' && (!about || about.length <= 0)) ||
			(which === 'status' && (!status || status.length <= 0))
		) {
			return <View></View>;
		}

		const scale = dragX.interpolate({
			inputRange: [-100, 0],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		});

		return (
			<View style={styles.noBackRow}>
				<Arrows delete color={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)} way='l' />

				<Animated.Text
					style={[
						styles.hiddenText,
						{
							color: whatIsTheme(COLORS.RED, COLORS.RED),
							transform: [{ scale }],
						},
					]}>
					Remove
				</Animated.Text>
			</View>
		);
	};

	const [menu, setMenu] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' || !theme ? f : s;
	};

	useEffect(() => {
		if (social) {
			socialArePresent();
		}
	}, [social]);
	const [vibrants, setVibrants] = useState('#804088');

	useEffect(() => {
		ImageColors.getColors(coverImg ? coverImg : imageCoverTemp, {
			fallback: '#000000',
			quality: 'low',
			pixelSpacing: 5,
		}).then(res => {
			setVibrants(res);
		});
	}, []);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={username}
				absolute
				backgroundColor={vibrants.vibrant ? vibrants.vibrant : null}
			/>

			<ScrollView>
				{/* coverImg, profileImgGravatar */}
				<ImageBackground
					style={styles.coverImg}
					source={{ uri: coverImg ? coverImg : imageCoverTemp }}>
					{/* <View style={styles.particularHeader}>
						<View style={styles.defaultHeaderWay}>
							<Icon type='ionicons' name='menu' color={COLORS.WHITE} size={24} />
							<Text
								style={[
									{
										color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
									},
								]}>
								{username}
							</Text>
						</View>
						<View style={styles.otherHeaderButtons}></View>
					</View> */}
					{profileImg ? (
						<Avatar.Image
							style={whatIsTheme(styles.avatarDark, styles.avatarLight)}
							size={111}
							source={{ uri: profileImg }}
						/>
					) : (
						<Avatar.Text
							style={whatIsTheme(styles.avatarDark, styles.avatarLight)}
							labelStyle={whatIsTheme(
								styles.avatarLabelDark,
								styles.avatarLabelLight
							)}
							label={username ? username[0].toUpperCase() : ''}
						/>
					)}
				</ImageBackground>

				{/* fullname, username, email */}
				<View style={styles.detailsStart}>
					<Text style={whatIsTheme(styles.fullnameDark, styles.fullnameLight)}>
						{fullname}
					</Text>
					<Caption style={whatIsTheme(styles.usernameDark, styles.usernameLight)}>
						@{username}
					</Caption>
					<Caption style={whatIsTheme(styles.emailDark, styles.emailLight)}>
						{email}
					</Caption>
				</View>

				{/* status */}
				<Swipeable
					renderLeftActions={renderLeftActions}
					onSwipeableLeftOpen={updateProfileStatus}
					renderRightActions={(progress, dragX) =>
						renderRightActionss('status', progress, dragX)
					}
					onSwipeableRightOpen={status ? removeProfileStatus : null}>
					<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							Status
						</Title>

						<Paragraph
							// selectable={true}
							// selectionColor={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
							style={whatIsTheme(styles.paraDark, styles.paraLight)}>
							{status ? (
								status
							) : (
								<Paragraph style={whatIsTheme(styles.paraDark, styles.paraLight)}>
									No status provided by{' '}
									<Caption
										style={whatIsTheme(
											styles.usernameDark,
											styles.usernameLight
										)}>
										@{username}
									</Caption>
								</Paragraph>
							)}
						</Paragraph>
					</View>
				</Swipeable>

				{/* about */}
				<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
					<Swipeable
						renderLeftActions={renderLeftActions}
						onSwipeableLeftOpen={updateProfileAbout}
						renderRightActions={(progress, dragX) =>
							renderRightActionss('about', progress, dragX)
						}
						onSwipeableRightOpen={about ? removeProfileAbout : null}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							About
						</Title>
					</Swipeable>

					<TouchableWithoutFeedback onPress={toggleAboutLength}>
						{about ? (
							<Paragraph
								// selectable={true}
								// selectionColor={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
								style={whatIsTheme(styles.paraDark, styles.paraLight)}>
								{lengthOfAbout === textLengthLimit
									? about.substring(0, textLengthLimit - 3)
									: about}
								{'  '}
								{about.length > textLengthLimit - 3 ? (
									<Caption style={styles.extraText}>
										{lengthOfAbout === textLengthLimit
											? 'Read More...'
											: 'Read Less...'}
									</Caption>
								) : null}
							</Paragraph>
						) : (
							<Paragraph style={whatIsTheme(styles.paraDark, styles.paraLight)}>
								About not provided by{' '}
								<Caption
									style={whatIsTheme(styles.usernameDark, styles.usernameLight)}>
									@{username}
								</Caption>
							</Paragraph>
						)}
					</TouchableWithoutFeedback>
				</View>

				{/* location */}
				{location ? (
					<Swipeable
						renderLeftActions={renderLeftActions}
						onSwipeableLeftOpen={updateLocation}
						renderRightActions={(progress, dragX) =>
							renderRightActionss('', progress, dragX)
						}
						onSwipeableRightOpen={removeProfileLocation}>
						<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
							<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								Lives In
							</Title>
							<Text style={whatIsTheme(styles.paraDark, styles.paraLight)}>
								{location}
							</Text>
						</View>
					</Swipeable>
				) : null}

				{/* expertise */}
				<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
					<Swipeable
						renderLeftActions={renderLeftActions}
						onSwipeableLeftOpen={updateExpertise}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							Expertise
						</Title>
					</Swipeable>

					<View style={[styles.expertiseHolder]}>
						{finalExpertise.map(exp => {
							return (
								<Text
									key={exp}
									style={whatIsTheme(
										styles.expertiseDark,
										styles.expertiseLight
									)}>
									{exp}
								</Text>
							);
						})}
					</View>
				</View>

				{/* educations */}
				<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
					<Swipeable
						renderLeftActions={renderLeftActions}
						onSwipeableLeftOpen={updateEducation}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							Education
						</Title>
					</Swipeable>

					<View styles={styles.educationHolder}>
						{finalEducation.map((item, _) => {
							return (
								<View
									key={_}
									style={whatIsTheme(
										styles.educationSectionCardDark,
										styles.educationSectionCardLight
									)}>
									<Text
										style={[
											whatIsTheme(
												styles.educationBoldTextDark,
												styles.educationBoldTextLight
											),
											whatIsTheme(styles.font16Dark, styles.font16Light),
										]}>
										{item.degree}
									</Text>
									<Text
										style={whatIsTheme(
											styles.educationBoldTextDark,
											styles.educationBoldTextLight
										)}>
										{item.school}
									</Text>
									<Caption
										style={whatIsTheme(
											styles.educationRegularTextDark,
											styles.educationRegularTextLight
										)}>
										{`${item.yearFrom} - ${item.yearTo}`}
									</Caption>
								</View>
							);
						})}
					</View>
				</View>

				{/* social links */}
				{socialAvailable ? (
					<Swipeable
						renderLeftActions={renderLeftActions}
						onSwipeableLeftOpen={updateSocialLinks}>
						<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
							<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								{`${fullname}'s Social Media`}
							</Title>
							<View style={styles.iconContainer}>
								{social.github ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='github'
											title='Github'
											onPress={() => openLink(social.github)}
										/>
									</View>
								) : null}

								{social.linkedin ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='linkedin'
											title='Linkedin'
											onPress={() => openLink(social.linkedin)}
										/>
									</View>
								) : null}

								{social.twitter ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='twitter'
											title='Twitter'
											onPress={() => openLink(social.twitter)}
										/>
									</View>
								) : null}

								{social.facebook ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='facebook'
											title='Facebook'
											onPress={() => openLink(social.facebook)}
										/>
									</View>
								) : null}

								{social.instagram ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='instagram'
											title='Instagram'
											onPress={() => openLink(social.instagram)}
										/>
									</View>
								) : null}
							</View>
						</View>
					</Swipeable>
				) : null}

				<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
					<Text style={whatIsTheme(styles.joinedOnDark, styles.joinedOnLight)}>
						{`Joined On: ${months[joinedOn.month]} ${joinedOn.year}`}
					</Text>
				</View>
				<View style={styles.lastElementOfTheProfileScrollView}></View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	lastElementOfTheProfileScrollView: {
		paddingBottom: 100,
	},
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	coverImg: {
		height: 235,
		width: '100%',
		resizeMode: 'cover',
		justifyContent: 'flex-end',
		elevation: 5,
		alignItems: 'center',
	},
	particularHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
	},

	defaultHeaderWay: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	otherHeaderButtons: {
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

	darkTheme: {
		color: COLORS.GREEN,
		fontSize: 35,
	},
	lightTheme: {
		color: COLORS.PRIMARY,
		fontSize: 35,
	},

	usersectionDark: {
		// padding: 6,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		// flexDirection: 'row',
	},
	usersectionLight: {
		// padding: 6,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.GREEN,
		// flexDirection: 'row',
	},

	avatarLight: {
		backgroundColor: COLORS.TRANSPARENT,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.PRIMARY,
		overflow: 'hidden',
		maxWidth: 111,
		maxHeight: 111,
		width: 111,
		height: 111,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000030',
		top: 55,
		elevation: 3,
	},
	avatarDark: {
		backgroundColor: COLORS.TRANSPARENT,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.GREEN,
		overflow: 'hidden',
		maxWidth: 111,
		maxHeight: 111,
		width: 111,
		height: 111,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff30',
		top: 55,
		elevation: 3,
	},

	avatarLabelDark: {
		color: COLORS.GREEN,
		fontFamily: 'inter',
		fontSize: 45,
	},
	avatarLabelLight: {
		color: COLORS.PRIMARY,
		fontFamily: 'inter',
		fontSize: 45,
	},

	detailsStart: {
		marginTop: 60,
		alignItems: 'center',
	},

	fullnameDark: {
		fontSize: 19,
		color: COLORS.WHITE,
		padding: 3,
		textTransform: 'capitalize',
	},
	fullnameLight: {
		fontSize: 19,
		color: COLORS.BLACK,
		padding: 3,
		textTransform: 'capitalize',
	},

	usernameDark: {
		fontSize: 15,
		color: COLORS.GREEN,
	},
	usernameLight: {
		fontSize: 15,
		color: COLORS.PRIMARY,
	},

	emailDark: {
		fontSize: 15,
		color: COLORS.WHITE,
		marginBottom: 10,
	},
	emailLight: {
		fontSize: 15,
		color: COLORS.BLACK,
		marginBottom: 10,
	},

	expertiseDark: {
		color: COLORS.DARKGLOW,
		backgroundColor: COLORS.GREEN,
		padding: 10,
		margin: 5,
		borderRadius: 15,
	},
	expertiseLight: {
		color: COLORS.BEFORELIGHT,
		backgroundColor: COLORS.PRIMARY,
		padding: 10,
		margin: 5,
		borderRadius: 15,
	},
	expertiseHolder: {
		// alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginTop: 10,
		paddingHorizontal: 3,
	},

	extraText: {
		color: COLORS.MID,
	},

	sectionDark: {
		padding: 5,
		borderTopColor: COLORS.DARKGLOW,
		borderTopWidth: 1,
		borderBottomColor: COLORS.DARKGLOW,
		borderBottomWidth: 1,
		marginVertical: 10,
		elevation: 1,
		backgroundColor: COLORS.DARKPRIMARY,
		color: COLORS.WHITE,
	},
	sectionLight: {
		padding: 5,
		borderTopColor: COLORS.DARKFORLIGHT,
		borderTopWidth: 1,
		borderBottomColor: COLORS.DARKFORLIGHT,
		borderBottomWidth: 1,
		marginVertical: 10,
		elevation: 1,
		backgroundColor: COLORS.LIGHTBACKGROUND,
		color: COLORS.BLACK,
	},

	titleDark: {
		fontSize: 18,
		paddingTop: 3,
		paddingLeft: 3,
		fontFamily: 'roboto',
		color: COLORS.GREEN,
		backgroundColor: COLORS.DARKPRIMARY,
	},
	titleLight: {
		fontSize: 18,
		paddingTop: 3,
		paddingLeft: 3,
		fontFamily: 'roboto',
		color: COLORS.PRIMARY,
		backgroundColor: COLORS.LIGHTBACKGROUND,
	},

	paraDark: {
		paddingHorizontal: 5,
		fontFamily: 'Inter',
		color: COLORS.WHITE,
	},
	paraLight: {
		paddingHorizontal: 5,
		fontFamily: 'Inter',
		color: COLORS.BLACK,
	},

	noBackRow: {
		backgroundColor: COLORS.TRANSPARENT,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	hiddenText: {
		fontWeight: '600',
		fontSize: 20,
		paddingHorizontal: 20,
	},

	educationSectionCardDark: {
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 5,
		paddingVertical: 8,
		paddingHorizontal: 5,
		marginVertical: 5,
		marginHorizontal: 2,
		elevation: 1,
	},
	educationSectionCardLight: {
		backgroundColor: COLORS.BEFORELIGHT,
		borderRadius: 5,
		paddingVertical: 8,
		paddingHorizontal: 5,
		marginVertical: 5,
		marginHorizontal: 2,
		elevation: 1,
	},

	educationBoldTextDark: {
		color: COLORS.WHITE,
		fontSize: 15,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},
	educationBoldTextLight: {
		color: COLORS.DARKSECONDARY,
		fontSize: 15,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},

	font16Dark: {
		fontSize: 16,
		color: COLORS.GREEN,
	},
	font16Light: {
		fontSize: 16,
		color: COLORS.PRIMARY,
	},

	educationRegularTextDark: {
		color: COLORS.MID,
		fontSize: 13,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},
	educationRegularTextLight: {
		color: COLORS.MID,
		fontSize: 13,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},

	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 6,
		paddingHorizontal: 3,
		flexWrap: 'wrap',
	},
	iconHolder: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	joinedOnDark: {
		paddingVertical: 10,
		color: COLORS.BEFORELIGHT,
		textAlign: 'center',
		width: '100%',
		marginVertical: 10,
		fontSize: 19,
		fontFamily: 'Inter',
	},
	joinedOnLight: {
		paddingVertical: 10,
		color: COLORS.DARKGLOW,
		textAlign: 'center',
		width: '100%',
		marginVertical: 10,
		fontSize: 19,
		fontFamily: 'Inter',
	},
});

export default Profile;

// databaseInit()
// 	.then(() => {
// 		console.log('DATABASE CREATED');
// 	})
// 	.catch(err => {
// 		console.log('ERROR WHILE CREATING SETTING DATABASE IN PROFILE');
// 		console.log(err);
// 	});

// insertDatabase('testKey1', 'testValue2')
// 	.then(result => {
// 		console.log('DATABASE INSERTED');
// 		console.log(result);
// 	})
// 	.catch(err => {
// 		console.log('ERROR WHILE INSERTING DATABASE FROM PROFILE SECTION');
// 	});

// updateDatabase('testKey', 'testValue2')
// 	.then(result => {
// 		console.log('DATABASE UPDATED');
// 		console.log(result);
// 	})
// 	.catch(err => {
// 		console.log('ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION');
// 	});

// const toggleTheme = () => {
// 	// console.log('TOGGLE THE CURRENT THEME...');
// 	const toggledTheme = theme === 'd' ? 'l' : 'd';
// 	updateDatabase('theme', toggledTheme)
// 		.then(result => {
// 			// console.log('DATABASE UPDATED');
// 			// console.log(result);
// 			dispatch(updateSettings('theme', toggledTheme));
// 		})
// 		.catch(err => {
// 			console.log('ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION');
// 			console.log(err);
// 		});
// };
