import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native';
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
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/customs/Header/Header';
import { Ionicons } from '@expo/vector-icons';

import { databaseInit, fetchDatabase, insertDatabase, updateDatabase } from '../../sql/SQLStarter';
import { updateSettings } from '../../store/Settings';
import COLORS, { ISDARKCOLOR } from '../../val/colors/Colors';

const Profile = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const { profileImg, fullname, coverImg, username, about, ratings, status, education, expertise, location, facolor } = useSelector(
		state => state.main.user
	);
	const dispatch = useDispatch();

	// 	profileImg
	// education
	// ratings
	// about
	// expertise
	// location
	// coverImg
	// facolor
	// fullname
	// phoneNo
	// profileType
	// publics
	// status
	// email
	// username

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

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				includeRight={true}
				rightButton='ellipsis-vertical'
				headerTitle={username}
			/>

			<ScrollView>
				<View style={theme === 'd' ? styles.usersectionDark : styles.usersectionLight}>
					{/* <ImageBackground source={{ uri: '' }} /> */}

					<Text onPress={toggleTheme} style={styles.lightTheme}>
						TOGGLE THEME
					</Text>
					{profileImg ? (
						<Avatar.Text
							style={theme === 'd' ? styles.avatarDark : styles.avatarLight}
							labelStyle={theme === 'd' ? styles.avatarLabelDark : styles.avatarLabelLight}
							label={username ? username[0].toUpperCase() : ''}
						/>
					) : (
						<Avatar.Image style={theme === 'd' ? styles.avatarDark : styles.avatarLight} size={115} source={{ uri: profileImg }} />
					)}

					<Text>{fullname}</Text>
					<Caption>@{username}</Caption>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
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
		padding: 6,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		// flexDirection: 'row',
	},
	usersectionLight: {
		padding: 6,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.GREEN,
		// flexDirection: 'row',
	},

	avatarLight: {
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: COLORS.PRIMARY,
		overflow: 'hidden',
		maxWidth: 85,
		maxHeight: 85,
		width: 85,
		height: 85,
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
		maxWidth: 85,
		maxHeight: 85,
		width: 85,
		height: 85,
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
