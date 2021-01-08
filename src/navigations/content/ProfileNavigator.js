import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../../scenes/main/Profile';

const ProfileStack = createStackNavigator();
const ProfileNavigator = () => {
	return (
		<ProfileStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<ProfileStack.Screen name='Profile' component={Profile} />
			<ProfileStack.Screen name='EditProfile' component={Profile} />
		</ProfileStack.Navigator>
	);
};

export default ProfileNavigator;
