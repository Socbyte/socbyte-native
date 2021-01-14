import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';

const LogoutUser = props => {
	const { logOutUser, sentstyle } = props.route.params;
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
				back
				headerTitle='Are You Sure'
			/>
			<Text style={whatIsTheme(styles.textDark, styles.textLight)}>
				If you continue to log out, your data will be removed locally, that means you will
				ave to login again to continue using this account.
			</Text>
			<View style={styles.buttonContainer}>
				<Button
					title='Logout'
					disabledStyle={styles.opacityDown}
					buttonStyle={styles.updateButton}
					onPress={logOutUser}
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

export default LogoutUser;
