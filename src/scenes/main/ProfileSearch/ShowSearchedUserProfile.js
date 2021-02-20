import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	ImageBackground,
	ScrollView,
	FlatList,
	Animated,
	Platform,
	TouchableWithoutFeedback,
	Easing,
	Linking,
	ToastAndroid,
	TouchableOpacity,
	Image,
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
	Button,
	IconButton,
	Card,
	Switch,
	Searchbar,
	Provider,
	Divider,
	DarkTheme,
	DefaultTheme,
	ActivityIndicator,
} from 'react-native-paper';
import {
	Icon,
	SocialIcon,
	Avatar as ElementAvatar,
} from 'react-native-elements';
import { useSelector } from 'react-redux';
import md5 from 'md5';

import ImageColors from 'react-native-image-colors';

import Header from '../../../components/customs/Header/Header';
import firebase from '../../../firebase/Firebase';
import COLORS from '../../../val/colors/Colors';
import { usePlayerContext } from '../music/context/PlayerContext';
import { NotificationTypes } from '../../../val/constants/Constants';

const imageCoverTemp = [
	'https://user-images.githubusercontent.com/50291544/104044423-4de27b80-5203-11eb-84e8-11fd627a7fc4.png',
	'http://wallpaperinfinity.net/wp-content/uploads/2020/05/cube-abstract-wallpaper-hd-800x600.jpg',
	'https://wallpaperaccess.com/full/48071.jpg',
	'https://cutewallpaper.org/21/dark-abstract-wallpapers/Abstract-Dark-Wallpaper-Center-1920x1080-Keysinspectorinc.com.jpg',
	'https://wallpaperaccess.com/full/48074.jpg',
	'https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg',
	'https://wallpapercave.com/wp/exhooYI.jpg',
	'https://image.freepik.com/free-vector/colorful-abstract-wallpaper-design_23-2148467625.jpg',
	'https://i.redd.it/52f61nfzmwl51.jpg',
	'https://images.hdqwalls.com/wallpapers/twitz-color-abstract-se.jpg',
];

const textLengthLimit = 200;
const months = [
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

const ShowSearchedUserProfile = (props) => {
	const { username, following } = useSelector((state) => state.main.user);
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};
	const playerContext = usePlayerContext();
	const { uid, usernameText } = props.route.params;

	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState({
		coverImg: '',
		profileImg: '',
		fullname: '',
		username: '',
		email: '',
		status: '',
		about: '',
		location: '',
		expertise: '',
		education: {},
		social: {},
		joinedOn: {},
		sound: '',
		followers: 0,
		following: 0,
		ratings: '',
		facolor: '',
	});
	const [followingUser, setFollowing] = useState(false);
	const [lengthOfAbout, setLengthOfAbout] = useState(textLengthLimit);
	const [socialAvailable, setSocialAvailable] = useState(false);
	const [ranImageAndColor] = useState(Math.floor(Math.random() * 10));

	// this is the final expertise list shown to the user
	let finalExpertise = [];
	if (userData.expertise) finalExpertise = userData.expertise.split(',');

	// this is the final education list shown to the user
	let finalEducation = [];
	if (userData.education)
		for (let i in userData.education)
			finalEducation.push(userData.education[i]);

	const toggleAboutLength = () => {
		if (userData.about.length > textLengthLimit - 3)
			setLengthOfAbout(
				lengthOfAbout === textLengthLimit ? -1 : textLengthLimit
			);
	};

	const posLength = (text) => {
		if (!text) return false;
		return text.length > 0;
	};

	const socialArePresent = () => {
		// social.dribbble ||
		if (
			posLength(userData.social.github) ||
			posLength(userData.social.linkedin) ||
			posLength(userData.social.facebook) ||
			posLength(userData.social.instagram) ||
			posLength(userData.social.twitter)
		) {
			setSocialAvailable(true);
		} else {
			setSocialAvailable(false);
		}
	};

	const openLink = async (link) => {
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

	const playProfileSong = () => {
		if (userData.sound && userData.sound.duration) {
			const formatedDuration = formatDuration(userData.sound.duration);

			playerContext.play({
				id: userData.sound.id,
				title: `${usernameText}'s Profile Music.`,
				artist: 'This Is A Profile Music',
				duration: userData.sound.duration,
				url: userData.sound.url,
				artwork: userData.coverImg
					? userData.coverImg
					: imageCoverTemp[ranImageAndColor],
				durationEdited: formatedDuration,
			});
		} else {
			ToastAndroid.showWithGravity(
				`${usernameText} has not provided any track.`,
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		}
	};

	const userId = firebase.auth().currentUser.uid;
	const startFollowingUser = () => {
		const timestamp = new Date().getTime();

		if (!followingUser) {
			firebase
				.database()
				.ref('Followers')
				.child(uid)
				.child(userId)
				.update({
					uid: userId,
					email: firebase.auth().currentUser.email,
					username: username,
				})
				.then((res) => {
					firebase
						.database()
						.ref('Users')
						.child(uid)
						.update({
							followers: userData.followers + 1,
						})
						.then((updated) => {
							ToastAndroid.showWithGravity(
								'You are now following ' + usernameText,
								ToastAndroid.SHORT,
								ToastAndroid.CENTER
							);
						})
						.catch((err) => {
							ToastAndroid.showWithGravity(
								'Something went wrong',
								ToastAndroid.SHORT,
								ToastAndroid.BOTTOM
							);
						});

					// firebase.database().ref('Users').child(uid).child('notifications').orderByChild()
				})
				.catch((err) => {
					ToastAndroid.showWithGravity(
						'Something went wrong',
						ToastAndroid.SHORT,
						ToastAndroid.BOTTOM
					);
				});

			firebase
				.database()
				.ref('Followings')
				.child(userId)
				.child(uid)
				.update({
					uid: uid,
					email: userData.email,
					username: usernameText,
				})
				.then((updated) => {
					firebase
						.database()
						.ref('Users')
						.child(userId)
						.update({
							following: following + 1,
						})
						.catch((err) => {});
				})
				.catch((err) => {});

			firebase
				.database()
				.ref('Notifications')
				.child(uid)
				.child(timestamp)
				.update({
					type: NotificationTypes.NEWFOLLOWER,
					who: username,
					when: timestamp,
					uid: userId,
				});
		} else {
			firebase
				.database()
				.ref('Followers')
				.child(uid)
				.child(userId)
				.remove()
				.then((res) => {
					firebase
						.database()
						.ref('Users')
						.child(uid)
						.update({
							followers: userData.followers - 1,
						})
						.then((updated) => {})
						.catch((err) => {
							ToastAndroid.showWithGravity(
								'Something went wrong',
								ToastAndroid.SHORT,
								ToastAndroid.BOTTOM
							);
						});
				})
				.catch((err) => {
					ToastAndroid.showWithGravity(
						'Something went wrong',
						ToastAndroid.SHORT,
						ToastAndroid.BOTTOM
					);
				});

			firebase
				.database()
				.ref('Followings')
				.child(userId)
				.child(uid)
				.remove()
				.then((updated) => {
					firebase
						.database()
						.ref('Users')
						.child(userId)
						.update({
							following: following - 1,
						})
						.catch((err) => {});
				})
				.catch((err) => {});
		}
	};

	useEffect(() => {
		firebase
			.database()
			.ref('Followings')
			.child(userId)
			.orderByChild('username')
			.startAt(`${usernameText.trim()}`)
			.endAt(usernameText.trim() + '\uf8ff')
			.limitToFirst(1)
			.on('value', (snap) => {
				if (snap.val()) setFollowing(true);
				else setFollowing(false);
			});
		// .catch(err => {
		// 	ToastAndroid.show('Cannot load your data.', ToastAndroid.SHORT);
		// });
	}, []);

	useEffect(() => {
		setLoading(false);
		firebase
			.database()
			.ref('Users')
			.child(uid)
			.on('value', (snap) => {
				setUserData(snap.val());
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		if (userData.social) socialArePresent();
	}, [userData]);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={usernameText}
				absolute
				back
				backgroundColor={whatIsTheme(COLORS.BLACK, COLORS.BLACK)}
				renderRightActions={userData.sound && userData.sound.duration}
				extraButtons={[
					{
						name: 'musical-note',
						type: 'ionicon',
						size: 22,
						color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
						onPress: playProfileSong,
					},
				]}
			/>

			{/* Main content of searched profile starts here */}
			{loading ? (
				<View
					style={{
						height: 100,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator
						size={33}
						color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
					/>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					{/* coverImg, profileImgGravatar */}
					<ImageBackground
						style={styles.coverImg}
						source={{
							uri: userData.coverImg
								? userData.coverImg
								: imageCoverTemp[ranImageAndColor],
						}}
					>
						<Avatar.Image
							style={whatIsTheme(
								styles.avatarDark,
								styles.avatarLight
							)}
							size={111}
							source={{
								uri: `https://www.gravatar.com/avatar/${md5(
									userData.email
								)}.jpg?s=200`,
							}}
						/>
					</ImageBackground>

					{/* fullname, username, email */}
					<View style={styles.detailsStart}>
						<Text
							style={whatIsTheme(
								styles.fullnameDark,
								styles.fullnameLight
							)}
						>
							{userData.fullname}
						</Text>

						<TouchableRipple onPress={() => playProfileSong()}>
							<Caption
								style={whatIsTheme(
									styles.usernameDark,
									styles.usernameLight
								)}
							>
								@{userData.username}
							</Caption>
						</TouchableRipple>

						<Caption
							style={whatIsTheme(
								styles.emailDark,
								styles.emailLight
							)}
						>
							{userData.email}
						</Caption>
					</View>

					{/* user follow status */}
					<View style={styles.followSection}>
						{/* followers */}
						<TouchableOpacity
							onPress={() => {
								props.navigation.push('FollowTab', {
									usernameText,
									userUid: uid,
								});
							}}
							style={styles.followTextContainer}
						>
							<View>
								<Text
									style={[
										whatIsTheme(
											styles.paraDark,
											styles.paraLight
										),
										styles.followTextCaption,
									]}
								>
									Followers
								</Text>
								<Text
									style={[
										whatIsTheme(
											styles.paraDark,
											styles.paraLight
										),
										styles.followText,
									]}
								>
									{userData.followers}
								</Text>
							</View>
						</TouchableOpacity>
						<View
							style={{
								borderRightColor: COLORS.MID,
								borderRightWidth: 0.25,
								height: '100%',
								width: 0.3,
								backgroundColor: COLORS.RED,
							}}
						></View>

						{/* followings */}
						<TouchableOpacity
							onPress={() => {
								props.navigation.push('FollowingTab', {
									usernameText,
									userUid: uid,
								});
							}}
							style={styles.followTextContainer}
						>
							<View>
								<Text
									style={[
										whatIsTheme(
											styles.paraDark,
											styles.paraLight
										),
										styles.followTextCaption,
									]}
								>
									Following
								</Text>
								<Text
									style={[
										whatIsTheme(
											styles.paraDark,
											styles.paraLight
										),
										styles.followText,
									]}
								>
									{userData.following}
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					{usernameText !== username ? (
						<View style={styles.followArea}>
							<TouchableOpacity
								onPress={() => startFollowingUser()}
							>
								<View style={styles.followAreaMain}>
									<Text
										style={[
											followingUser
												? styles.unfollowAreaText
												: styles.followAreaText,
											followingUser
												? whatIsTheme(
														{
															backgroundColor:
																COLORS.DARKPRIMARY,
															color: COLORS.WHITE,
														},
														{
															backgroundColor:
																COLORS.FINALBEFORELIGHT,
															color: COLORS.BLACK,
														}
												  )
												: null,
										]}
									>
										{followingUser ? `Unfollow` : `Follow`}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					) : null}

					{/* status */}
					<View
						style={[
							whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							),
							// { marginTop: 0 },
						]}
					>
						<Title
							style={whatIsTheme(
								styles.titleDark,
								styles.titleLight
							)}
						>
							Status
						</Title>

						<Paragraph
							style={whatIsTheme(
								styles.paraDark,
								styles.paraLight
							)}
						>
							{userData.status ? (
								userData.status
							) : (
								<Paragraph
									style={whatIsTheme(
										styles.paraDark,
										styles.paraLight
									)}
								>
									No status provided by{' '}
									<Caption
										style={whatIsTheme(
											styles.usernameDark,
											styles.usernameLight
										)}
									>
										@{userData.username}
									</Caption>
								</Paragraph>
							)}
						</Paragraph>
					</View>

					<View
						style={whatIsTheme(
							styles.sectionDark,
							styles.sectionLight
						)}
					>
						<Title
							style={whatIsTheme(
								styles.titleDark,
								styles.titleLight
							)}
						>
							About
						</Title>

						<TouchableWithoutFeedback onPress={toggleAboutLength}>
							{userData.about ? (
								<Paragraph
									// selectable={true}
									// selectionColor={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
									style={whatIsTheme(
										styles.paraDark,
										styles.paraLight
									)}
								>
									{lengthOfAbout === textLengthLimit
										? userData.about.substring(
												0,
												textLengthLimit - 3
										  ) + '...'
										: userData.about}
									{'  '}
									{userData.about.length >
									textLengthLimit - 3 ? (
										<Caption style={{ color: COLORS.MID }}>
											{lengthOfAbout === textLengthLimit
												? 'Read More...'
												: '\nRead Less...'}
										</Caption>
									) : null}
								</Paragraph>
							) : (
								<Paragraph
									style={whatIsTheme(
										styles.paraDark,
										styles.paraLight
									)}
								>
									About not provided by{' '}
									<Caption
										style={whatIsTheme(
											styles.usernameDark,
											styles.usernameLight
										)}
									>
										@{userData.username}
									</Caption>
								</Paragraph>
							)}
						</TouchableWithoutFeedback>
					</View>

					{/* location */}
					{userData.location ? (
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Title
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								Lives In
							</Title>
							<Text
								style={whatIsTheme(
									styles.paraDark,
									styles.paraLight
								)}
							>
								{userData.location}
							</Text>
						</View>
					) : null}

					{/* expertise */}
					{userData.expertise ? (
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Title
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								Expertise
							</Title>

							<View style={[styles.expertiseHolder]}>
								{finalExpertise.map((exp) => {
									return (
										<Text
											key={exp}
											style={whatIsTheme(
												styles.expertiseDark,
												styles.expertiseLight
											)}
										>
											{exp}
										</Text>
									);
								})}
							</View>
						</View>
					) : null}

					{/* educations */}
					{userData.education ? (
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Title
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								Education
							</Title>

							<View styles={styles.educationHolder}>
								{finalEducation.map((item, _) => {
									return (
										<View
											key={_}
											style={whatIsTheme(
												styles.educationSectionCardDark,
												styles.educationSectionCardLight
											)}
										>
											<Text
												style={[
													whatIsTheme(
														styles.educationBoldTextDark,
														styles.educationBoldTextLight
													),
													whatIsTheme(
														styles.font16Dark,
														styles.font16Light
													),
												]}
											>
												{item.degree}
											</Text>
											<Text
												style={whatIsTheme(
													styles.educationBoldTextDark,
													styles.educationBoldTextLight
												)}
											>
												{item.school}
											</Text>
											<Caption
												style={whatIsTheme(
													styles.educationRegularTextDark,
													styles.educationRegularTextLight
												)}
											>
												{`${item.yearFrom} - ${item.yearTo}`}
											</Caption>
										</View>
									);
								})}
							</View>
						</View>
					) : null}

					{/* social links */}
					{socialAvailable ? (
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Title
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								{`${userData.fullname}'s Social Media`}
							</Title>
							<View style={styles.iconContainer}>
								{userData.social.github ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='github'
											title='Github'
											onPress={() =>
												openLink(userData.social.github)
											}
										/>
									</View>
								) : null}

								{userData.social.linkedin ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='linkedin'
											title='Linkedin'
											onPress={() =>
												openLink(
													userData.social.linkedin
												)
											}
										/>
									</View>
								) : null}

								{userData.social.twitter ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='twitter'
											title='Twitter'
											onPress={() =>
												openLink(
													userData.social.twitter
												)
											}
										/>
									</View>
								) : null}

								{userData.social.facebook ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='facebook'
											title='Facebook'
											onPress={() =>
												openLink(
													userData.social.facebook
												)
											}
										/>
									</View>
								) : null}

								{userData.social.instagram ? (
									<View style={styles.iconHolder}>
										<SocialIcon
											type='instagram'
											title='Instagram'
											onPress={() =>
												openLink(
													userData.social.instagram
												)
											}
										/>
									</View>
								) : null}
							</View>
						</View>
					) : null}

					<View
						style={whatIsTheme(
							styles.sectionDark,
							styles.sectionLight
						)}
					>
						<Text
							style={whatIsTheme(
								styles.joinedOnDark,
								styles.joinedOnLight
							)}
						>
							{`Joined On: ${months[userData.joinedOn.month]} ${
								userData.joinedOn.year
							}`}
						</Text>
					</View>

					<View
						style={styles.lastElementOfTheProfileScrollView}
					></View>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	lastElementOfTheProfileScrollView: {
		paddingBottom: 100,
	},
	coverImg: {
		height: 235,
		width: '100%',
		resizeMode: 'cover',
		justifyContent: 'flex-end',
		elevation: 5,
		alignItems: 'center',
		overflow: 'visible',
	},
	avatarLight: {
		backgroundColor: COLORS.TRANSPARENT,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.PRIMARY,
		overflow: 'visible',
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
		overflow: 'visible',
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
		fontSize: 15,
		fontFamily: 'roboto',
	},
	paraLight: {
		paddingHorizontal: 5,
		fontFamily: 'Inter',
		color: COLORS.BLACK,
		fontSize: 15,
		fontFamily: 'roboto',
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
		fontFamily: 'roboto',
	},
	educationBoldTextLight: {
		color: COLORS.DARKSECONDARY,
		fontSize: 15,
		paddingVertical: 1,
		paddingHorizontal: 4,
		fontFamily: 'roboto',
	},

	font16Dark: {
		fontSize: 16,
		color: COLORS.GREEN,
		fontFamily: 'roboto',
	},
	font16Light: {
		fontSize: 16,
		color: COLORS.PRIMARY,
		fontFamily: 'roboto',
	},

	educationRegularTextDark: {
		color: COLORS.MID,
		fontSize: 13,
		paddingVertical: 1,
		paddingHorizontal: 4,
		fontFamily: 'roboto',
	},
	educationRegularTextLight: {
		color: COLORS.MID,
		fontSize: 13,
		paddingVertical: 1,
		paddingHorizontal: 4,
		fontFamily: 'roboto',
	},

	joinedOnDark: {
		paddingVertical: 10,
		color: COLORS.BEFORELIGHT,
		textAlign: 'center',
		width: '100%',
		marginVertical: 10,
		fontSize: 19,
		fontFamily: 'Inter',
		fontFamily: 'roboto',
	},
	joinedOnLight: {
		paddingVertical: 10,
		color: COLORS.DARKGLOW,
		textAlign: 'center',
		width: '100%',
		marginVertical: 10,
		fontSize: 19,
		fontFamily: 'Inter',
		fontFamily: 'roboto',
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

	followSection: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		// borderTopColor: COLORS.MID,
		// borderTopWidth: 0.25,

		// borderBottomColor: COLORS.MID,
		// borderBottomWidth: 0.25,
		// backgroundColor: COLORS.RED,
	},
	followTextContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
		// backgroundColor: COLORS.BLUE,
		paddingVertical: 12,
	},
	followTextCaption: {
		fontFamily: 'roboto',
		textAlign: 'center',
	},
	followText: {
		fontSize: 19,
		fontFamily: 'roboto',
		fontWeight: 'bold',
		textAlign: 'center',
	},

	followArea: {
		width: '100%',
		paddingVertical: 7,
		paddingHorizontal: 5,
		marginVertical: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	followAreaMain: {
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	followAreaText: {
		fontSize: 17,
		fontFamily: 'roboto',
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: COLORS.BLUE_FAV,
		padding: 8,
		paddingHorizontal: 28,
		borderRadius: 5,
		color: COLORS.WHITE,
	},
	unfollowAreaText: {
		fontSize: 17,
		fontFamily: 'roboto',
		textAlign: 'center',
		textAlignVertical: 'center',
		padding: 8,
		paddingHorizontal: 28,
		borderRadius: 5,
		color: COLORS.BLACK,
		borderColor: COLORS.MID,
		borderWidth: 0.4,
	},
});

export default ShowSearchedUserProfile;
