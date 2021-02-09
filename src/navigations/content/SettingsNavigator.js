import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../../scenes/main/settings/MainSettings';

import { EditProfileAbout, EditProfileOther } from '../../scenes/main/EditProfileTabs/EditProfile';
import AppearanceSetting from '../../scenes/main/settings/Appearance';
import HelpSetting from '../../scenes/main/settings/HelpSetting';
import EditProfileByPart from '../../scenes/main/EditProfileTabs/EditProfileSingle';
import LogoutUser from '../../scenes/main/settings/Logout';
import { FAQ, ContactUS } from '../../scenes/main/settings/helpSections/FAQs';
import DangerSection from '../../scenes/main/settings/Danger';
import DeleteUserAccount from '../../scenes/main/settings/dangerZone/DeleteAccount';
import VerifyUserAccount from '../../scenes/main/settings/dangerZone/VerifyAccount';
import ThemeToggler from '../../scenes/main/animations/ThemeToggler';

const SettingStack = createStackNavigator();
const SettingNavigator = () => {
	return (
		<SettingStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<SettingStack.Screen name='Settings' component={Settings} />

			<SettingStack.Screen name='EditProfileAbout' component={EditProfileAbout} />
			<SettingStack.Screen name='EditProfileOther' component={EditProfileOther} />
			<SettingStack.Screen name='EditProfileSingle' component={EditProfileByPart} />

			<SettingStack.Screen name='AppearanceSetting' component={AppearanceSetting} />

			<SettingStack.Screen name='HelpSetting' component={HelpSetting} />
			<SettingStack.Screen name='FAQ' component={FAQ} />
			<SettingStack.Screen name='Contactus' component={ContactUS} />

			<SettingStack.Screen name='DangerSection' component={DangerSection} />
			<SettingStack.Screen name='DeleteUserAccount' component={DeleteUserAccount} />
			<SettingStack.Screen name='VerifyUserAccount' component={VerifyUserAccount} />

			<SettingStack.Screen name='Logout' component={LogoutUser} />
		</SettingStack.Navigator>
	);
};

export default SettingNavigator;
