import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	View,
	Text,
	TextInput,
	SafeAreaView,
	TouchableOpacity,
	Animated,
	ToastAndroid,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Icon, Overlay } from 'react-native-elements';
import { Avatar, Modal, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../../../../components/customs/Header/Header';
import COLORS from '../../../../../val/colors/Colors';

import firebase from '../../../../../firebase/Firebase';
import { loadGroupChats } from '../../../../../store/ChatsStore';
import { ChatTypes } from '../../../../../val/constants/Constants';

// import Sound from 'react-native-sound';
var Sound = require('react-native-sound');
const messageTone = require('../../../../../assets/sounds/message_tone.mp3');
Sound.setCategory('Playback');

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const userChatRemoveRight = (deleteFunction, progress, dragX) => {
	const scale = dragX.interpolate({
		inputRange: [-100, 0],
		outputRange: [1, 0],
		extrapolate: 'clamp',
	});

	return (
		<View style={styles.noBackRow}>
			<TouchableRipple onPress={deleteFunction}>
				<Animated.Text
					style={[
						styles.hiddenText,
						{
							color: COLORS.RED,
							transform: [{ scale }],
						},
					]}>
					Delete
				</Animated.Text>
			</TouchableRipple>

			<TouchableRipple onPress={() => {}}>
				<Animated.Text
					style={[
						styles.hiddenText,
						{
							color: COLORS.BLUE_FAV,
							transform: [{ scale }],
						},
					]}>
					Cancel
				</Animated.Text>
			</TouchableRipple>
		</View>
	);
};

const UserMessage = ({ message, whatIsTheme, deleteMessage }) => {
	return (
		<Swipeable
			friction={1.5}
			renderRightActions={(progress, dragX) => {
				userChatRemoveRight(deleteMessage, progress, dragX);
			}}>
			<View style={styles.uchatContainer}>
				<View style={styles.uchats}>
					<View
						style={[
							styles.uchatsFirst,
							{
								backgroundColor: COLORS.BLUE_FAV,
								borderRadius: 10,
							},
						]}>
						<View>
							<Text
								style={[
									styles.umsg,
									{ color: whatIsTheme(COLORS.WHITE, COLORS.WHITE) },
								]}>
								{message.msg}
							</Text>
						</View>
						<View style={styles.uchatsSecond}>
							<Text
								style={{
									color: whatIsTheme(COLORS.LIGHT_BLUE, COLORS.LIGHT_BLUE),
									textAlign: 'right',
									paddingRight: 3,
									paddingBottom: 3,
								}}>{`${message.at.hour}:${message.at.min}`}</Text>
						</View>
					</View>
				</View>
			</View>
		</Swipeable>
	);
};

const ReceivedMessage = ({ message, whatIsTheme }) => {
	return (
		<View style={styles.rchatContainer}>
			<View style={styles.rchats}>
				<View
					style={[
						styles.rchatsFirst,
						{
							backgroundColor: whatIsTheme(
								COLORS.DARKPRIMARY,
								COLORS.FINALBEFORELIGHT
							),
						},
					]}>
					<View>
						<Text
							style={[
								styles.rusername,
								{
									color: whatIsTheme(COLORS.BLUE_FAV, COLORS.BLUE_FAV),
									backgroundColor: whatIsTheme(
										'rgba(255, 255, 255, 0.08)',
										// COLORS.LIGHTBACKGROUND
										'rgba(0, 0, 0, 0.05)'
									),
								},
							]}>
							{message.sender}
						</Text>
					</View>
					<View>
						<Text
							style={[
								styles.rmsg,
								{
									color: whatIsTheme(COLORS.WHITE, COLORS.BLACK),
								},
							]}>
							{message.msg}
						</Text>
					</View>
				</View>

				<View style={styles.rchatsSecond}>
					<Text
						style={{
							color: whatIsTheme(COLORS.MID, COLORS.MID),
							textAlign: 'right',
						}}>{`${message.at.hour}:${message.at.min}`}</Text>
				</View>
			</View>
		</View>
	);
};

const DetailsCard = ({ message, whatIsTheme }) => {
	return (
		<View
			style={{
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical: 8,
			}}>
			<Text
				style={{
					borderRadius: 100,
					paddingHorizontal: 10,
					paddingVertical: 5,
					backgroundColor: whatIsTheme(COLORS.PRIMARY, COLORS.PRIMARY),
					color: whatIsTheme(COLORS.WHITE, COLORS.WHITE),
					opacity: 0.9,
				}}>
				{message.msg}
			</Text>
		</View>
	);
};

const DateCard = ({ message, whatIsTheme }) => {
	return (
		<View
			style={{
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical: 8,
			}}>
			<Text
				style={{
					borderRadius: 100,
					paddingHorizontal: 10,
					paddingVertical: 5,
					backgroundColor: whatIsTheme(COLORS.PRIMARY, COLORS.PRIMARY),
					color: whatIsTheme(COLORS.WHITE, COLORS.WHITE),
					opacity: 0.9,
				}}>
				{`${message.at.date} ${message.at.month} ${message.at.year}`}
			</Text>
		</View>
	);
};

class Message {
	constructor(msg, sender, type, year, month, date, hour, min, timestamp) {
		this.msg = msg;
		this.sender = sender;
		this.type = type;
		this.at = {
			year,
			month: months[month],
			date: ('0' + date).slice(-2),
			hour: ('0' + hour).slice(-2),
			min: ('0' + min).slice(-2),
			timestamp,
		};
	}
}

const ChatScreen = props => {
	// const { messages } = useSelector(state => state.messages);
	const { groupName, id } = props.route.params;

	const dispatch = useDispatch();
	const { username } = useSelector(state => state.main.user);
	const { theme } = useSelector(state => state.settings.settings);
	const { group } = useSelector(state => state.groups);
	const { messages } = useSelector(state => state.messages);

	const scrollFlatList = useRef(null);
	const isMounted = useRef(false);

	const [currGroupData, setCurrGroupData] = useState({});
	const [message, setMessage] = useState('');
	const [messageList, setMessageList] = useState([]);
	const [stickyMessages, setStickyMessages] = useState([]);
	const [buttonDisabled, setButtonDisabled] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const deleteMessage = msgId => {
		firebase.database().ref('Messages').child(id).child(msgId).remove();
	};

	const sendMessage = () => {
		if (message.length > 0) {
			const tempMessage = message;
			setMessage('');
			setButtonDisabled(true);
			const timestamp = new Date().getTime();
			firebase
				.database()
				.ref('Messages')
				.child(id)
				.child(timestamp)
				.set({
					at: timestamp,
					msg: tempMessage.trim(),
					sender: username,
					type: 'text',
				})
				.then(res => {
					// dispatch(loadGroupChats(id));
					const messageSentTone = new Sound(messageTone, (error, sound) => {
						if (error) {
							console.log('FAILED TO LAOD SOUND IN MESSAGE SENT PART', error);
							return;
						}

						messageSentTone.setVolume(1);
						messageSentTone.play();
					});
					setButtonDisabled(false);
				})
				.catch(err => {
					setButtonDisabled(false);
					ToastAndroid.show("Can't send meesages currently.", ToastAndroid.SHORT);
				});

			// firebase.database().ref('Groups').child(id).child('lastMsg').update({
			// 	at: timestamp,
			// 	msg: message,
			// 	sender: username,
			// 	type: 'text',
			// });

			// firebase.database().ref('LastMessages').child(id).update({
			// 	at: timestamp,
			// 	msg: message,
			// 	sender: username,
			// 	type: 'text',
			// });
		}
	};

	useEffect(() => {
		const msgData = messages[id];

		const tempMsg = [];
		const finalMsgList = [];
		const stickyMessageList = [];

		for (let i in msgData) {
			tempMsg.push(msgData[i]);
		}

		let time, time2;
		for (let i = 0; i < tempMsg.length; ++i) {
			time = new Date(new Number(tempMsg[i].at));
			if (i === 0) {
				finalMsgList.push(
					new Message(
						// tempMsg[i].msg,
						// tempMsg[i].sender,
						'',
						'',
						ChatTypes.DATE,
						time.getFullYear(),
						time.getMonth(),
						time.getDate(),
						time.getHours(),
						time.getMinutes(),
						time.getTime() + 's'
					),
					new Message(
						tempMsg[i].msg,
						tempMsg[i].sender,
						tempMsg[i].type,
						time.getFullYear(),
						time.getMonth(),
						time.getDate(),
						time.getHours(),
						time.getMinutes(),
						time.getTime()
					)
				);

				stickyMessageList.push(
					new Message(
						'',
						'',
						ChatTypes.DATE,
						time.getFullYear(),
						time.getMonth(),
						time.getDate(),
						time.getHours(),
						time.getMinutes(),
						time.getTime()
					)
				);
			} else {
				time2 = new Date(new Number(tempMsg[i - 1].at));

				if (time.getDate() === time2.getDate()) {
					finalMsgList.push(
						new Message(
							tempMsg[i].msg,
							tempMsg[i].sender,
							tempMsg[i].type,
							time.getFullYear(),
							time.getMonth(),
							time.getDate(),
							time.getHours(),
							time.getMinutes(),
							time.getTime()
						)
					);
				} else {
					finalMsgList.push(
						new Message(
							'',
							'',
							ChatTypes.DATE,
							time.getFullYear(),
							time.getMonth(),
							time.getDate(),
							time.getHours(),
							time.getMinutes(),
							time.getTime() + 's'
						),
						new Message(
							tempMsg[i].msg,
							tempMsg[i].sender,
							tempMsg[i].type,
							time.getFullYear(),
							time.getMonth(),
							time.getDate(),
							time.getHours(),
							time.getMinutes(),
							time.getTime()
						)
					);

					stickyMessageList.push(
						new Message(
							'',
							'',
							ChatTypes.DATE,
							time.getFullYear(),
							time.getMonth(),
							time.getDate(),
							time.getHours(),
							time.getMinutes(),
							time.getTime()
						)
					);
				}
			}
		}

		setMessageList(finalMsgList);
		setStickyMessages(stickyMessageList);
	}, [messages, id, group]);

	useEffect(() => {
		// console.log(':MESSAGES', messages);
		/**
		 * settings the current group the user is in...
		 */
		setCurrGroupData(group[id]);

		/**
		 * helpful while unmounting firebase fetch query...
		 */

		isMounted.current = true;

		/**
		 * firebase fetch query...
		 */
		firebase
			.database()
			.ref('Messages')
			.child(id)
			.limitToLast(250)
			.on('value', snap => {
				if (isMounted.current) {
					dispatch(loadGroupChats(snap.key, snap.val()));
				}
			});

		return () => (isMounted.current = false);
	}, [id]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: 'space-between',
			}}>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={groupName}
				back
				renderRightActions
				extraImageButtons={true}
				extraImage={currGroupData.image}
				onImagePress={() => {
					props.navigation.navigate('GroupDetails', {
						groupData: currGroupData,
					});
				}}
				extraImageText={'!'}
			/>

			<View style={styles.chatArea}>
				<FlatList
					data={messageList}
					keyExtractor={item => item.at.timestamp}
					renderItem={({ item, index }) => {
						if (item.type === ChatTypes.TEXT) {
							if (item.sender === username) {
								return (
									<View>
										<UserMessage
											deleteMessage={() => deleteMessage(item.at.timestamp)}
											message={item}
											whatIsTheme={whatIsTheme}
										/>
									</View>
								);
							} else {
								return (
									<View>
										<ReceivedMessage message={item} whatIsTheme={whatIsTheme} />
									</View>
								);
							}
						} else if (item.type === ChatTypes.CMD) {
							return (
								<View>
									<DetailsCard message={item} whatIsTheme={whatIsTheme} />
								</View>
							);
						} else if (item.type === ChatTypes.DATE) {
							return (
								<View>
									<DateCard message={item} whatIsTheme={whatIsTheme} />
								</View>
							);
						}
					}}
					// stickyHeaderIndices={[0, 1, 2, 3]}
					ref={scrollFlatList}
					onContentSizeChange={() =>
						scrollFlatList.current.scrollToEnd({ animated: true })
					}
				/>
			</View>

			<View style={styles.messageInputContainer}>
				{/* <View style={styles.messageInputOver}> */}
				<TextInput
					value={message}
					// onChangeText={value => {
					// 	setMessage(value.length <= 200 ? value : message);
					// }}
					onChangeText={setMessage}
					style={whatIsTheme(styles.messageInputDark, styles.messageInputLight)}
					placeholder='Type a message...'
					placeholderTextColor={COLORS.MID}
					selectionColor={COLORS.MID}
				/>
				{/* </View> */}
				<TouchableOpacity style={styles.sendButton}>
					<Icon
						type='material-icon'
						name='attach-file'
						size={24}
						// style={styles.sendButton}
						color={whatIsTheme(COLORS.BLUE_FAV, COLORS.BLUE_FAV)}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					disabled={buttonDisabled}
					style={styles.sendButton}
					onPress={sendMessage}>
					<Icon
						type='material-icon'
						name='send'
						size={24}
						color={whatIsTheme(COLORS.BLUE_FAV, COLORS.BLUE_FAV)}
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	chatArea: {
		flex: 1,
		width: '100%',
		justifyContent: 'space-between',
		// marginBottom: 10,
	},
	messageInputContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',

		paddingTop: 4,
		paddingBottom: 2,

		borderWidth: 0.5,
		borderTopColor: COLORS.DARKTEXT,
	},
	messageInputOver: {
		// borderRadius: 100,
	},
	messageInputDark: {
		flex: 1,
		fontSize: 16,
		paddingHorizontal: 15,
		borderRadius: 100,
		color: COLORS.WHITE,
		backgroundColor: COLORS.DARKPRIMARY,
		elevation: 1,
	},
	messageInputLight: {
		flex: 1,
		fontSize: 16,
		paddingHorizontal: 15,
		borderRadius: 100,
		color: COLORS.BLACK,
		backgroundColor: COLORS.FINALBEFORELIGHT,
		elevation: 1,
	},
	sendButton: {
		borderRadius: 100,
		padding: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 2,
		// backgroundColor: COLORS.MID,
	},
	sendButtonDisabled: {
		borderRadius: 100,
		padding: 3,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 2,
	},

	// Received messages...
	rchatContainer: {
		marginVertical: 2,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginHorizontal: 7,
		padding: 4,
	},
	rchats: {
		flexDirection: 'row',
	},
	rchatsFirst: {
		maxWidth: '80%',
		minWidth: 125,

		borderTopLeftRadius: 0,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	rchatsSecond: {
		flex: 1,
		justifyContent: 'center',
	},
	rusername: {
		paddingVertical: 2.5,
		paddingHorizontal: 10,
		fontFamily: 'karlaBold',
		fontSize: 15,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 10,
	},
	rmsg: {
		fontSize: 16,
		padding: 10,
	},

	// User messages...
	uchatContainer: {
		marginVertical: 2,
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		marginHorizontal: 7,
		padding: 4,
	},
	uchats: {
		flexDirection: 'row',
	},
	uchatsFirst: {
		maxWidth: '85%',
		minWidth: 125,

		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 0,
	},
	uchatsSecond: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	umsg: {
		fontSize: 16,
		color: COLORS.WHITE,
		paddingVertical: 7,
		paddingHorizontal: 10,
	},

	//to delete user chats...
	noBackRow: {
		backgroundColor: COLORS.TRANSPARENT,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	hiddenText: {
		fontWeight: '600',
		fontSize: 18,
		borderRadius: 10,
		// paddingVertical: 5,
		paddingHorizontal: 5,
		marginHorizontal: 5,
		height: '80%',
		justifyContent: 'center',
		alignItems: 'center',
		textAlignVertical: 'center',
		textAlign: 'center',
	},
});

export default ChatScreen;
