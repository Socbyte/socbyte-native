import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import Header from '../../../components/customs/Header/Header';
import { PureListItem } from './MainSettings';
import firebase from '../../../firebase/Firebase';
import { ToastAndroid } from 'react-native';

const DangerSection = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const [user, setUser] = useState(firebase.auth().currentUser);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const logOutUser = () => {
		firebase.auth().signOut();
	};

	const loadVerifyData = () => {
		if (user.emailVerified) {
			ToastAndroid.show('Your account is already verified.', ToastAndroid.SHORT);
		} else {
			props.navigation.navigate('VerifyUserAccount');
		}
	};

	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				setUser(firebase.auth().currentUser);
			}
		});
	}, []);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				back
				headerTitle='Danger Section'
			/>

			<ScrollView>
				<PureListItem
					title='Logout'
					// description='user data will be removed'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('Logout', {
							logOutUser: logOutUser,
						});
					}}
					iconName='logout'
					iconType='material-icon'
					iconSize={24}
				/>

				<PureListItem
					title={user.emailVerified ? 'Verified Account' : 'Un-Verified Account'}
					// description='user data will be removed'
					whatIsTheme={whatIsTheme}
					onPress={loadVerifyData}
					iconName={user.emailVerified ? 'verified-user' : 'unverified'}
					iconType={user.emailVerified ? 'material-icon' : 'octicon'}
					iconSize={24}
				/>

				<PureListItem
					title='Delete Account'
					// description='user data will be removed'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('DeleteUserAccount');
					}}
					iconName='deleteuser'
					iconType='ant-design'
					iconSize={24}
				/>
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
});

export default DangerSection;
