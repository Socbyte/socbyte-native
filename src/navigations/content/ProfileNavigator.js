import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../../scenes/main/Profile';

import EditProfileByPart from '../../scenes/main/EditProfileTabs/EditProfileSingle';
import { EditProfileAbout } from '../../scenes/main/EditProfileTabs/EditProfile';

const ProfileStack = createStackNavigator();
const ProfileNavigator = () => {
	return (
		<ProfileStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<ProfileStack.Screen name='Profile' component={Profile} />
			<ProfileStack.Screen name='EditProfile' component={EditProfileAbout} />
			<ProfileStack.Screen name='EditProfilePart' component={EditProfileByPart} />
		</ProfileStack.Navigator>
	);
};

export default ProfileNavigator;
