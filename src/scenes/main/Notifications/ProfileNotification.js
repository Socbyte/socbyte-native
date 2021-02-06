import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSelector } from 'react-redux';
import Header from '../../../components/customs/Header/Header';
import firebase from '../../../firebase/Firebase';
import COLORS from '../../../val/colors/Colors';

const ProfileNotification = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};
	const [notifications, setNotifications] = useState([]);
	const [notificationsAvail, setNotificationsAvail] = useState(true);

	useEffect(() => {
		firebase
			.database()
			.ref('Notifications')
			.child(firebase.auth().currentUser.uid)
			.once('value')
			.then(res => {
				if (res.val()) {
					const temp = [];
					for (let i in res.val()) {
						temp.push(res.val()[i]);
					}
					setNotificationsAvail(true);
					setNotifications(temp);
				} else {
					setNotificationsAvail(false);
				}
			})
			.catch(err => {
				console.log('ERROR NOTIU', err);
			});
	}, []);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				back
				headerTitle='Notifications'
			/>

			{notificationsAvail ? (
				<View>
					{notifications.map(noti => {
						const time = new Date(noti.when);
						return (
							<ListItem
								onPress={() => {
									props.navigation.navigate('ShowSearchedUserProfile', {
										uid: noti.uid,
										usernameText: noti.who,
									});
								}}
								bottomDivider
								containerStyle={{
									backgroundColor: COLORS.TRANSPARENT,
									borderBottomColor: whatIsTheme(
										COLORS.NEXTTODARK,
										COLORS.BEFORELIGHT
									),
									borderBottomWidth: 1,
								}}
								underlayColor={whatIsTheme(COLORS.DARKPRIMARY, COLORS.BEFORELIGHT)}>
								<ListItem.Content
									style={{
										justifyContent: 'space-between',
										flexDirection: 'row',
									}}>
									<ListItem.Title
										style={{
											color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
										}}>{`${noti.who} started following you.`}</ListItem.Title>
									<ListItem.Subtitle style={{ color: COLORS.MID }}>
										{time.getHours().toString().padStart(2, '0')}:
										{time.getMinutes().toString().padStart(2, '0')}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						);
					})}
				</View>
			) : (
				<View
					style={{
						height: 100,
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 18,
							fontFamily: 'roboto',
							color: COLORS.MID,
						}}>
						Empty Inbox
					</Text>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 18,
							fontFamily: 'roboto',
							color: COLORS.MID,
						}}>
						No Notifications Currently
					</Text>
				</View>
			)}
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

export default ProfileNotification;
