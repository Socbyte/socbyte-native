import React, { useEffect } from 'react';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import * as AppLoading from 'expo-splash-screen';

import TrackPlayer, {
	CAPABILITY_JUMP_BACKWARD,
	CAPABILITY_JUMP_FORWARD,
	CAPABILITY_PAUSE,
	CAPABILITY_PLAY,
	CAPABILITY_SKIP,
	CAPABILITY_SKIP_TO_NEXT,
	CAPABILITY_SKIP_TO_PREVIOUS,
	CAPABILITY_STOP,
} from 'react-native-track-player';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import MainReducer from './store/MainStore';
import SettingsReducer, { loadSettings } from './store/Settings';

import MainAuthNavigation from './navigations/Navigation';
import {
	databaseInit,
	fetchDatabase,
	insertDatabase,
	updateDatabase,
} from './sql/SQLStarter';
import COLORS from './val/colors/Colors';
import GroupsReducer from './store/GroupsStore';
import MessagesReducer from './store/ChatsStore';
import { StatusBar } from 'react-native';

const CheckAfterEffects = (store) => {
	return (next) => {
		return (action) => {
			const dispatch = next(action);
			return dispatch;
		};
	};
};

const rootReducer = combineReducers({
	main: MainReducer,
	settings: SettingsReducer,
	groups: GroupsReducer,
	messages: MessagesReducer,
});

const store = createStore(
	rootReducer,
	applyMiddleware(CheckAfterEffects, ReduxThunk)
);

const MainApp = (props) => {
	return (
		<Provider store={store}>
			<MainAppStartEntryPoint />
		</Provider>
	);
};

const MainAppStartEntryPoint = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		try {
			AppLoading.preventAutoHideAsync();
		} catch (e) {
			console.warn('Error while loading fonts: ', e);
		}
		Font.loadAsync({
			karla: require('./assets/fonts/Karla.ttf'),
			karlaBold: require('./assets/fonts/KarlaBold.ttf'),
			roboto: require('./assets/fonts/Roboto.ttf'),
			robotoBold: require('./assets/fonts/RobotoBold.ttf'),
			inter: require('./assets/fonts/Inter.ttf'),
		}).then((res) => {
			fetchDatabase()
				.then((result) => {
					const settings = JSON.parse(
						JSON.stringify(result.rows._array)
					);
					dispatch(loadSettings(settings));
					// .then(() => {
					// })
					// .catch(err => {
					// 	AppLoading.hideAsync();
					// });
					AppLoading.hideAsync();
				})
				.catch((err) => {
					// updateDatabase('email', email);
					// updateDatabase('username', '');
					databaseInit()
						.then((res) => {
							insertDatabase('theme', 'd');
							insertDatabase('fontSize', 'm');
							insertDatabase('primaryColor', COLORS.GREEN);
							insertDatabase('invertPrimaryColor', COLORS.BLACK);

							updateDatabase('theme', 'd');
							updateDatabase('fontSize', 'm');
							updateDatabase('primaryColor', COLORS.GREEN);
							updateDatabase('invertPrimaryColor', COLORS.BLACK);
							fetchDatabase()
								.then((result) => {
									AppLoading.hideAsync();
									const settings = JSON.parse(
										JSON.stringify(result.rows._array)
									);
									dispatch(loadSettings(settings));
								})
								.catch((err) => {
									AppLoading.hideAsync();
								});
						})
						.catch((err) => {
							databaseInit();
							AppLoading.hideAsync();
							alert('cannot load themes');
						});
				});
		});
	}, []);

	useEffect(() => {
		TrackPlayer.updateOptions({
			stopWithApp: false,
			icon: () => <Icon name='down' type='ant-design' />,
			jumpInterval: 5,
			color: '#4040efff',
			capabilities: [
				CAPABILITY_PLAY,
				CAPABILITY_PAUSE,
				CAPABILITY_STOP,
				CAPABILITY_SKIP,
				CAPABILITY_SKIP_TO_NEXT,
				CAPABILITY_SKIP_TO_PREVIOUS,
				CAPABILITY_JUMP_BACKWARD,
				CAPABILITY_JUMP_FORWARD,
			],
			notificationCapabilities: [
				CAPABILITY_PLAY,
				CAPABILITY_PAUSE,
				CAPABILITY_STOP,
				CAPABILITY_JUMP_BACKWARD,
				CAPABILITY_JUMP_FORWARD,
			],
			compactCapabilities: [
				CAPABILITY_PLAY,
				CAPABILITY_PAUSE,
				CAPABILITY_STOP,
				CAPABILITY_SKIP,
				CAPABILITY_SKIP_TO_NEXT,
				CAPABILITY_SKIP_TO_PREVIOUS,
			],
		});

		TrackPlayer.registerPlaybackService(() =>
			require('./scenes/main/profileMusic/Services')
		);

		TrackPlayer.setupPlayer().then(async (res) => {});
	}, []);

	return (
		<>
			<StatusBar
				barStyle='light-content'
				backgroundColor={COLORS.BLACK}
			/>
			<MainAuthNavigation />
		</>
	);
};

export default MainApp;
