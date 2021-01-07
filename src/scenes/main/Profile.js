import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import { databaseInit, fetchDatabase, insertDatabase, updateDatabase } from '../../sql/SQLStarter';
import { updateSettings } from '../../store/Settings';
import COLORS from '../../val/colors/Colors';

const Profile = props => {
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

	const setting = useSelector(state => state.settings.settings);

	const dispatch = useDispatch();

	const toggleTheme = () => {
		console.log('TOGGLE THE CURRENT THEME...');
		const toggledTheme = setting.theme === 'd' ? 'l' : 'd';
		updateDatabase('theme', toggledTheme)
			.then(result => {
				console.log('DATABASE UPDATED');
				console.log(result);
				dispatch(updateSettings('theme', toggledTheme));
			})
			.catch(err => {
				console.log('ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION');
			});
	};

	return (
		<View>
			<TouchableRipple onPress={toggleTheme}>
				<Text style={setting.theme === 'd' ? styles.darkTheme : styles.lightTheme}>PROFILE</Text>
			</TouchableRipple>
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
});

export default Profile;
