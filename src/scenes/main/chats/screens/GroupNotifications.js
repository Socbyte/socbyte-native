import md5 from 'md5';
import React, { useRef, useState, useEffect } from 'react';
import {
	Animated,
	ScrollView,
	StyleSheet,
	TextInput,
	ToastAndroid,
	View,
} from 'react-native';
import {
	Icon,
	ListItem,
	Text,
	Avatar as ElementAvatar,
} from 'react-native-elements';
import { Paragraph, Title, Avatar, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Header from '../../../../components/customs/Header/Header';
import firebase from '../../../../firebase/Firebase';
import COLORS from '../../../../val/colors/Colors';
import { ChatTypes } from '../../../../val/constants/Constants';

const GroupsNotifications = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const { id, groupName } = props.route.params;
	const [notifications, setNotifications] = useState([]);
	const [notificationsAvail, setNotificationsAvail] = useState(true);
	const [userIsAmongAdmin, setUserState] = useState(true);
	const { group } = useSelector((state) => state.groups);

	useEffect(() => {
		// console.log(group[id].admin.uids);
		// if (group[id].admin.uid === firebase.auth().currentUser.uid)
		// 	setUserState(true);
		if (group[id].coadmins) {
			for (let i in group[id].coadmins) {
				if (
					group[id].coadmins[i].uid ===
					firebase.auth().currentUser.uid
				) {
					setUserState(true);
					break;
				}
			}
		}
	}, [id, groupName]);

	const acceptUserRequest = (notif) => {
		if (groupName === null || !groupName || !userIsAmongAdmin) {
			return;
		}
		const timestamp = new Date().getTime();
		firebase
			.database()
			.ref('Groups')
			.child(id)
			.child('members')
			.child(notif.uid)
			.update({
				email: notif.email,
				username: notif.username,
				uid: notif.uid,
				admin: {
					[0]: false,
					[1]: false,
				},
			})
			.then((res) => {
				firebase
					.database()
					.ref('Users')
					.child(notif.uid)
					.child('groups')
					.child(id)
					.update({
						id,
						name: groupName,
					})
					.then(() => {})
					.catch((err) => {
						// console.log('EEfalse', err);
					});

				firebase
					.database()
					.ref('GroupsNotifications')
					.child(id)
					.child(notif.time)
					.remove()
					.then((res) => {
						ToastAndroid.showWithGravity(
							`${notif.username} accepted to group.`,
							ToastAndroid.SHORT,
							ToastAndroid.CENTER
						);
					});

				firebase
					.database()
					.ref('Messages')
					.child(id)
					.child(timestamp)
					.set({
						at: timestamp,
						msg: `${notif.username} is accepted to this group`,
						sender: 'app',
						type: ChatTypes.CMD2,
					});
			})
			.catch((err) => {
				ToastAndroid.showWithGravity(
					'cannot accept request currently',
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
				// console.log(err);
			});
	};

	const rejectUserRequest = (notif) => {
		if (groupName === null || !groupName) {
			return;
		}

		firebase
			.database()
			.ref('GroupsNotifications')
			.child(id)
			.child(notif.time)
			.remove()
			.then((res) => {
				ToastAndroid.showWithGravity(
					`${notif.username} is rejected to join this group.`,
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
			});
	};

	useEffect(() => {
		firebase
			.database()
			.ref('GroupsNotifications')
			.child(id)
			.on('value', (snap) => {
				if (!snap.val()) {
					setNotificationsAvail(false);
				}
				const list = [];
				for (let i in snap.val()) {
					list.push(snap.val()[i]);
				}
				setNotifications(list);
			});
	}, []);

	if (!notificationsAvail) {
		return (
			<View>
				<Header
					{...props}
					leftButton={() => {
						props.navigation.toggleDrawer();
					}}
					headerTitle={'Group Notifications'}
					absolute
					back
					realBackgroundColor={COLORS.TRANSPARENT}
				/>
				<View style={styles.errorArea}>
					<Text
						style={whatIsTheme(
							styles.errorTextDark,
							styles.errorTextLight
						)}
					>
						No Notifications Found
					</Text>
					<Text
						style={whatIsTheme(
							styles.errorMsgTextDark,
							styles.errorMsgTextLight
						)}
					>
						Here notifications of users joining request will be
						shown.
					</Text>
				</View>
				<View style={{ paddingBottom: 100 }} />
			</View>
		);
	}

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={'Group Notifications'}
				absolute
				back
				realBackgroundColor={COLORS.TRANSPARENT}
			/>

			<ScrollView>
				{notifications.map((notif) => {
					const time = new Date(notif.time);

					return (
						<ListItem
							onPress={() => {
								props.navigation.navigate(
									'ShowSearchedUserProfile',
									{
										uid: notif.uid,
										usernameText: `${notif.username}`,
									}
								);
							}}
							bottomDivider
							containerStyle={{
								backgroundColor: COLORS.TRANSPARENT,
								borderBottomColor: whatIsTheme(
									COLORS.NEXTTODARK,
									COLORS.BEFORELIGHT
								),
								borderBottomWidth: 1,
								flexDirection: 'column',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
							}}
							underlayColor={whatIsTheme(
								COLORS.DARKPRIMARY,
								COLORS.BEFORELIGHT
							)}
						>
							<ListItem.Content
								style={{
									paddingVertical: 10,
									width: '100%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<ListItem.Title
									numberOfLines={3}
									style={{
										color: whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										),
										// marginLeft: 30,
									}}
								>
									Requested To Join This Group
								</ListItem.Title>
								<ListItem.Subtitle
									style={{ color: COLORS.MID }}
								>
									{time
										.getHours()
										.toString()
										.padStart(2, '0')}
									:
									{time
										.getMinutes()
										.toString()
										.padStart(2, '0')}
								</ListItem.Subtitle>
							</ListItem.Content>

							<ListItem.Content
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									alignItems: 'center',
								}}
							>
								<ElementAvatar
									source={{
										uri: `https://www.gravatar.com/avatar/${md5(
											notif.email
										)}.jpg?s=200`,
									}}
									avatarStyle={{
										borderRadius: 100,
										// marginRight: 10,
									}}
								/>
								<ListItem.Title
									numberOfLines={2}
									style={{
										paddingHorizontal: 10,
										color: whatIsTheme(
											COLORS.WHITE,
											COLORS.BLACK
										),
									}}
								>
									{notif.username}
								</ListItem.Title>
							</ListItem.Content>

							{userIsAmongAdmin ? (
								<ListItem.Content
									style={{
										paddingVertical: 4,
										width: '100%',
										flexDirection: 'row',
										justifyContent: 'space-around',
										alignItems: 'center',
									}}
								>
									<Button
										onPress={() => rejectUserRequest(notif)}
										color={COLORS.RED}
										contentStyle={{
											backgroundColor: whatIsTheme(
												COLORS.DARKPRIMARY,
												COLORS.BEFORELIGHT
											),
										}}
									>
										Reject
									</Button>
									<Button
										onPress={() => acceptUserRequest(notif)}
										color={COLORS.BLUE_FAV}
										contentStyle={{
											backgroundColor: whatIsTheme(
												COLORS.DARKPRIMARY,
												COLORS.BEFORELIGHT
											),
										}}
									>
										Accept
									</Button>
								</ListItem.Content>
							) : null}
						</ListItem>
					);
				})}

				<View style={{ paddingBottom: 100 }} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	errorArea: {
		minHeight: 300,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorTextDark: {
		fontSize: 20,
		textAlign: 'center',
		padding: 10,
		color: COLORS.WHITE,
	},
	errorTextLight: {
		fontSize: 20,
		textAlign: 'center',
		padding: 10,
		color: COLORS.BLACK,
	},
	errorMsgTextDark: {
		fontSize: 16,
		color: COLORS.MID,
		textAlign: 'center',
		padding: 6,
		marginHorizontal: 5,
	},
	errorMsgTextLight: {
		fontSize: 16,
		color: COLORS.MID,
		textAlign: 'center',
		padding: 6,
		marginHorizontal: 5,
	},
});

export default GroupsNotifications;
