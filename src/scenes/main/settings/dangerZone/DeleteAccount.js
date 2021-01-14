import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Header from '../../../../components/customs/Header/Header';
import Firebase from '../../../../firebase/Firebase';
import COLORS from '../../../../val/colors/Colors';

const DeleteUserAccount = props => {
	const { username, email } = useSelector(state => state.main.user);
	const { theme } = useSelector(state => state.settings.settings);

	const [reason, setReason] = useState('');
	const [loading, setLoading] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const deleteAccount = () => {
		setLoading(true);
		Firebase.database()
			.ref('DelAccReq')
			.child(username)
			.once('value')
			.then(snap => {
				if (snap.val()) {
					//user already requested to delete account...
					ToastAndroid.showWithGravity(
						'You have already requested for account deletion.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					setLoading(false);
					setReason('');
				} else {
					const timestamp = new Date().getTime();
					Firebase.database()
						.ref('DelAccReq')
						.child(username)
						.update({
							[timestamp]: {
								email: email,
								reason: reason,
							},
						})
						.then(res => {
							ToastAndroid.showWithGravity(
								'Your request has been received.',
								ToastAndroid.LONG,
								ToastAndroid.CENTER
							);
							setReason('');
							setLoading(false);
						})
						.catch(err => {
							ToastAndroid.showWithGravity(
								'Servers are busy. Please try again',
								ToastAndroid.LONG,
								ToastAndroid.CENTER
							);
							setLoading(false);
						});
				}
			})
			.then(res => {
				setLoading(false);
			})
			.catch(err => {
				ToastAndroid.showWithGravity(
					'Servers are busy. Please try again',
					ToastAndroid.LONG,
					ToastAndroid.CENTER
				);
				setLoading(false);
			});
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				back
				headerTitle='Are You Sure'
			/>
			<Text style={whatIsTheme(styles.textDark, styles.textLight)}>
				If you continue to this form, your account and related data will be deleted
				permanently from server, that means you cannot get this account again.
			</Text>
			<View style={styles.buttonContainer}>
				<Button
					title='Delete Account'
					disabledStyle={styles.opacityDown}
					buttonStyle={styles.updateButton}
					onPress={deleteAccount}
					loading={loading}
				/>
			</View>
			<Text style={[styles.thank, whatIsTheme(styles.textDark, styles.textLight)]}>
				Thanks For Using SocByte.
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonContainer: {
		alignItems: 'center',
	},
	updateButton: {
		minWidth: 150,
		minHeight: 50,
		backgroundColor: COLORS.RED,
	},
	opacityDown: {
		opacity: 0.5,
	},

	textDark: {
		color: COLORS.WHITE,
		textAlign: 'center',
		padding: 5,
		paddingHorizontal: 10,
		marginVertical: 10,
		fontSize: 16,
	},
	textLight: {
		color: COLORS.BLACK,
		textAlign: 'center',
		fontSize: 16,
		padding: 5,
		paddingHorizontal: 10,
		marginVertical: 10,
	},
	thank: {
		fontSize: 18,
	},
});

export default DeleteUserAccount;
