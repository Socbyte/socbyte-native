import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MusicHome from '../../scenes/main/music/MusicHome';
import SearchSong from '../../scenes/main/music/SearchSong';
import SearchVideo from '../../scenes/main/music/VideoSearch';

import MiniPlayer from '../../scenes/main/music/MiniPlayer';
import MusicPlayer from '../../scenes/main/music/MusicPlayer';

const MusicNavigator = createStackNavigator();
const MusicNavigation = () => {
	return (
		<MusicNavigator.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<MusicNavigator.Screen name='MusicHome' component={MusicHome} />

			<MusicNavigator.Screen name='SearchSong' component={SearchSong} />

			<MusicNavigator.Screen name='SearchVideo' component={SearchVideo} />
		</MusicNavigator.Navigator>
	);
};

const MaterialBottomNavigator = createBottomTabNavigator();
const BottomNavigator = () => {
	return (
		<MaterialBottomNavigator.Navigator
			tabBar={tabProps => {
				// console.log(tabProps);
				return <MiniPlayer {...tabProps} />;
			}}
			tabBarOptions={{
				style: {
					height: 10,
				},
			}}>
			<MaterialBottomNavigator.Screen name='MusicPlayerTab' component={MusicNavigation} />
		</MaterialBottomNavigator.Navigator>
	);
};

const MainNavigator = createStackNavigator();
const MainMusicNavigation = () => {
	return (
		<MainNavigator.Navigator
			headerMode='none'
			mode='modal'
			screenOptions={{
				animationEnabled: true,
			}}>
			<MainNavigator.Screen name='MainScreen' component={BottomNavigator} />

			<MainNavigator.Screen name='MainPlayMusicScreen' component={MusicPlayer} />
		</MainNavigator.Navigator>
	);
};
export default MainMusicNavigation;
