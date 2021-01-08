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
import TestMain from '../scenes/main/Test';
import Header from '../components/customs/Header/Header';
import ProfileNavigator from './content/ProfileNavigator';

const DrawerNavigator = createDrawerNavigator();
const DrawerNavigation = props => {
	const settings = useSelector(state => state.settings.settings);

	return (
		<NavigationContainer theme={settings.theme === 'd' ? DarkTheme : DefaultTheme}>
			<DrawerNavigator.Navigator
				screenOptions={props => {
					return {
						headerShown: false,
						headerLeft: () => {
							return (
								<TouchableRipple onPress={() => props.navigation.toggleDrawer()}>
									<Ionicons name='menu' color={settings.theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY} size={25} style={{ margin: 10 }} />
								</TouchableRipple>
							);
						},
						header: () => {
							return (
								<Header
									leftButton={() => {
										props.navigation.toggleDrawer();
									}}
									includeRight={true}
									rightButton='ellipsis-vertical'
									// headerTitle={username}
								/>
							);
						},
					};
				}}
				drawerContent={props => <MainDrawerNavigation setProfileImg={props.setProfileImg} {...props} />}>
				<DrawerNavigator.Screen name='Profile' component={ProfileNavigator} />

				<DrawerNavigator.Screen name='Home' component={Home} />

				<DrawerNavigator.Screen name='Test' component={Profile} />

				<DrawerNavigator.Screen name='Chats' component={Home} />

				<DrawerNavigator.Screen name='Settings' component={Home} />
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
			fetch(`https://www.gravatar.com/${emailHash}.json`)
				.then(res => res.json())
				.then(res => {
					if (JSON.stringify(res).includes('User not found')) {
						setUserProfileImageFound(false);
						props.setProfileImg(false);
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
									<Avatar.Image style={theme === 'd' ? styles.avatarDark : styles.avatarLight} size={57} source={{ uri: userData.profileImg }} />
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
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('home');
								props.navigation.navigate('Home');
							}}
							theme={theme}
							extraStyles={theme === 'd' ? styles.firstDrawerOptionsDark : styles.firstDrawerOptionsLight}
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
							extraStyles={theme === 'd' ? styles.lastDrawerOptionsDark : styles.lastDrawerOptionsLight}
							identity={['profile', 'Profile']}
							selected={selectedTab}
							iconName='account-box'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('chats');
								props.navigation.navigate('Profile');
							}}
							theme={theme}
							extraStyles={theme === 'd' ? styles.lastDrawerOptionsDark : styles.lastDrawerOptionsLight}
							identity={['chats', 'Chats']}
							selected={selectedTab}
							iconName='message'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('info');
								props.navigation.navigate('Home');
							}}
							theme={theme}
							extraStyles={theme === 'd' ? styles.lastDrawerOptionsDark : styles.lastDrawerOptionsLight}
							identity={['info', 'Info']}
							selected={selectedTab}
							iconName='information'
						/>
						<PureDrawerItem
							onPress={() => {
								setSelectedTabText('test');
								props.navigation.navigate('Test');
							}}
							theme={theme}
							extraStyles={theme === 'd' ? styles.lastDrawerOptionsDark : styles.lastDrawerOptionsLight}
							identity={['test', 'Test']}
							selected={selectedTab}
							iconName='settings-helper'
						/>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.drawerBottomSection}>
				<DrawerItem
					icon={({ color, size }) => <MaterialCommunityIcons name='exit-to-app' color={theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY} size={size} />}
					label='Sign Out'
					labelStyle={theme === 'd' ? styles.labelDark : styles.labelLight}
					onPress={logOutUser}
				/>
			</Drawer.Section>
		</View>
	);
};

function PureDrawerItem(props) {
	const { onPress, theme, extraStyles, identity, selected, iconName } = props;

	return (
		<DrawerItem
			icon={({ color, size }) => <MaterialCommunityIcons name={iconName} size={size} color={selected === identity[0] ? (theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY) : COLORS.DARKFORLIGHT} />}
			label={identity[1]}
			labelStyle={selected === identity[0] ? (theme === 'd' ? styles.labelDark : styles.labelLight) : theme === 'd' ? styles.labelDisabledDark : styles.labelDisabledLight}
			focused={selected === identity[0]}
			activeTintColor={theme === 'd' ? COLORS.WHITE : COLORS.DARKGLOW}
			activeBackgroundColor={theme === 'd' ? COLORS.DARKGLOW : COLORS.BEFORELIGHT}
			style={[theme === 'd' ? styles.drawerOptionsDark : styles.drawerOptionsLight, extraStyles ? extraStyles : styles.NONE]}
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
