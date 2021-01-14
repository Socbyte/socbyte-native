import React, { useState, useCallback, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../../val/colors/Colors';
import ModalAlert from '../../components/customs/ModalAlert';
import Firebase from '../../firebase/Firebase';
import FullScreenLoading from '../../components/customs/FullScreenLoading';
import fakeemails from './FakeMail';
import { databaseInit, fetchDatabase, insertDatabase, updateDatabase } from '../../sql/SQLStarter';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../store/Settings';

const Register = props => {
	const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const usernameValidator = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;
	const { theme } = useSelector(state => state.settings.settings);
	const dispatch = useDispatch();

	const [username, setUsername] = useState('asdfasdf');
	const [email, setEmail] = useState('asdfsadf');
	const [password, setPassword] = useState('asdfasdf');
	const [showPassword, setShowPassword] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState({});
	const [loading, setLoading] = useState(false);

	const registerNewUser = useCallback(() => {
		setDisabled(true);
		setLoading(true);
		setError(false);

		if (email.length <= 0 || password.length <= 0 || username.length <= 0) {
			setDisabled(false);
			setLoading(false);
			setError({
				header: 'Required!',
				desc: 'All email, password and username are required to create a new account.',
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
		} else if (username.length < 8 || username.length > 15) {
			setDisabled(false);
			setLoading(false);

			setError({
				header: 'Invalid Username!',
				desc: 'Username must have characters between 8 - 15.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});

			return;
		} else if (!username.match(usernameValidator)) {
			setDisabled(false);
			setLoading(false);

			setError({
				header: 'Invalid Username!',
				desc: 'Please enter a valid uesrname.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});

			return;
		} else if (password.length < 8) {
			setDisabled(false);
			setLoading(false);

			setError({
				header: 'Invalid Password!',
				desc: 'Password must contain at least 8 characters.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});

			return;
		}

		for (let i = 0; i < fakeemails.length; ++i) {
			if (email.includes(fakeemails[i])) {
				setDisabled(false);
				setLoading(false);

				setError({
					header: 'Spam Email!',
					desc:
						'spam emails are not allowed in our system. please try using any verified email service.',
					primary: 'Okay!',
					primaryFunction: () => setError(false),
				});
				return;
			}
		}
		let time = new Date();

		Firebase.database()
			.ref('Details')
			.child('authentication_settings')
			.once('value')
			.then(snap => {
				if (snap.val()) {
					if (snap.val().regOpen) {
						Firebase.database()
							.ref('Accounts')
							.child(username)
							.once('value')
							.then(snap => {
								if (snap.val()) {
									setDisabled(false);
									setLoading(false);

									setError({
										header: 'Username Taken!',
										desc: `username is already taken. please choose a different username other than (${username})`,
										primary: 'Okay!',
										primaryFunction: () => setError(false),
									});
									return;
								} else {
									Firebase.auth()
										.createUserWithEmailAndPassword(email, password)
										.then(res => {
											Firebase.database()
												.ref('Users')
												.child(username)
												.set({
													written: {
														written: 0,
													},
													follow: {
														following: 0,
														followers: 0,
														followingList: {},
														followerList: {},
													},
													social: {
														github: '',
														linkedin: '',
														dribbble: '',
														instagram: '',
														facebook: '',
														twitter: '',
													},
													joinedOn: {
														year: time.getFullYear(),
														month: time.getMonth(),
														day: time.getDay(),
														hour: time.getHours(),
														min: time.getMinutes(),
														sec: time.getSeconds(),
														millisec: time.getMilliseconds(),
													},
													verified: '',
													profileImg: '',
													education: {},
													ratings: 1,
													about: '',
													expertise: '',
													location: '',
													coverImg: '',
													facolor: '#0f60b6',
													fullname: '',
													phoneNo: '',
													profileType: true,
													publics: true,
													status: '',
													email: email,
													username: username,
												})
												.then(res => {})
												.catch(err => {});

											Firebase.database()
												.ref('Accounts')
												.child(username)
												.set({
													username: username,
												});

											Firebase.auth().currentUser.updateProfile({
												displayName: username,
												photoURL: '',
												phoneNo: '',
											});

											//create local database
											databaseInit()
												.then(() => {
													insertDatabase('theme', 'd');
													insertDatabase('fontSize', 'm');
													insertDatabase('email', email);
													insertDatabase('username', username);
													insertDatabase('primaryColor', COLORS.GREEN);
													insertDatabase(
														'invertPrimaryColor',
														COLORS.BLACK
													);

													updateDatabase('theme', 'd');
													updateDatabase('fontSize', 'm');
													updateDatabase('email', email);
													updateDatabase('username', '');
													updateDatabase('primaryColor', COLORS.GREEN);
													updateDatabase(
														'invertPrimaryColor',
														COLORS.BLACK
													);
												})
												.catch(err => {
													console.log('DATABASE CREATED');
													insertDatabase('theme', 'd');
													insertDatabase('fontSize', 'm');
													insertDatabase('email', email);
													insertDatabase('username', '');
													insertDatabase('primaryColor', COLORS.GREEN);
													insertDatabase(
														'invertPrimaryColor',
														COLORS.BLACK
													);

													updateDatabase('theme', 'd');
													updateDatabase('fontSize', 'm');
													updateDatabase('email', email);
													updateDatabase('username', '');
													updateDatabase('primaryColor', COLORS.GREEN);
													updateDatabase(
														'invertPrimaryColor',
														COLORS.BLACK
													);
												});

											setUsername('');
											setEmail('');
											setPassword('');
											setError(false);
											setLoading(false);
											setDisabled(false);
											setShowPassword(false);
										})
										.catch(err => {
											if (err.code.includes('auth/email-already-in-use')) {
												setDisabled(false);
												setLoading(false);

												setError({
													header: 'Account Exists!',
													desc:
														'email is already registered. try using other email address.',
													primary: 'Okay!',
													primaryFunction: () => setError(false),
												});
												return;
											} else {
												setDisabled(false);
												setLoading(false);

												setError({
													header: 'Error!',
													desc:
														'some error occurred while creating your account please try again, or contact the developer so this could be fixed',
													primary: 'Okay!',
													primaryFunction: () => setError(false),
												});
												return;
											}
										});
								}
								setDisabled;
							})
							.catch(err => {
								setDisabled(false);
								setLoading(false);

								setError({
									header: 'Error!',
									desc:
										'1. Cannot contact with the server currently. Servers are busy. Please try again.',
									primary: 'Okay!',
									primaryFunction: () => setError(false),
								});
								return;
							});
					} else {
						setDisabled(false);
						setLoading(false);

						setError({
							header: 'Registration Closed!',
							desc:
								'New Users Registration is not allowed currently, Since the server load has increased too much. But you can login if you have an other account. For more details please contact the developer.',
							primary: 'Okay!',
							primaryFunction: () => setError(false),
						});
						return;
					}
				}
			})
			.catch(err => {
				console.log(err);
				setDisabled(false);
				setLoading(false);

				setError({
					header: 'Error!',
					desc:
						'2. Cannot contact with the server currently. Servers are busy. Please try again.',
					primary: 'Okay!',
					primaryFunction: () => setError(false),
				});
				return;
			});
	}, [email, password, username]);

	const loadLoginForm = () => {
		props.navigation.replace('Login');
	};

	const loadInformation = () => {
		props.navigation.navigate('Information');
	};

	const whatIsTheme = (firstVal, secondVal) => {
		return !theme || theme === 'd' ? firstVal : secondVal;
	};

	const toggleTheme = () => {
		// console.log('TOGGLE THE CURRENT THEME...');
		const toggledTheme = whatIsTheme('l', 'd');
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
		<View style={styles.screen}>
			{loading ? <FullScreenLoading loadingType={true} /> : null}

			{error ? (
				<ModalAlert
					header={error.header}
					description={error.desc}
					disableFunction={setError}
					visible={error.header ? true : false}
					primary={error.primary}
					primaryFunction={
						error.primaryFunction ? error.primaryFunction : setError(false)
					}
				/>
			) : null}

			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<View style={styles.compo}>
					<View style={styles.textSection}>
						<TouchableWithoutFeedback onPress={toggleTheme}>
							<View>
								<Text
									style={[styles.authText, whatIsTheme(null, styles.textLight)]}>
									Create
								</Text>
								<Text
									style={[styles.authText, whatIsTheme(null, styles.textLight)]}>
									Account
								</Text>
							</View>
						</TouchableWithoutFeedback>
						<View>
							<TouchableOpacity onPress={loadInformation}>
								<Ionicons
									name='information'
									color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
									size={24}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ ...styles.input }}>
						<TextInput
							style={
								disabled
									? whatIsTheme(styles.disabledInput, styles.disabledInputLight)
									: whatIsTheme(styles.inputItself, styles.inputItselfLight)
							}
							editable={!disabled}
							autoCompleteType='username'
							placeholder='Username'
							placeholderTextColor={whatIsTheme(
								COLORS.PLACEHOLDER,
								COLORS.DARKPLACEHOLDER
							)}
							value={username}
							onChangeText={setUsername}
							keyboardType='default'
							returnKeyType='next'
						/>
					</View>

					<View style={{ ...styles.input }}>
						<TextInput
							style={
								disabled
									? whatIsTheme(styles.disabledInput, styles.disabledInputLight)
									: whatIsTheme(styles.inputItself, styles.inputItselfLight)
							}
							editable={!disabled}
							autoCompleteType='email'
							placeholder='Email'
							placeholderTextColor={whatIsTheme(
								COLORS.PLACEHOLDER,
								COLORS.DARKPLACEHOLDER
							)}
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
										: whatIsTheme(styles.inputItself, styles.inputItselfLight)
								}
								editable={!disabled}
								placeholder='Password'
								placeholderTextColor={whatIsTheme(
									COLORS.PLACEHOLDER,
									COLORS.DARKPLACEHOLDER
								)}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={showPassword}
							/>
						</View>
						<TouchableOpacity
							onPress={() => {
								setShowPassword(!showPassword);
							}}>
							<Ionicons
								style={{ marginLeft: 8 }}
								name={showPassword ? 'eye-off' : 'eye'}
								size={20}
								color={whatIsTheme(COLORS.WHITE, COLORS.DARKPRIMARY)}
							/>
						</TouchableOpacity>
					</View>

					<View
						style={whatIsTheme(
							styles.registerTextContainer,
							styles.registerTextContainerLight
						)}>
						<TouchableOpacity onPress={registerNewUser}>
							<Text
								style={whatIsTheme(styles.registerText, styles.registerTextLight)}>
								Sign Up
							</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={registerNewUser}>
							<View
								style={whatIsTheme(
									styles.registerIconContainer,
									styles.registerIconContainerLight
								)}>
								<Ionicons
									name='arrow-forward'
									color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}
									size={28}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<TouchableOpacity onPress={loadLoginForm}>
						<View
							style={whatIsTheme(
								styles.loginTextContainer,
								styles.loginTextContainerLight
							)}>
							<Text style={whatIsTheme(styles.loginText, styles.loginTextLight)}>
								Already A User? Login!
							</Text>
						</View>
					</TouchableOpacity>
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
		elevation: 2,
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

	loginTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 5,
		marginTop: 20,
	},
	loginTextContainerLight: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 5,
		marginTop: 20,
	},

	loginText: {
		fontFamily: 'inter',
		color: COLORS.WHITE,
		fontSize: 14,
		textAlign: 'center',
		textDecorationLine: 'underline',
		// backgroundColor: COLORS.PRIMARY,
	},
	loginTextLight: {
		fontFamily: 'inter',
		color: COLORS.DARKPRIMARY,
		fontSize: 14,
		textAlign: 'center',
		textDecorationLine: 'underline',
		// backgroundColor: COLORS.PRIMARY,
	},
});

export default Register;
