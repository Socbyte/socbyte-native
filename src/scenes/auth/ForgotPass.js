import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableWithoutFeedback,
	TouchableOpacity,
	TextInput,
	Keyboard,
	Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../val/colors/Colors';
import Firebase from '../../firebase/Firebase';
import ModalAlert from '../../components/customs/ModalAlert';

const ForgotPassword = props => {
	const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	const [email, setEmail] = useState('');
	const [error, setError] = useState({});

	let ErrorModal;
	if (error) {
		ErrorModal = (
			<ModalAlert
				header={error.header}
				description={error.desc}
				disableFunction={setError}
				visible={error.header ? true : false}
				primary={error.primary}
				primaryFunction={error.primaryFunction ? error.primaryFunction : setError(false)}
			/>
		);
	}

	const sendPasswordResetEmail = () => {
		if (email.length <= 0) {
			setError({
				header: 'Required!',
				desc: 'Email is required for sending password reset mail.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});
			return;
		}

		if (!email.match(emailValidator)) {
			setError({
				header: 'Invalid Email!',
				desc: 'Please enter a valid email address.',
				primary: 'Okay!',
				primaryFunction: () => setError(false),
			});
			return;
		}
		//data is valid...
		Firebase.auth()
			.sendPasswordResetEmail(email)
			.then(response => {
				setEmail('');
				setError({
					header: 'Login!',
					desc: `Email sent to ${email}. Login Now?`,
					primaryFunction: loadLoginForm,
					primary: 'Login!',
				});
			})
			.catch(err => {
				if (err.code.includes('auth/user-not-found')) {
					setError({
						header: 'User Not Found.',
						desc:
							"There is no user record corresponding to this email. The user may have been deleted or banned or this account doesn't exists.",
						primary: 'Okay!',
						primaryFunction: () => setError(false),
					});
				} else {
					setError({
						header: 'Error',
						desc: `Error occurred while sending email to -> ${email} mail id. Please try again.`,
						primary: 'Okay!',
						primaryFunction: () => setError(false),
					});
				}
			});
	};

	const loadLoginForm = () => {
		props.navigation.replace('Login');
	};

	return (
		<View style={styles.screen}>
			{error ? ErrorModal : null}
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<View style={styles.compo}>
					<View style={styles.textSection}>
						<View>
							<Text style={styles.authText}>Forgot</Text>
							<Text style={styles.authText}>Password</Text>
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
							style={styles.inputItself}
							placeholder='Email'
							placeholderTextColor={COLORS.PLACEHOLDER}
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'
						/>
					</View>

					<View style={styles.loginTextContainer}>
						<TouchableOpacity onPress={sendPasswordResetEmail}>
							<Text style={styles.loginText}>Send Email</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={sendPasswordResetEmail}>
							<View style={styles.loginIconContainer}>
								<Ionicons name='arrow-forward' color={COLORS.WHITE} size={28} />
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.contain}>
						<TouchableOpacity onPress={loadLoginForm}>
							<View style={styles.registerTextContainer}>
								<Text style={styles.registerText}>Login</Text>
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
		marginBottom: 20,
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

	loginTextContainer: {
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
		// backgroundColor: COLORS.PRIMARY,
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
	contain: {
		alignItems: 'center',
	},
});

export default ForgotPassword;
