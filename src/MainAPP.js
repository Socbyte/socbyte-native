import React, { useEffect } from 'react';

import * as Font from 'expo-font';
import * as AppLoading from 'expo-splash-screen';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import MainReducer from './store/MainStore';
import SettingsReducer from './store/Settings';

import MainAuthNavigation from './navigations/Navigation';

const CheckAfterEffects = store => {
	return next => {
		return action => {
			const dispatch = next(action);
			// console.log('STATE ->> ', store.getState());

			return dispatch;
		};
	};
};

const rootReducer = combineReducers({
	main: MainReducer,
	settings: SettingsReducer,
});

const store = createStore(rootReducer, applyMiddleware(CheckAfterEffects, ReduxThunk));

const MainApp = props => {
	const loadFonts = () => {
		return Font.loadAsync({
			karla: require('./assets/fonts/Karla.ttf'),
			karlaBold: require('./assets/fonts/KarlaBold.ttf'),
			roboto: require('./assets/fonts/Roboto.ttf'),
			robotoBold: require('./assets/fonts/RobotoBold.ttf'),
			inter: require('./assets/fonts/Inter.ttf'),
		});
	};

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
		}).then(res => {
			AppLoading.hideAsync();
			console.log('fonts loaded');
		});
	}, []);

	return (
		<Provider store={store}>
			<MainAuthNavigation />
		</Provider>
	);
};

export default MainApp;
