import React from "react";
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../val/colors/Colors";
import { useSelector } from "react-redux";
import Header from "../../components/customs/Header/Header";

const AuthInformation = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (firstVal, secondVal) => {
		return !theme || theme === "d" ? firstVal : secondVal;
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={"Authentication Informations"}
				absolute
				back
				realBackgroundColor={COLORS.TRANSPARENT}
			/>

			<ScrollView>
				<View style={styles.screen}>
					<View
						style={{
							...styles.topicContainer,
							...styles.removeTopMargin,
						}}
					>
						<Text
							style={whatIsTheme(
								styles.topicName,
								styles.topicNameLight
							)}
						>
							Sign Up
						</Text>
						<View style={styles.topicDescriptionContainer}>
							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									1.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Provide a username, email, password.
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									2.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Username and Email should not belong to any
									existing account.
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									3.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Provide a valid email id temporary mails are
									not allowed in the system.
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									4.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Password should contain alteast 8 characters
									including lower-case, numerals and
									special-characters. Please don't include
									upper-case characters in your username.
									(required)
								</Text>
							</View>
							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									5.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									If you have an existing account then you can
									sign in with that account.
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={[
										whatIsTheme(
											styles.lineNumber,
											styles.lineNumberLight
										),
										{ color: COLORS.RED },
									]}
								>
									NOTE:-{" "}
								</Text>
								<Text
									style={[
										whatIsTheme(
											styles.topicDescription,
											styles.topicDescriptionLight
										),
										{ color: COLORS.RED },
									]}
								>
									Username could not be changed later.
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.topicContainer}>
						<Text
							style={whatIsTheme(
								styles.topicName,
								styles.topicNameLight
							)}
						>
							Sign In
						</Text>
						<View style={styles.topicDescriptionContainer}>
							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									1.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Provide valid email, password associated
									with your account. (required)
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									2.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									If you forgot password your account
									password, then reset it by going to forgot
									password tab. Provide a strong password to
									ignore any vulnerability.
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									3.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									If you are not logged in you can always
									create a new account.
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							...styles.topicContainer,
							...styles.removeBottomBorder,
						}}
					>
						<Text
							style={whatIsTheme(
								styles.topicName,
								styles.topicNameLight
							)}
						>
							Forgot Password
						</Text>
						<View style={styles.topicDescriptionContainer}>
							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									1.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Provide valid email associated with your
									account to reset that account's password.
									(required)
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									2.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									An email will be sent to that email address.
									Follow the link provided in email and reset
									your account's password.
								</Text>
							</View>

							<View style={styles.row}>
								<Text
									style={whatIsTheme(
										styles.lineNumber,
										styles.lineNumberLight
									)}
								>
									3.{" "}
								</Text>
								<Text
									style={whatIsTheme(
										styles.topicDescription,
										styles.topicDescriptionLight
									)}
								>
									Now you can login with your email and new
									password.
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
		justifyContent: "center",
		alignItems: "center",
	},

	backButton: {
		paddingHorizontal: 5,
		paddingVertical: 5,
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
	},

	info: {
		marginRight: 31,
		color: COLORS.GREEN,
		fontSize: 22,
		flex: 1,
		textAlign: "center",
	},
	infoLight: {
		marginRight: 31,
		color: COLORS.PRIMARY,
		fontSize: 22,
		flex: 1,
		textAlign: "center",
	},

	topicContainer: {
		width: "100%",
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 5,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.GREY,
	},
	topicContainerLight: {
		width: "100%",
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 5,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.TEXT,
	},

	removeTopMargin: {
		marginTop: 0,
		paddingTop: 0,
	},

	topicName: {
		color: COLORS.WHITE,
		fontSize: 22,
		fontFamily: "karlaBold",
		textAlign: "center",
		marginVertical: 5,
		marginBottom: 20,
		textDecorationLine: "underline",
		// backgroundColor: COLORS.NEXTTODARK,
	},
	topicNameLight: {
		color: COLORS.BLACK,
		fontSize: 22,
		fontFamily: "karlaBold",
		textAlign: "center",
		marginVertical: 5,
		marginBottom: 20,
		textDecorationLine: "underline",
		// backgroundColor: COLORS.NEXTTODARK,
	},

	topicDescriptionContainer: {
		marginHorizontal: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: 5,
	},

	lineNumber: {
		color: COLORS.WHITE,
		fontSize: 18,
	},
	lineNumberLight: {
		color: COLORS.BLACK,
		fontSize: 18,
	},

	topicDescription: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontFamily: "inter",
		marginLeft: 1,
	},
	topicDescriptionLight: {
		color: COLORS.BLACK,
		fontSize: 16,
		fontFamily: "inter",
		marginLeft: 1,
	},

	removeBottomBorder: {
		borderBottomWidth: 0,
	},
});

export default AuthInformation;
