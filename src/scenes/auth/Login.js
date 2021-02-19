import React, { useCallback, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableWithoutFeedback,
	TouchableOpacity,
	TextInput,
	Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../val/colors/Colors';

import Firebase from '../../firebase/Firebase';
import ModalAlert from '../../components/customs/ModalAlert';
import FullScreenLoading from '../../components/customs/FullScreenLoading';
import {
	databaseInit,
	insertDatabase,
	updateDatabase,
} from '../../sql/SQLStarter';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../store/Settings';

const Login = (props) => {
	const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const { theme } = useSelector((state) => state.settings.settings);
	const dispatch = useDispatch();

	const [email, setEmail] = useState(
		props.route.params?.email ? props.route.params?.email : ''
	);
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState({});
	const [loading, setLoading] = useState(false);

	const loginExistingUser = useCallback(() => {
		setDisabled(true);
		setLoading(true);
		setError(false);

		if (email.length <= 0 || password.length <= 0) {
			setDisabled(false);
			setLoading(false);
			setError({
				header: 'Required!',
				desc:
					'Both email and password are required to login into your account.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});

			return;
		} else if (!email.match(emailValidator)) {
			setDisabled(false);
			setLoading(false);

			setError({
				header: 'Invalid Email!',
				desc: 'Please enter a valid email address.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});

			return;
		}

		Firebase.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				// signed in successfully
				//create local database
				databaseInit()
					.then(() => {
						// console.log("DATABASE CREATED");
						insertDatabase('theme', 'd');
						insertDatabase('fontSize', 'm');
						insertDatabase('email', email);
						insertDatabase('username', '');
						insertDatabase('primaryColor', COLORS.GREEN);
						insertDatabase('invertPrimaryColor', COLORS.BLACK);

						updateDatabase('theme', 'd');
						updateDatabase('fontSize', 'm');
						updateDatabase('email', email);
						updateDatabase('username', '');
						updateDatabase('primaryColor', COLORS.GREEN);
						updateDatabase('invertPrimaryColor', COLORS.BLACK);
					})
					.catch((err) => {
						// console.log("DATABASE CREATED");
						insertDatabase('theme', 'd');
						insertDatabase('fontSize', 'm');
						insertDatabase('email', email);
						insertDatabase('username', '');
						insertDatabase('primaryColor', COLORS.GREEN);
						insertDatabase('invertPrimaryColor', COLORS.BLACK);

						updateDatabase('theme', 'd');
						updateDatabase('fontSize', 'm');
						updateDatabase('email', email);
						updateDatabase('username', '');
						updateDatabase('primaryColor', COLORS.GREEN);
						updateDatabase('invertPrimaryColor', COLORS.BLACK);
					});

				setDisabled(false);
				setLoading(false);
				setError(false);
			})
			.catch((err) => {
				setDisabled(false);
				setLoading(false);
				if (err.code.includes('auth/user-not-found')) {
					setError({
						header: 'User Not Found!',
						desc:
							'There is no user record corresponding to this details. The user may have been deleted, banned or disabled. If you think the details are correct then contact the developer.',
						primary: 'Okay!',
						primaryFunction: () => setError(false),
					});
				} else if (err.code.includes('auth/wrong-password')) {
					setError({
						header: 'Incorrect Password!',
						desc:
							'Entered password in wrong. Please enter the correct password.',
						primary: 'Okay!',
						primaryFunction: () => setError(false),
					});
				} else {
					setError({
						header: 'Error!',
						desc: 'Something Went Wrong! Try Again.',
						primary: 'Okay!',
						primaryFunction: () => setError(false),
					});
				}
			});
	}, [email, password]);

	const loadRegisterForm = () => {
		props.navigation.replace('Register');
	};
	const loadForgotPasswordForm = () => {
		props.navigation.replace('ForgotPassword', { email });
	};

	const whatIsTheme = (firstVal, secondVal) => {
		return !theme || theme === 'd' ? firstVal : secondVal;
	};

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
				// console.log(
				// 	"ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION"
				// );
				// console.log(err);
			});
	};

	return (
		<View style={styles.screen}>
			{loading ? <FullScreenLoading loadingType={true} /> : null}

			{error ? (
				<ModalAlert
					cancellable
					header={error.header}
					description={error.desc}
					disableFunction={setError}
					visible={error.header ? true : false}
					primary={error.primary}
					primaryFunction={
						error.primaryFunction
							? error.primaryFunction
							: setError(false)
					}
				/>
			) : null}

			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}
			>
				<View style={styles.compo}>
					<View style={styles.textSection}>
						<TouchableWithoutFeedback onPress={toggleTheme}>
							<View>
								<Text
									style={[
										styles.authText,
										whatIsTheme(null, styles.textLight),
									]}
								>
									Welcome
								</Text>
								<Text
									style={[
										styles.authText,
										whatIsTheme(null, styles.textLight),
									]}
								>
									Back
								</Text>
							</View>
						</TouchableWithoutFeedback>
						<View>
							<TouchableOpacity
								onPress={() => {
									props.navigation.navigate('Information');
								}}
							>
								<Ionicons
									name='information'
									color={whatIsTheme(
										COLORS.WHITE,
										COLORS.BLACK
									)}
									size={24}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ ...styles.input }}>
						<TextInput
							autoCompleteType='email'
							style={
								disabled
									? whatIsTheme(
											styles.disabledInput,
											styles.disabledInputLight
									  )
									: whatIsTheme(
											styles.inputItself,
											styles.inputItselfLight
									  )
							}
							editable={!disabled}
							placeholder='Email'
							placeholderTextColor={COLORS.PLACEHOLDER}
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'
							returnKeyType='next'
						/>
					</View>

					<View style={{ ...styles.passwordInput, ...styles.input }}>
						<View style={styles.passwordInputs}>
							<TextInput
								style={
									disabled
										? whatIsTheme(
												styles.disabledInput,
												styles.disabledInputLight
										  )
										: whatIsTheme(
												styles.inputItself,
												styles.inputItselfLight
										  )
								}
								editable={!disabled}
								placeholder='Password'
								placeholderTextColor={COLORS.PLACEHOLDER}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={showPassword}
							/>
						</View>
						<TouchableOpacity
							onPress={() => setShowPassword(!showPassword)}
						>
							<Ionicons
								style={{ marginLeft: 8 }}
								name={showPassword ? 'eye-off' : 'eye'}
								size={20}
								color={whatIsTheme(
									COLORS.WHITE,
									COLORS.DARKPRIMARY
								)}
							/>
						</TouchableOpacity>
					</View>

					<View
						style={whatIsTheme(
							styles.registerTextContainer,
							styles.registerTextContainerLight
						)}
					>
						<TouchableOpacity onPress={loginExistingUser}>
							<Text
								style={whatIsTheme(
									styles.registerText,
									styles.registerTextLight
								)}
							>
								Sign In
							</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={loginExistingUser}>
							<View
								style={whatIsTheme(
									styles.registerIconContainer,
									styles.registerIconContainerLight
								)}
							>
								<Ionicons
									name='arrow-forward'
									color={whatIsTheme(
										COLORS.BLACK,
										COLORS.WHITE
									)}
									size={28}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.registerContainer}>
						<TouchableOpacity onPress={loadRegisterForm}>
							<View
								style={whatIsTheme(
									styles.otherContainer,
									styles.otherContainerLight
								)}
							>
								<Text
									style={whatIsTheme(
										styles.other,
										styles.otherLight
									)}
								>
									Sign Up!
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={loadForgotPasswordForm}>
							<View
								style={whatIsTheme(
									styles.otherContainer,
									styles.otherContainerLight
								)}
							>
								<Text
									style={whatIsTheme(
										styles.other,
										styles.otherLight
									)}
								>
									Forgot Password
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
	},
	compo: {
		flex: 1,
		margin: 20,
		justifyContent: 'center',
		borderRadius: 5,
	},
	textSection: {
		padding: 10,
		marginBottom: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	authText: {
		fontFamily: 'karla',
		color: COLORS.WHITE,
		fontSize: 30,
	},
	textLight: {
		color: COLORS.DARKPRIMARY,
	},

	input: {
		margin: 10,
		fontFamily: 'karla',
		paddingHorizontal: 8,
		borderColor: '#909090',
		borderWidth: 1,
		borderRadius: 5,
	},

	inputItself: {
		color: COLORS.TEXT,
		fontSize: 15,
		padding: 8,
	},
	inputItselfLight: {
		color: COLORS.DARKTEXT,
		fontSize: 15,
		padding: 8,
	},

	disabledInput: {
		color: COLORS.MID,
		fontSize: 15,
		padding: 8,
	},
	disabledInputLight: {
		color: COLORS.MID,
		fontSize: 15,
		padding: 8,
	},

	passwordInputs: {
		flex: 1,
	},
	passwordInput: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	registerTextContainer: {
		backgroundColor: COLORS.DARKPRIMARY,
		borderRadius: 50,
		marginHorizontal: 15,
		padding: 10,
		marginTop: 10,
		marginBottom: 15,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	registerTextContainerLight: {
		backgroundColor: COLORS.BEFORELIGHT,
		borderRadius: 50,
		marginHorizontal: 15,
		padding: 10,
		marginTop: 10,
		marginBottom: 15,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	registerText: {
		fontFamily: 'roboto',
		color: COLORS.GREEN,
		fontSize: 23,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		// height: 50,
	},
	registerTextLight: {
		fontFamily: 'roboto',
		color: COLORS.PRIMARY,
		fontSize: 23,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		// height: 50,
	},

	registerIconContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: 55,
		height: 55,
		padding: 5,
		backgroundColor: COLORS.GREEN,
		borderRadius: 50,
		elevation: 10,
	},
	registerIconContainerLight: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: 55,
		height: 55,
		padding: 5,
		backgroundColor: COLORS.PRIMARY,
		borderRadius: 50,
		elevation: 10,
	},

	otherContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 5,
		marginTop: 20,
		flexDirection: 'row',
	},
	otherContainerLight: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 5,
		marginTop: 20,
	},

	other: {
		flexDirection: 'row',
		fontFamily: 'inter',
		color: COLORS.WHITE,
		fontSize: 14,
		textAlign: 'center',
		textDecorationLine: 'underline',
		// backgroundColor: COLORS.PRIMARY,
	},
	otherLight: {
		flexDirection: 'row',
		fontFamily: 'inter',
		color: COLORS.DARKPRIMARY,
		fontSize: 14,
		textAlign: 'center',
		textDecorationLine: 'underline',
		// backgroundColor: COLORS.PRIMARY,
	},
});

export default Login;
