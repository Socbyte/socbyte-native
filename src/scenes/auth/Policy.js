import React from 'react';
import { StyleSheet, View, Text, Linking, BackHandler } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
	databaseInit,
	fetchDatabase,
	insertDatabase,
	updateDatabase,
} from '../../sql/SQLStarter';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../store/Settings';
import COLORS from '../../val/colors/Colors';

const termsURL = 'https://telebyte.vercel.app/terms';
const privacyURL = 'https://telebyte.vercel.app/privacy';
const canOpenTerms = Linking.canOpenURL(termsURL);
const canOpenPrivacy = Linking.canOpenURL(privacyURL);

const TermsAndConditionPrivacyPolicy = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' || !theme ? f : s;
	};
	const dispatch = useDispatch();

	const toggleTheme = () => {
		// console.log('TOGGLE THE CURRENT THEME...');
		const toggledTheme = whatIsTheme('l', 'd');
		updateDatabase('theme', toggledTheme)
			.then((result) => {
				// console.log('DATABASE UPDATED');
				// console.log(result);
				dispatch(updateSettings('theme', toggledTheme));
			})
			.catch((err) => {
				// console.log('ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION');
				// console.log(err);
			});
	};

	return (
		<View
			style={{
				flex: 1,
				padding: 10,
				justifyContent: 'flex-start',
				alignItems: 'center',
			}}
		>
			<Text
				onPress={toggleTheme}
				style={{
					width: '100%',
					textAlign: 'center',
					fontSize: 22,
					color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
					fontFamily: 'karla',
					fontWeight: 'bold',
					padding: 9,
					borderBottomColor: whatIsTheme(
						COLORS.NEXTTODARK,
						COLORS.BEFORELIGHT
					),
					borderBottomWidth: 1,
				}}
			>
				"Socbyte" Notice
			</Text>

			<View style={{ justifyContent: 'space-between', flex: 1 }}>
				<Text
					style={{
						lineHeight: 20,
						fontSize: 17,
						padding: 13,
						color: whatIsTheme('#dfdfdf', '#303030'),
					}}
				>
					"Socbyte" requires the following permissions to provide
					services for you: access the network, we collect the content
					and other information you provide when you use our products,
					for and account, create or share content, and message or
					communicate with others, and access storage data (to search
					for, download and delete songs (available in future), read,
					write, delete, update the user settings, obtain user
					behavior data and function settings (this is done to improve
					your user experience) and read phone-state (to provide a
					personalized recommendations).
				</Text>
				<Text
					style={{ fontSize: 13.5, padding: 13, color: COLORS.MID }}
				>
					{
						'\n\nBy tapping on Agree you are deemed to have agreed to the above contents.'
					}
					For more details, refer to the{' '}
					<Text
						style={{
							color: whatIsTheme(COLORS.GREEN, COLORS.PRIMARY),
						}}
						onPress={async () => {
							if (canOpenPrivacy) {
								await Linking.openURL(privacyURL);
							}
						}}
					>
						Socbyte Privacy Statement
					</Text>
					{' and '}
					<Text
						style={{
							color: whatIsTheme(COLORS.GREEN, COLORS.PRIMARY),
						}}
						onPress={async () => {
							if (canOpenTerms) {
								await Linking.openURL(termsURL);
							}
						}}
					>
						Socbyte Terms And Conditions
					</Text>
				</Text>
			</View>
			<View style={styles.buttonHolder}>
				<TouchableOpacity onPress={() => BackHandler.exitApp()}>
					<View style={styles.buttonContainerFirst}>
						<Icon
							name='cross'
							type='entypo'
							size={21}
							color={COLORS.BLACK}
							iconStyle={{ transform: [{ rotateZ: '180deg' }] }}
						/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => props.navigation.replace('Register')}
				>
					<View style={styles.buttonContainerLast}>
						<Text
							style={{
								color: COLORS.WHITE,
								fontSize: 17,
								fontFamily: 'karla',
							}}
						>
							Agree
						</Text>
						<Icon
							name='controller-play'
							type='entypo'
							size={21}
							color={COLORS.WHITE}
						/>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonHolder: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 18,
		paddingHorizontal: 18,
	},
	buttonContainerFirst: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		borderRadius: 50,
		backgroundColor: COLORS.WHITE,
		flexDirection: 'row',
	},
	buttonContainerLast: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		borderRadius: 50,
		backgroundColor: COLORS.NEXTTODARK,
		flexDirection: 'row',
	},
});

export default TermsAndConditionPrivacyPolicy;
