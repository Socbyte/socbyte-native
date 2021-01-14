import React from 'react';
import { ToastAndroid } from 'react-native';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';
import { PureListItem } from './MainSettings';

const HelpSetting = props => {
	const { theme } = useSelector(state => state.settings.settings);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle='Appearance'
				back
			/>

			<ScrollView>
				<PureListItem
					title='FAQs'
					description='if you have any questions'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						ToastAndroid.show(
							'Currently in development. Visit GitHub Repo for more detail.',
							ToastAndroid.SHORT
						);
						// props.navigation.navigate('FAQ');
					}}
					iconName='ios-help-circle-outline'
					iconType='ionicon'
					iconSize={28}
				/>
				<PureListItem
					title='Contact Me'
					description='send a query if any'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('Contactus');
					}}
					iconName='user'
					iconType='font-awesome'
					iconSize={28}
					extraStyle={{ marginRight: 8 }}
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default HelpSetting;
