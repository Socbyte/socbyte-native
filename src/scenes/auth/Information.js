import React from 'react';
import { StyleSheet, View, Text, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../val/colors/Colors';

const AuthInformation = props => {
	return (
		<View style={styles.mainscreen}>
			<StatusBar></StatusBar>
			<View style={styles.backButton}>
				<TouchableOpacity
					onPress={() => {
						props.navigation.goBack();
					}}>
					<Ionicons
						name='arrow-back'
						size={26}
						color={COLORS.WHITE}
						style={{
							paddingHorizontal: 5,
							paddingTop: 5,
						}}
					/>
				</TouchableOpacity>
			</View>
			<ScrollView>
				<View style={styles.screen}>
					<View style={{ ...styles.topicContainer, ...styles.removeTopMargin }}>
						<Text style={styles.topicName}>Sign Up</Text>
						<View style={styles.topicDescriptionContainer}>
							<View style={styles.row}>
								<Text style={styles.lineNumber}>1. </Text>
								<Text style={styles.topicDescription}>
									Provide a username, email, password.
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>2. </Text>
								<Text style={styles.topicDescription}>
									Username and Email should not belong to any existing account.
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>3. </Text>
								<Text style={styles.topicDescription}>
									Provide a valid email id temporary mails are not allowed in the system.
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>4. </Text>
								<Text style={styles.topicDescription}>
									Password should contain alteast 8 characters including upper-case,
									lower-case, numerals and special-characters. (required)
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.lineNumber}>5. </Text>
								<Text style={styles.topicDescription}>
									If you have an existing account then you can sign in with that account.
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={[styles.lineNumber, { color: COLORS.RED }]}>NOTE:- </Text>
								<Text style={[styles.topicDescription, { color: COLORS.RED }]}>
									Username could not be changed later.
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.topicContainer}>
						<Text style={styles.topicName}>Sign In</Text>
						<View style={styles.topicDescriptionContainer}>
							<View style={styles.row}>
								<Text style={styles.lineNumber}>1. </Text>
								<Text style={styles.topicDescription}>
									Provide valid email, password associated with your account. (required)
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>2. </Text>
								<Text style={styles.topicDescription}>
									If you forgot password your account password, then reset it by going to
									forgot password tab. Provide a strong password to ignore any vulnerability.
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>3. </Text>
								<Text style={styles.topicDescription}>
									If you are not logged in you can always create a new account.
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							...styles.topicContainer,
							...styles.removeBottomBorder,
						}}>
						<Text style={styles.topicName}>Forgot Password</Text>
						<View style={styles.topicDescriptionContainer}>
							<View style={styles.row}>
								<Text style={styles.lineNumber}>1. </Text>
								<Text style={styles.topicDescription}>
									Provide valid email associated with your account to reset that account's
									password. (required)
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>2. </Text>
								<Text style={styles.topicDescription}>
									An email will be sent to that email address. Follow the link provided in
									email and reset your account's password.
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.lineNumber}>3. </Text>
								<Text style={styles.topicDescription}>
									Now you can login with your email and new password.
								</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	mainscreen: {
		flex: 1,
	},
	screen: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	backButton: {
		paddingHorizontal: 5,
		paddingVertical: 5,
		backgroundColor: 'transparent',
	},
	topicContainer: {
		width: '100%',
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 5,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.GREY,
	},
	removeTopMargin: {
		marginTop: 0,
		paddingTop: 0,
	},
	topicName: {
		color: COLORS.WHITE,
		fontSize: 22,
		fontFamily: 'karlaBold',
		textAlign: 'center',
		marginVertical: 5,
		marginBottom: 20,
		textDecorationLine: 'underline',
		// backgroundColor: COLORS.NEXTTODARK,
	},
	topicDescriptionContainer: {
		marginHorizontal: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingVertical: 5,
	},
	lineNumber: {
		color: COLORS.WHITE,
		fontSize: 18,
	},
	topicDescription: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontFamily: 'inter',
		marginLeft: 1,
	},
	removeBottomBorder: {
		borderBottomWidth: 0,
	},
});

export default AuthInformation;
