import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect, useSelector } from 'react-redux';

import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Avatar, Text as PaperText, Title, Caption, Drawer, Switch, TouchableRipple, Paragraph, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { Ionicons } from '@expo/vector-icons';

import md5 from 'md5';

import { setProfileImageURL } from '../store/MainStore';
import firebase from '../firebase/Firebase';

import COLORS from '../val/colors/Colors';
import Home from '../scenes/main/Home';
import Profile from '../scenes/main/Profile';

const DrawerNavigator = createDrawerNavigator();
const DrawerNavigation = props => {
	const settings = useSelector(state => state.settings.settings);

	const setProfileImg = props.setProfileImg;

	return (
		<NavigationContainer theme={settings.theme === 'd' ? DarkTheme : DefaultTheme}>
			<DrawerNavigator.Navigator
				screenOptions={props => {
					return {
						headerShown: true,
						headerLeft: () => {
							return (
								<TouchableRipple onPress={() => props.navigation.toggleDrawer()}>
									<Ionicons
										name='menu'
										color={settings.theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY}
										size={25}
										style={{ margin: 10 }}
									/>
								</TouchableRipple>
							);
						},
					};
				}}
				drawerContent={props => <MainDrawerNavigation setProfileImg={setProfileImg} {...props} />}>
				<DrawerNavigator.Screen name='Home' component={Home} />
				<DrawerNavigator.Screen name='Profile' component={Profile} />
				<DrawerNavigator.Screen name='Chats' component={Home} />
				<DrawerNavigator.Screen name='Settings' component={Home} />
				<DrawerNavigator.Screen name='Add' component={Home} />
			</DrawerNavigator.Navigator>
		</NavigationContainer>
	);
};

const MainDrawerNavigation = props => {
	const { theme } = useSelector(state => state.settings.settings);

	const userData = useSelector(state => state.main.user);
	const paperTheme = useTheme();

	const [selectedTab, setSelectedTab] = useState('home');
	const [userProfileImageFound, setUserProfileImageFound] = useState(false);

	const logOutUser = () => {
		firebase.auth().signOut().then().catch();
	};

	const setSelectedTabText = text => {
		setSelectedTab(text);
	};

	useEffect(() => {
		if (userData.email) {
			const emailHash = md5(userData.email);
			fetch(`https://www.gravatar.com/${emailHash}a.json`)
				.then(res => res.json())
				.then(res => {
					if (JSON.stringify(res).includes('User not found')) {
						setUserProfileImageFound(false);
						props.setProfileImg('');
					} else {
						setUserProfileImageFound(true);
						props.setProfileImg(`https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`);
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
							<View style={theme === 'd' ? styles.usersectionDark : styles.usersectionLight}>
								{userProfileImageFound ? (
									<Avatar.Image
										style={theme === 'd' ? styles.avatarDark : styles.avatarLight}
										size={55}
										source={{ uri: userData.profileImg }}
									/>
								) : (
									<Avatar.Text
										style={theme === 'd' ? styles.avatarDark : styles.avatarLight}
										labelStyle={theme === 'd' ? styles.avatarLabelDark : styles.avatarLabelLight}
										label={userData.username ? userData.username[0].toUpperCase() : ''}
									/>
								)}
								<View style={theme === 'd' ? styles.usersectiontextDark : styles.usersectiontextLight}>
									<PaperText style={theme === 'd' ? styles.textDark : styles.textLight}>{userData.fullname}</PaperText>
									<Caption style={theme === 'd' ? styles.mainTextDark : styles.mainTextLight} numberOfLines={1}>
										@{userData.username}
									</Caption>
								</View>
							</View>
						</TouchableRipple>
					</View>
					<Drawer.Section theme={paperTheme.dark} style={theme === 'd' ? styles.mainDrawerDark : styles.mainDrawerLight}>
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons
									name='home'
									size={size}
									color={selectedTab === 'home' ? (theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY) : COLORS.DARKFORLIGHT}
								/>
							)}
							label='Home'
							labelStyle={
								selectedTab === 'home'
									? theme === 'd'
										? styles.labelDark
										: styles.labelLight
									: theme === 'd'
									? styles.labelDisabledDark
									: styles.labelDisabledLight
							}
							focused={selectedTab === 'home'}
							activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
							activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
							style={[
								theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight,
								theme === 'd' ? styles.firstDrawerOptionsDark : styles.firstDrawerOptionsLight,
							]}
							onPress={() => {
								setSelectedTabText('home');
								// props.navigation.navigate('Home');
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons
									name='account'
									size={size}
									color={selectedTab === 'profile' ? (theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY) : COLORS.DARKFORLIGHT}
								/>
							)}
							label='Profile'
							labelStyle={
								selectedTab === 'profile'
									? theme === 'd'
										? styles.labelDark
										: styles.labelLight
									: theme === 'd'
									? styles.labelDisabledDark
									: styles.labelDisabledLight
							}
							focused={selectedTab === 'profile'}
							activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
							activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
							style={[
								theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight,
								theme === 'd' ? styles.firstDrawerOptionsDark : styles.firstDrawerOptionsLight,
							]}
							onPress={() => {
								setSelectedTabText('profile');
								// props.navigation.navigate('Profile');
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons
									name='chat'
									size={size}
									color={selectedTab === 'chats' ? (theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY) : COLORS.DARKFORLIGHT}
								/>
							)}
							label='Chats'
							labelStyle={
								selectedTab === 'chats'
									? theme === 'd'
										? styles.labelDark
										: styles.labelLight
									: theme === 'd'
									? styles.labelDisabledDark
									: styles.labelDisabledLight
							}
							focused={selectedTab === 'chats'}
							activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
							activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
							style={[
								theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight,
								theme === 'd' ? styles.firstDrawerOptionsDark : styles.firstDrawerOptionsLight,
							]}
							onPress={() => {
								setSelectedTabText('chats');
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons
									name='plus'
									size={size}
									color={selectedTab === 'add' ? (theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY) : COLORS.DARKFORLIGHT}
								/>
							)}
							label='Add Something'
							labelStyle={
								selectedTab === 'add'
									? theme === 'd'
										? styles.labelDark
										: styles.labelLight
									: theme === 'd'
									? styles.labelDisabledDark
									: styles.labelDisabledLight
							}
							focused={selectedTab === 'add'}
							activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
							activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
							style={[
								theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight,
								theme === 'd' ? styles.firstDrawerOptionsDark : styles.firstDrawerOptionsLight,
							]}
							onPress={() => {
								setSelectedTabText('add');
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons
									name='account-edit'
									size={size}
									color={selectedTab === 'setting' ? (theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY) : COLORS.DARKFORLIGHT}
								/>
							)}
							label='Add Something'
							labelStyle={
								selectedTab === 'setting'
									? theme === 'd'
										? styles.labelDark
										: styles.labelLight
									: theme === 'd'
									? styles.labelDisabledDark
									: styles.labelDisabledLight
							}
							focused={selectedTab === 'setting'}
							activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
							activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
							style={[
								theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight,
								theme === 'd' ? styles.lastDrawerOptionsDark : styles.lastDrawerOptionsLight,
							]}
							onPress={() => {
								setSelectedTabText('setting');
							}}
						/>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.drawerBottomSection}>
				<DrawerItem
					icon={({ color, size }) => (
						<MaterialCommunityIcons name='exit-to-app' color={theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY} size={size} />
					)}
					label='Sign Out'
					labelStyle={theme === 'd' ? styles.labelDark : styles.labelLight}
					onPress={logOutUser}
				/>
			</Drawer.Section>
		</View>
	);
};

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
	},
	usersectiontextLight: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 10,
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
		// borderTopColor: COLORS.DARKSECONDARY,
		// borderTopWidth: 1,
		marginTop: 0,
		marginBottom: 0,
	},
	drawerOptionsLight: {
		// borderTopColor: COLORS.BEFORELIGHT,
		// borderTopWidth: 1,
		marginTop: 0,
		marginBottom: 0,
	},

	firstDrawerOptionsDark: {
		// borderTopColor: COLORS.SECONDARY,
		// borderTopWidth: 0,
	},
	firstDrawerOptionsLight: {
		// borderTopColor: COLORS.BEFORELIGHT,
		// borderTopWidth: 0,
	},

	lastDrawerOptionsDark: {
		// borderBottomColor: COLORS.DARKSECONDARY,
		// borderBottomWidth: 1,
	},
	lastDrawerOptionsLight: {
		// borderBottomColor: COLORS.BEFORELIGHT,
		// borderBottomWidth: 1,
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

	flex: {
		flex: 1,
	},
	padding10: {
		paddingLeft: 10,
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
