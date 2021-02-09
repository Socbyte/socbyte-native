import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import MainChat from './screens/ChatsMain';
import CreateChattingGroup from './screens/CreateChatGroup';
import ChatScreen from './screens/chat/ChatsScreen';
import GroupDetailsScreen from './screens/GroupDetailsScreen';
import GroupSearch from './screens/search/GroupSearch';
import ShowGroupDetails from './screens/search/ShowGroupDetails';
import ShowProfileDetails from '../ProfileSearch/ShowSearchedUserProfile';
import GroupsNotifications from './screens/GroupNotifications';
import FollowingTab from '../ProfileSearch/FollowingsTab';
import FollowsTab from '../ProfileSearch/FollowsTab';

const ChatNavigator = createStackNavigator();
const ChatNavigation = (props) => {
	return (
		<ChatNavigator.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<ChatNavigator.Screen name='ChatsHome' component={MainChat} />

			<ChatNavigator.Screen name='Chattings' component={ChatScreen} />

			<ChatNavigator.Screen
				name='CreateChattingGroup'
				component={CreateChattingGroup}
			/>

			<ChatNavigator.Screen
				name='GroupDetails'
				component={GroupDetailsScreen}
			/>

			<ChatNavigator.Screen name='GroupSearch' component={GroupSearch} />

			<ChatNavigator.Screen
				name='GroupsNotifications'
				component={GroupsNotifications}
			/>

			<ChatNavigator.Screen
				name='ShowGroupDetails'
				component={ShowGroupDetails}
			/>

			<ChatNavigator.Screen
				name='ShowSearchedUserProfile'
				component={ShowProfileDetails}
			/>

			<ChatNavigator.Screen name='FollowTab' component={FollowsTab} />

			<ChatNavigator.Screen
				name='FollowingTab'
				component={FollowingTab}
			/>
		</ChatNavigator.Navigator>
	);
};

export default ChatNavigation;
