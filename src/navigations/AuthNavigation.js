import React from 'react';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from '../scenes/auth/Register';
import Login from '../scenes/auth/Login';
import ForgotPassword from '../scenes/auth/ForgotPass';
import AuthInformation from '../scenes/auth/Information';

const AuthStack = createStackNavigator();
function AuthStackNavigation(props) {
	return (
		<NavigationContainer theme={DarkTheme}>
			<AuthStack.Navigator
				screenOptions={{
					headerShown: false,
				}}>
				<AuthStack.Screen name='Register' component={Register} />
				<AuthStack.Screen name='Login' component={Login} />

				<AuthStack.Screen name='ForgotPassword' component={ForgotPassword} />
				<AuthStack.Screen name='Information' component={AuthInformation} />
			</AuthStack.Navigator>
		</NavigationContainer>
	);
}

export default AuthStackNavigation;
