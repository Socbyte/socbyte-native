import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';

import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import {
	Avatar,
	Text as PaperText,
	Title,
	Caption,
	Drawer,
	Card,
	Switch,
	ToggleButton,
	TouchableRipple,
	Paragraph,
	useTheme,
	IconButton,
} from 'react-native-paper';

import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar as ElementAvatar } from 'react-native-elements';

import md5 from 'md5';

import { setProfileImageURL } from '../store/MainStore';
import firebase from '../firebase/Firebase';

import COLORS from '../val/colors/Colors';
import { updateDatabase } from '../sql/SQLStarter';
import { updateSettings } from '../store/Settings';

import Home from '../scenes/main/Home';
import Profile from '../scenes/main/Profile';
import TestMain from '../scenes/main/Test';
import Header from '../components/customs/Header/Header';

import ProfileNavigator from './content/ProfileNavigator';
import SettingStack from './content/SettingsNavigator';
import ChatNavigation from '../scenes/main/chats/ChatNavigation';
import MusicNavigation from './content/MusicNavigator';
import { PlayerContextProvider } from '../scenes/main/music/context/PlayerContext';

const DrawerNavigator = createDrawerNavigator();
const DrawerNavigation = props => {
	const settings = useSelector(state => state.settings.settings);

	const setProfileImg = props.setProfileImg;

	return (
		<PlayerContextProvider>
			<NavigationContainer theme={settings.theme === 'd' ? DarkTheme : DefaultTheme}>
				<DrawerNavigator.Navigator
					screenOptions={props => {
						return {
							headerShown: false,
							headerLeft: () => {
								return (
									<TouchableRipple
										onPress={() => props.navigation.toggleDrawer()}>
										<Ionicons
											name='menu'
											color={
												settings.theme === 'd'
													? COLORS.GREEN
													: COLORS.PRIMARY
											}
											size={25}
											style={{ margin: 10 }}
										/>
									</TouchableRipple>
								);
							},
							header: () => {
								return (
									<Header
										leftButton={() => {
											props.navigation.toggleDrawer();
										}}
										rightButton='ellipsis-vertical'
										// headerTitle={username}
									/>
								);
							},
						};
					}}
					drawerContent={props => (
						<MainDrawerNavigation setProfileImg={setProfileImg} {...props} />
					)}>
					<DrawerNavigator.Screen name='Home' component={Home} />

					<DrawerNavigator.Screen name='Profile' component={ProfileNavigator} />

					<DrawerNavigator.Screen name='Chats' component={ChatNavigation} />

					<DrawerNavigator.Screen name='Settings' component={SettingStack} />

					<DrawerNavigator.Screen name='Music' component={MusicNavigation} />
				</DrawerNavigator.Navigator>
			</NavigationContainer>
		</PlayerContextProvider>
	);
};

const MainDrawerNavigation = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const userData = useSelector(state => state.main.user);

	const paperTheme = useTheme();
	const dispatch = useDispatch();

	const [selectedTab, setSelectedTab] = useState('home');
	const [userProfileImageFound, setUserProfileImageFound] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const toggleTheme = () => {
		// console.log('TOGGLE THE CURRENT THEME...');
		const toggledTheme = theme === 'd' ? 'l' : 'd';
		updateDatabase('theme', toggledTheme)
			.then(result => {
				// console.log('DATABASE UPDATED');
				// console.log(result);
				dispatch(updateSettings('theme', toggledTheme));
			})
			.catch(err => {
				console.log('ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION');
				console.log(err);
			});
	};

	const logOutUser = () => {
		firebase.auth().signOut().then().catch();
	};

	const setSelectedTabText = text => {
		setSelectedTab(text);
	};

	useEffect(() => {
		if (userData.email) {
			const emailHash = md5(userData.email);
			fetch(`https://www.gravatar.com/${emailHash}.json`)
				.then(res => res.json())
				.then(res => {
					if (JSON.stringify(res).includes('User not found')) {
						setUserProfileImageFound(false);
						props.setProfileImg(false);
					} else {
						setUserProfileImageFound(true);
						props.setProfileImg(
							`https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`
						);
					}
				})
				.catch(err => {
					console.log('THIS ERROR OCCURED WHILE LOADING GRAVATAR', err);
				});
		}
	}, [userData.email]);

	return (
		<View style={styles.flex}>
			<DrawerContentScrollView>
				<View style={styles.flex}>
					<View style={styles.padding10}>
						<TouchableRipple
							onPress={() => {
								setSelectedTabText('profile');
								props.navigation.navigate('Profile');
							}}>
							<View
								style={
									theme === 'd' ? styles.usersectionDark : styles.usersectionLight
								}>
								{userProfileImageFound ? (
									// <Avatar.Image
									// 	style={
									// 		theme === 'd' ? styles.avatarDark : styles.avatarLight
									// 	}
									// 	size={57}
									// 	source={{ uri: userData.profileImg }}
									// />
									<ElementAvatar
										source={{ uri: userData.profileImg }}
										size={57}
										avatarStyle={whatIsTheme(
											styles.avatarDark,
											styles.avatarLight
										)}
									/>
								) : (
									<Avatar.Text
										style={[
											whatIsTheme(styles.avatarDark, styles.avatarLight),
											whatIsTheme(
												{
													borderWidth: 1,
													borderColor: COLORS.GREEN,
												},
												{
													borderWidth: 1,
													borderColor: COLORS.PRIMARY,
												}
											),
										]}
										labelStyle={
											theme === 'd'
												? styles.avatarLabelDark
												: styles.avatarLabelLight
										}
										label={
											userData.username
												? userData.username[0].toUpperCase()
												: ''
										}
									/>
								)}
								<View
									style={
										theme === 'd'
											? styles.usersectiontextDark
											: styles.usersectiontextLight
									}>
									<PaperText
										style={theme === 'd' ? styles.textDark : styles.textLight}>
										{userData.fullname}
									</PaperText>
									<Caption
										style={
											theme === 'd'
												? styles.mainTextDark
												: styles.mainTextLight
										}
										numberOfLines={1}>
										@{userData.username}
									</Caption>
								</View>
							</View>
						</TouchableRipple>
					</View>

					<Drawer.Section
						theme={paperTheme.dark}
						style={theme === 'd' ? styles.mainDrawerDark : styles.mainDrawerLight}>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('home');
								props.navigation.navigate('Home');
							}}
							theme={theme}
							extraStyles={
								theme === 'd'
									? styles.firstDrawerOptionsDark
									: styles.firstDrawerOptionsLight
							}
							identity={['home', 'Home']}
							selected={selectedTab}
							iconName='home'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('profile');
								props.navigation.navigate('Profile');
							}}
							theme={theme}
							identity={['profile', 'Profile']}
							selected={selectedTab}
							iconName='account-box'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('chats');
								props.navigation.navigate('Chats');
							}}
							theme={theme}
							identity={['chats', 'Chats']}
							selected={selectedTab}
							iconName='message'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('music');
								props.navigation.navigate('Music');
							}}
							theme={theme}
							identity={['music', 'Music']}
							selected={selectedTab}
							iconName='music-note'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('settings');
								props.navigation.navigate('Settings');
							}}
							theme={theme}
							extraStyles={
								theme === 'd'
									? styles.lastDrawerOptionsDark
									: styles.lastDrawerOptionsLight
							}
							identity={['settings', 'Settings']}
							selected={selectedTab}
							customIcon={
								<Ionicons
									name='settings'
									size={24}
									color={
										selectedTab === 'settings'
											? theme === 'd'
												? COLORS.GREEN
												: COLORS.PRIMARY
											: COLORS.DARKFORLIGHT
									}
								/>
							}
						/>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>

			<Drawer.Section style={styles.row}>
				<View style={styles.leftToToggleButton}>
					<Text
						style={[
							styles.fontLarge,
							theme === 'd' ? styles.textDark : styles.textLight,
						]}>
						Toggle Theme
					</Text>
					<Caption
						style={[
							styles.fontSmall,
							theme === 'd' ? styles.textDark : styles.textLight,
						]}>
						{theme === 'd' ? 'Dark Theme' : 'Light Theme'}
					</Caption>
				</View>
				<View style={styles.rightToToggleButton}>
					<ToggleButton
						icon={() =>
							theme === 'd' ? (
								<Ionicons
									name='md-sunny-outline'
									size={25}
									color={theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY}
								/>
							) : (
								<Ionicons
									name='moon-sharp'
									size={25}
									color={theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY}
								/>
							)
						}
						value='B'
						status='checked'
						onPress={toggleTheme}
					/>
				</View>
			</Drawer.Section>

			<Drawer.Section style={styles.drawerBottomSection}>
				<DrawerItem
					icon={({ color, size }) => (
						<MaterialCommunityIcons
							name='exit-to-app'
							color={theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY}
							size={size}
						/>
					)}
					label='Sign Out'
					labelStyle={theme === 'd' ? styles.labelDark : styles.labelLight}
					onPress={logOutUser}
				/>
			</Drawer.Section>
		</View>
	);
};

function PureDrawerItem({ onPress, theme, extraStyles, identity, selected, iconName, customIcon }) {
	return (
		<DrawerItem
			icon={({ color, size }) => {
				return (
					<View>
						{customIcon ? (
							customIcon
						) : (
							<MaterialCommunityIcons
								name={iconName}
								size={size}
								color={
									selected === identity[0]
										? theme === 'd'
											? COLORS.GREEN
											: COLORS.PRIMARY
										: COLORS.DARKFORLIGHT
								}
							/>
						)}
					</View>
				);
			}}
			label={identity[1]}
			labelStyle={
				selected === identity[0]
					? theme === 'd'
						? styles.labelDark
						: styles.labelLight
					: theme === 'd'
					? styles.labelDisabledDark
					: styles.labelDisabledLight
			}
			focused={selected === identity[0]}
			activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
			activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
			style={[
				theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight,
				extraStyles ? extraStyles : styles.NONE,
			]}
			onPress={onPress}
		/>
	);
}

const styles = StyleSheet.create({
	drawerBottomSection: {
		marginBottom: 0,
		borderTopColor: COLORS.NEXTTODARK,
		borderTopWidth: 1,
	},

	usersectionDark: {
		marginTop: 10,
		flexDirection: 'row',
		padding: 6,
	},
	usersectionLight: {
		marginTop: 10,
		flexDirection: 'row',
		padding: 6,
	},

	usersectiontextDark: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 10,
		flex: 1,
	},
	usersectiontextLight: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 10,
		flex: 1,
	},

	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},

	avatarLight: {
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.PRIMARY,
		overflow: 'hidden',
		maxWidth: 56,
		maxHeight: 56,
		width: 56,
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.TRANSPARENT,
	},
	avatarDark: {
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.GREEN,
		overflow: 'hidden',
		maxWidth: 56,
		maxHeight: 56,
		width: 56,
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.TRANSPARENT,
	},

	avatarLabelDark: {
		color: COLORS.GREEN,
		fontFamily: 'inter',
	},
	avatarLabelLight: {
		color: COLORS.PRIMARY,
		fontFamily: 'inter',
	},

	mainTextDark: {
		color: COLORS.GREEN,
	},
	mainTextLight: {
		color: COLORS.PRIMARY,
	},

	mainDrawerDark: {
		borderTopWidth: 1,
		borderTopColor: COLORS.DARKSECONDARY,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.DARKSECONDARY,
		marginTop: 0,
		marginBottom: 0,
	},
	mainDrawerLight: {
		borderTopWidth: 1,
		borderTopColor: COLORS.BEFORELIGHT,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.BEFORELIGHT,
		marginTop: 0,
		marginBottom: 0,
	},

	drawerOptionsDark: {
		borderTopColor: COLORS.DARKSECONDARY,
		borderTopWidth: 1,
		marginTop: 0,
		marginBottom: 0,
	},
	drawerOptionsLight: {
		borderTopColor: COLORS.BEFORELIGHT,
		borderTopWidth: 1,
		marginTop: 0,
		marginBottom: 0,
	},

	firstDrawerOptionsDark: {
		borderTopColor: COLORS.SECONDARY,
		borderTopWidth: 0,
	},
	firstDrawerOptionsLight: {
		borderTopColor: COLORS.BEFORELIGHT,
		borderTopWidth: 0,
	},

	lastDrawerOptionsDark: {
		borderBottomColor: COLORS.DARKSECONDARY,
		borderBottomWidth: 0,
	},
	lastDrawerOptionsLight: {
		borderBottomColor: COLORS.BEFORELIGHT,
		borderBottomWidth: 0,
	},

	labelDark: {
		color: COLORS.GREEN,
	},
	labelLight: {
		color: COLORS.PRIMARY,
	},
	labelDisabledDark: {
		color: COLORS.GREY,
	},
	labelDisabledLight: {
		color: COLORS.BEFOREDARKFORLIGHT,
	},

	row: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderTopColor: COLORS.MID,
		borderTopWidth: 1,
		borderBottomColor: COLORS.MID,
		borderBottomWidth: 1,
	},

	leftToToggleButton: {
		flex: 1,
	},
	rightToToggleButton: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 60,
	},

	textDark: {
		color: COLORS.BEFORELIGHT,
	},
	textLight: {
		color: COLORS.DARKSECONDARY,
	},

	fontLarge: {
		fontSize: 17,
		paddingVertical: 1,
	},
	fontSmall: {
		paddingVertical: 1,
		fontSize: 14,
	},

	flex: {
		flex: 1,
	},
	padding10: {
		paddingLeft: 10,
	},
	NONE: {
		// this style provides nothing
	},
});

const mapStateToProps = state => {
	return {
		user: state.main.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setProfileImg: profileImg => {
			dispatch(setProfileImageURL(profileImg));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNavigation);
