import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Text, Avatar, TouchableRipple } from 'react-native-paper';
import { Input, Button } from 'react-native-elements';
import { useSelector } from 'react-redux';

import firebase from '../../../firebase/Firebase';
import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';
import { ToastAndroid } from 'react-native';
import { PureListItem } from '../settings/MainSettings';

const GravatLink = 'https://en.gravatar.com/';
export const EditProfileAbout = props => {
	const { profileImg, username, fullname, status, about, coverImg } = useSelector(
		state => state.main.user
	);
	const { theme } = useSelector(state => state.settings.settings);

	const [newFullname, setNewFullname] = useState(fullname ? fullname : '');
	const [newStatus, setNewStatus] = useState(status ? status : '');
	const [newAbout, setNewAbout] = useState(about ? about : '');
	const [newCoverImg, setNewCoverImg] = useState(coverImg ? coverImg : '');

	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const openGravatarLink = () => {
		Linking.openURL(GravatLink);
	};

	const updateProfile = () => {
		setLoading(true);
		setDisabled(true);
		if (newCoverImg.length > 150) {
			ToastAndroid.show(
				"Cover image link's can maximum contain 100 character. Or provide a shortened link."
			);

			setLoading(true);
			setDisabled(false);
			return;
		}
		if (newFullname !== fullname || newStatus !== status || newAbout !== about) {
			firebase
				.database()
				.ref('Users')
				.child(firebase.auth().currentUser.uid)
				.update({
					fullname: newFullname,
					status: newStatus,
					about: newAbout,
					coverImg: newCoverImg,
				})
				.then(res => {
					// ToastAndroid.show('Profile Updated!', ToastAndroid.SHORT);
					firebase
						.database()
						.ref('Accounts')
						.child(firebase.auth().currentUser.uid)
						.update({
							fullname: newFullname,
						})
						.then(res => {
							ToastAndroid.showWithGravity(
								'Profile Updated!',
								ToastAndroid.SHORT,
								ToastAndroid.CENTER
							);
							setLoading(false);
							setDisabled(false);
							props.navigation.goBack();
						})
						.catch(err => {
							ToastAndroid.showWithGravity(
								'Cannot Update Profile Currently! Error in server. Please try again.',
								ToastAndroid.SHORT,
								ToastAndroid.CENTER
							);
							setLoading(false);
							setDisabled(false);
						});
				})
				.catch(err => {
					ToastAndroid.showWithGravity(
						'Cannot Update Profile Currently! Error in server. Please try again.',
						ToastAndroid.SHORT,
						ToastAndroid.CENTER
					);
					// ToastAndroid.show(
					// 	'Cannot Update Profile Currently! Error in server',
					// 	ToastAndroid.SHORT
					// );
					setLoading(false);
					setDisabled(false);
				});
		} else {
			ToastAndroid.show('Please edit to update profile', ToastAndroid.LONG);
			setLoading(false);
			setDisabled(false);
		}
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle='Update Profile'
				back
			/>
			<ScrollView>
				<View style={styles.imageContainer}>
					<TouchableOpacity onPress={openGravatarLink}>
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
					</TouchableOpacity>
					<Text>Tap image to open gravatar link</Text>
				</View>

				<View style={styles.inputs}>
					<Input
						placeholder='Full Name'
						selectionColor={COLORS.MID}
						value={newFullname}
						onChangeText={value => setNewFullname(value)}
						maxLength={16}
						textAlignVertical='top'
						placeholderTextColor={COLORS.MID}
						style={whatIsTheme(styles.textDark, styles.textLight)}
					/>
					<Input
						placeholder='Your Status'
						selectionColor={COLORS.MID}
						value={newStatus}
						onChangeText={value => setNewStatus(value)}
						maxLength={100}
						multiline
						textAlignVertical='top'
						placeholderTextColor={COLORS.MID}
						style={whatIsTheme(styles.textDark, styles.textLight)}
					/>
					<Input
						placeholderTextColor={COLORS.MID}
						placeholder='About You'
						selectionColor={COLORS.MID}
						value={newAbout}
						onChangeText={value => setNewAbout(value)}
						multiline
						numberOfLines={8}
						textAlignVertical='top'
						maxLength={750}
						style={whatIsTheme(styles.textDark, styles.textLight)}
					/>
					<Input
						placeholderTextColor={COLORS.MID}
						placeholder='Cover Image Link'
						textContentType='URL'
						selectionColor={COLORS.MID}
						value={newCoverImg}
						onChangeText={value => setNewCoverImg(value)}
						textAlignVertical='top'
						maxLength={150}
						style={whatIsTheme(styles.textDark, styles.textLight)}
					/>
					{/* <Input
						placeholderTextColor={COLORS.MID}
						placeholder='Music Link (only mp3 without and special characters)'
						textContentType='URL'
						selectionColor={COLORS.MID}
						value={newSound}
						onChangeText={value => setNewSound(value)}
						textAlignVertical='top'
						maxLength={150}
						style={whatIsTheme(styles.textDark, styles.textLight)}
					/> */}
				</View>
				<View style={styles.buttonContainer}>
					<Button
						title='Update'
						loading={loading}
						disabled={disabled}
						disabledStyle={styles.opacityDown}
						disabledTitleStyle={styles.opacityDownTitle}
						buttonStyle={styles.updateButton}
						onPress={updateProfile}
					/>
				</View>

				<View style={styles.lastElementOfTheProfileScrollView}></View>
			</ScrollView>
		</View>
	);
};

export const EditProfileOther = props => {
	const { theme } = useSelector(state => state.settings.settings);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle='Update Profile'
				back
			/>

			<ScrollView>
				<PureListItem
					title='Edit Expertise'
					// description='fullname, cover image, status, about'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('EditProfileSingle', {
							part: 'expertise',
							edit: true,
						});
					}}
					iconName='edit'
					iconType='feather'
					iconSize={24}
				/>
				<PureListItem
					title='Update Educations'
					// description='fullname, cover image, status, about'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('EditProfileSingle', {
							part: 'edu',
							edit: true,
						});
					}}
					iconName='school-outline'
					iconType='material-community'
					iconSize={24}
				/>
				<PureListItem
					title='Edit Social Media'
					// description='fullname, cover image, status, about'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('EditProfileSingle', {
							part: 'social',
							edit: true,
						});
					}}
					iconName='social-github'
					iconType='foundation'
					iconSize={28}
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	lastElementOfTheProfileScrollView: {
		paddingBottom: 160,
	},
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	settingOptionDark: {
		padding: 5,
		paddingVertical: 10,
		borderTopColor: COLORS.DARKGLOW,
		borderTopWidth: 1,
		borderBottomColor: COLORS.DARKGLOW,
		borderBottomWidth: 1,
		marginVertical: 10,
		elevation: 2,
		backgroundColor: COLORS.DARKPRIMARY,
		color: COLORS.WHITE,
	},
	settingOptionLight: {
		padding: 5,
		paddingVertical: 10,
		borderTopColor: COLORS.DARKFORLIGHT,
		borderTopWidth: 1,
		borderBottomColor: COLORS.DARKFORLIGHT,
		borderBottomWidth: 1,
		marginVertical: 10,
		elevation: 2,
		backgroundColor: COLORS.LIGHTBACKGROUND,
		color: COLORS.BLACK,
	},

	imageContainer: {
		backgroundColor: COLORS.TRANSPARENT,
		height: 160,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 150,
	},
	buttonContainer: {
		alignItems: 'center',
	},
	updateButton: {
		minWidth: 150,
		minHeight: 50,
	},
	opacityDown: {
		opacity: 1,
		backgroundColor: COLORS.ANTIQUE_BLUE,
	},
	opacityDownTitle: {
		color: COLORS.WHITE,
	},

	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},

	avatarLight: {
		backgroundColor: COLORS.TRANSPARENT,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.PRIMARY,
		overflow: 'hidden',
		maxWidth: 105,
		maxHeight: 105,
		width: 105,
		height: 105,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000030',
		elevation: 3,
	},
	avatarDark: {
		backgroundColor: COLORS.TRANSPARENT,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.GREEN,
		overflow: 'hidden',
		maxWidth: 105,
		maxHeight: 105,
		width: 105,
		height: 105,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff30',
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
});
