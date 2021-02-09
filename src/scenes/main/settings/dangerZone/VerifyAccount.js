import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Header from '../../../../components/customs/Header/Header';
import Firebase from '../../../../firebase/Firebase';
import COLORS from '../../../../val/colors/Colors';

const VerifyUserAccount = props => {
	const { username, email } = useSelector(state => state.main.user);
	const { theme } = useSelector(state => state.settings.settings);

	const [loading, setLoading] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const verifyAccount = () => {
		setLoading(true);
		Firebase.auth()
			.currentUser.sendEmailVerification()
			.then(res => {
				ToastAndroid.show('Verification email sent to ' + email, ToastAndroid.SHORT);
			})
			.catch(err => {
				ToastAndroid.show(
					'Error sending email to ' + email + ' .Please try again',
					ToastAndroid.SHORT
				);
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
				{`Press the button to send a email verification mail to ${email}.Then by clicking on the link send to your mail Id your account will be verified.`}
			</Text>
			<View style={styles.buttonContainer}>
				<Button
					title='Verify Account'
					disabledStyle={styles.opacityDown}
					buttonStyle={styles.updateButton}
					onPress={verifyAccount}
					loading={loading}
				/>
			</View>
			<Text style={[styles.thank, whatIsTheme(styles.textDark, styles.textLight)]}>
				This is a one time process.
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

export default VerifyUserAccount;
