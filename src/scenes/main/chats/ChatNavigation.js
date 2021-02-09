import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import MainChat from './screens/ChatsMain';
import CreateChattingGroup from './screens/CreateChatGroup';
import ChatScreen from './screens/chat/ChatsScreen';
import GroupDetailsScreen from './screens/GroupDetailsScreen';

const ChatNavigator = createStackNavigator();
const ChatNavigation = props => {
	return (
		<ChatNavigator.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<ChatNavigator.Screen name='ChatsHome' component={MainChat} />

			<ChatNavigator.Screen name='Chattings' component={ChatScreen} />

			<ChatNavigator.Screen name='CreateChattingGroup' component={CreateChattingGroup} />

			<ChatNavigator.Screen name='GroupDetails' component={GroupDetailsScreen} />
		</ChatNavigator.Navigator>
	);
};

export default ChatNavigation;
