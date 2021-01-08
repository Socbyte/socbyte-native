import React, { useEffect, useState } from 'react';

import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from '../scenes/auth/Register';
import Login from '../scenes/auth/Login';
import ForgotPassword from '../scenes/auth/ForgotPass';
import AuthInformation from '../scenes/auth/Information';
import { deleteTable, fetchDatabase } from '../sql/SQLStarter';
import { useSelector } from 'react-redux';

const AuthStack = createStackNavigator();
function AuthStackNavigation(props) {
	const { theme } = useSelector(state => state.settings.settings);

	return (
		<NavigationContainer theme={!theme ? DarkTheme : theme === 'd' ? DarkTheme : DefaultTheme}>
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
