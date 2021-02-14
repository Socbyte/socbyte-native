import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../val/colors/Colors';
import Firebase from '../../firebase/Firebase';
import ModalAlert from '../../components/customs/ModalAlert';
import { deleteTable, updateDatabase } from '../../sql/SQLStarter';
import { updateSettings } from '../../store/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const ForgotPassword = props => {
    const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const { theme } = useSelector(state => state.settings.settings);
        const dispatch = useDispatch();

        const [email, setEmail] = useState(props.route?.params.email ? props.route?.params.email : '');
        const [error, setError] = useState({});

        let ErrorModal;
        if (error) {
            ErrorModal = (
                <ModalAlert header={error.header} description={error.desc} disableFunction={setError} visible={error.header ? true : false} primary={error.primary} primaryFunction={error.primaryFunction ? error.primaryFunction : setError(false)} />
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
                        desc: "There is no user record corresponding to this email. The user may have been deleted or banned or this account doesn't exists.",
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
        // deleteTable().then(() => console.log('DELETED'));
    };

    const loadLoginForm = () => {
        props.navigation.replace('Login', {email});
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
        <TouchableWithoutFeedback onPress={toggleTheme}>
        <View>
        <Text style={[styles.authText, whatIsTheme(null, styles.textLight)]}>Forgot</Text>
        <Text style={[styles.authText, whatIsTheme(null, styles.textLight)]}>Password</Text>
        </View>
        </TouchableWithoutFeedback>
        <View>
        <TouchableOpacity
        onPress={() => {
            props.navigation.navigate('Information');
        }}>
        <Ionicons name='information' color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)} size={24} />
        </TouchableOpacity>
        </View>
        </View>

        <View style={{ ...styles.input }}>
        <TextInput
        style={whatIsTheme(styles.inputItself, styles.inputItselfLight)}
        autoCompleteType='email'
        placeholder='Email'
        placeholderTextColor={whatIsTheme(COLORS.PLACEHOLDER, COLORS.DARKPLACEHOLDER)}
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        />
        </View>

        <View style={whatIsTheme(styles.registerTextContainer, styles.registerTextContainerLight)}>
        <TouchableOpacity onPress={sendPasswordResetEmail}>
        <Text style={whatIsTheme(styles.registerText, styles.registerTextLight)}>Send Mail</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={sendPasswordResetEmail}>
        <View style={whatIsTheme(styles.registerIconContainer, styles.registerIconContainerLight)}>
        <Ionicons name='arrow-forward' color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)} size={28} />
        </View>
        </TouchableOpacity>
        </View>

        <View style={styles.contain}>
        <TouchableOpacity onPress={loadLoginForm}>
        <View style={whatIsTheme(styles.otherContainer, styles.otherContainerLight)}>
        <Text style={whatIsTheme(styles.other, styles.otherLight)}>Login</Text>
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

    otherContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginTop: 20,
    },
    otherContainerLight: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginTop: 20,
    },

    other: {
        fontFamily: 'inter',
        color: COLORS.WHITE,
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
        // backgroundColor: COLORS.PRIMARY,
    },
    otherLight: {
        fontFamily: 'inter',
        color: COLORS.DARKPRIMARY,
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
        // backgroundColor: COLORS.PRIMARY,
    },

    contain: {
        alignItems: 'center',
    },
});

export default ForgotPassword;
