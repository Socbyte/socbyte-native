import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import { List, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';
import { ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export const PureListItem = ({
	onPress,
	whatIsTheme,
	title,
	description,
	iconName,
	iconType,
	iconSize,
	extraStyle,
}) => {
	return (
		<List.Item
			onPress={onPress}
			rippleColor={whatIsTheme(COLORS.DARKGLOW, COLORS.DARKFORLIGHT)}
			title={title}
			description={description ? description : ''}
			titleStyle={{
				color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
				fontFamily: 'Inter',
			}}
			descriptionStyle={styles.listItemDescription}
			style={{
				borderBottomColor: whatIsTheme(
					COLORS.DARKSECONDARY,
					COLORS.DARKFORLIGHT
				),
				borderBottomWidth: 1,
				fontFamily: 'Inter',
			}}
			left={(props) => (
				<Icon
					style={[styles.listIcon, extraStyle ? extraStyle : null]}
					name={iconName}
					type={iconType}
					size={iconSize ? iconSize : 22}
					color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
				/>
			)}
		/>
	);
};

const Settings = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);

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
				headerTitle='Settings'
			/>
			<ScrollView>
				<PureListItem
					title='Account Settings'
					description='fullname, cover image, status, about'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('EditProfileAbout');
					}}
					iconName='account-edit-outline'
					iconType='material-community'
					iconSize={26}
				/>

				<PureListItem
					title='Other Details'
					description='expertise, education, socials'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('EditProfileOther');
					}}
					iconName='card-account-details-outline'
					iconType='material-community'
					iconSize={24}
				/>

				<PureListItem
					title='Notification'
					description='Sound, Others'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						ToastAndroid.show(
							'This feature is in development.',
							ToastAndroid.LONG
						);
					}}
					iconName='notifications'
					iconType='ionicon'
					iconSize={26}
				/>

				<PureListItem
					title='Appearance'
					description='theme, font'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('AppearanceSetting');
					}}
					iconName='setting'
					iconType='antdesign'
					iconSize={26}
				/>

				<PureListItem
					title='Privacy'
					description='SocByte PIN'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						ToastAndroid.show(
							'This feature is in development.',
							ToastAndroid.LONG
						);
					}}
					iconName='lock'
					iconType='entypo'
					iconSize={26}
				/>

				<PureListItem
					title='Help'
					description='contact us, FAQ'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('HelpSetting');
					}}
					iconName='ios-help-circle-outline'
					iconType='ionicon'
					iconSize={28}
				/>

				<PureListItem
					title='Danger'
					description='user data will be removed'
					whatIsTheme={whatIsTheme}
					onPress={() => {
						props.navigation.navigate('DangerSection');
					}}
					iconName='circle-with-cross'
					iconType='entypo'
					iconSize={24}
				/>

				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						padding: 10,
						marginVertical: 10,
					}}
				>
					<Text
						style={{
							color: `${whatIsTheme(
								COLORS.GREEN,
								COLORS.PRIMARY
							)}cf`,
							fontSize: 35,
							textTransform: 'uppercase',
							fontFamily: 'karla',
						}}
					>
						SocByte
					</Text>
					<Text
						style={{
							color: COLORS.MID,
							fontFamily: 'karla',
							fontSize: 15,
						}}
					>
						by - sobhanbera
					</Text>
				</View>
				<View style={{ paddingBottom: 90 }} />
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
	listItemDescription: {
		color: COLORS.MID,
	},
	listIcon: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		paddingHorizontal: 10,
		minWidth: 40,
		// backgroundColor: COLORS.RED,
	},
});

export default Settings;
