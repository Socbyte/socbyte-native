import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../val/colors/Colors';

import Firebase from '../../firebase/Firebase';
import ModalAlert from '../../components/customs/ModalAlert';
import FullScreenLoading from '../../components/customs/FullScreenLoading';
import { databaseInit, insertDatabase } from '../../sql/SQLStarter';

const Login = props => {
	const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	const [email, setEmail] = useState('sobhanbera258@gmail.com');
	const [password, setPassword] = useState('SOBHANbera1');
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
				desc: 'Both email and password are required to login into your account.',
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
			.then(res => {
				// signed in successfully
				//create local database
				databaseInit()
					.then(() => {
						console.log('DATABASE CREATED');
						insertDatabase('theme', 'd');
						insertDatabase('fontSize', 'm');
						insertDatabase('email', email);
						insertDatabase('username', '');
						insertDatabase('primaryColor', COLORS.GREEN);
						insertDatabase('invertPrimaryColor', COLORS.BLACK);
					})
					.catch(err => {});

				setDisabled(false);
				setLoading(false);
				setError(false);
			})
			.catch(err => {
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
						desc: 'Entered password in wrong. Please enter the correct password.',
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
		props.navigation.replace('ForgotPassword');
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
					primaryFunction={error.primaryFunction ? error.primaryFunction : setError(false)}
				/>
			) : null}

			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<View style={styles.compo}>
					<View style={styles.textSection}>
						<View>
							<Text style={styles.authText}>Welcome</Text>
							<Text style={styles.authText}>Back</Text>
						</View>
						<View>
							<TouchableOpacity
								onPress={() => {
									props.navigation.navigate('Information');
								}}>
								<Ionicons name='information' color={COLORS.WHITE} size={24} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ ...styles.input }}>
						<TextInput
							autoCompleteType='email'
							style={disabled ? styles.disabledInput : styles.inputItself}
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
								style={disabled ? styles.disabledInput : styles.inputItself}
								editable={!disabled}
								placeholder='Password'
								placeholderTextColor={COLORS.PLACEHOLDER}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={showPassword}
							/>
						</View>
						<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
							<Ionicons style={{ marginLeft: 8 }} name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.WHITE} />
						</TouchableOpacity>
					</View>

					<View style={styles.loginTextContainer}>
						<TouchableOpacity onPress={loginExistingUser}>
							<Text style={styles.loginText}>Login</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={loginExistingUser}>
							<View style={styles.loginIconContainer}>
								<Ionicons name='arrow-forward' color={COLORS.WHITE} size={28} />
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.registerContainer}>
						<TouchableOpacity onPress={loadRegisterForm}>
							<View style={styles.registerTextContainer}>
								<Text style={styles.registerText}>Sign Up!</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={loadForgotPasswordForm}>
							<View style={styles.registerTextContainer}>
								<Text style={styles.registerText}>Forgot Password</Text>
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
	disabledInput: {
		color: COLORS.GREY,
		fontSize: 15,
	},
	passwordInputs: {
		flex: 1,
	},
	passwordInput: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	loginTextContainer: {
		backgroundColor: COLORS.NEXTTODARK,
		borderRadius: 50,
		marginHorizontal: 15,
		padding: 10,
		marginTop: 10,
		marginBottom: 15,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	loginIconContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: 55,
		height: 55,
		padding: 5,
		backgroundColor: COLORS.PRIMARY,
		borderRadius: 50,
	},
	loginText: {
		fontFamily: 'roboto',
		color: COLORS.WHITE,
		fontSize: 23,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		// height: 50,
	},
	registerTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 5,
	},
	registerText: {
		fontFamily: 'inter',
		color: COLORS.WHITE,
		fontSize: 14,
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
	registerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		paddingHorizontal: 15,
	},
});

export default Login;
