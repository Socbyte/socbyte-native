import React, { useEffect, useRef, useState } from 'react';
import {
	StyleSheet,
	Dimensions,
	View,
	ScrollView,
	Animated,
	TouchableWithoutFeedback,
	Keyboard,
	FlatList,
} from 'react-native';
import { Icon, Badge, Button, Theme, ListItem } from 'react-native-elements';
import { Text, Searchbar, DarkTheme, DefaultTheme, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ImageExists from 'image-exists';

import Header from '../../../../components/customs/Header/Header';
import COLORS from '../../../../val/colors/Colors';
import { loadGroupsData, loadGroupsLastMessage } from '../../../../store/GroupsStore';
import firebase from '../../../../firebase/Firebase';

const MainChat = props => {
	const imageValidator = /(https?:\/\/.*\.(?:png|jpg|gif))/i;
	const dispatch = useDispatch();
	const { theme } = useSelector(state => state.settings.settings);
	const { username, groups } = useSelector(state => state.main.user);
	const { group } = useSelector(state => state.groups);

	const [show, setshow] = useState(false);
	const [searchText, setSearchText] = useState('');

	const [value, setValue] = useState('');

	const [groupsList, setGroupsList] = useState([]);
	const [lastMsgList, setLastMsgList] = useState([]);

	const searchbarHideValue = useRef(new Animated.Value(Dimensions.get('window').width)).current;
	const hiddenViewHieght = useRef(new Animated.Value(0)).current;

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const toggleSearchBar = () => {
		if (show) {
			setshow(false);
			Animated.sequence([
				Animated.timing(searchbarHideValue, {
					toValue: Dimensions.get('window').width,
					duration: 350,
					useNativeDriver: false,
				}),
				Animated.timing(hiddenViewHieght, {
					toValue: 0,
					duration: 350,
					useNativeDriver: false,
				}),
			]).start();
		} else {
			setshow(true);
			Animated.sequence([
				Animated.timing(hiddenViewHieght, {
					toValue: 50,
					duration: 350,
					useNativeDriver: false,
				}),
				Animated.timing(searchbarHideValue, {
					toValue: 0,
					duration: 350,
					useNativeDriver: false,
				}),
			]).start();
		}
	};

	useEffect(() => {
		const tempGroups = [];
		for (let i in groups) {
			setValue(i);
			tempGroups.push(groups[i]);
		}

		dispatch(loadGroupsData(tempGroups));
		// dispatch(loadGroupsLastMessage(tempGroups));
	}, [groups]);

	useEffect(() => {
		const tempGroup = [];
		for (let i in group) {
			// console.log(group[i]);
			if (group[i].name !== undefined && group[i] !== null) tempGroup.push(group[i]);
		}
		setGroupsList(tempGroup);
	}, [group]);

	// useEffect(() => {
	// firebase
	// 	.database()
	// 	.ref('Users')
	// 	.orderByChild('username')
	// 	.startAt('%sobhan%')
	// 	.limitToFirst(5)
	//  .endAt('sobhan' + '\uf8ff')
	// 	.once('value')
	// 	.then(snap => {
	// 		console.log('AAAA', snap.val());
	// 	});
	// }, []);

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View>
				<Header
					{...props}
					leftButton={() => {
						props.navigation.toggleDrawer();
					}}
					renderRightActions
					headerTitle='Chats'
					extraButtons={[
						{
							name: 'plus',
							type: 'ant-design',
							size: 24,
							onPress: () => {
								props.navigation.navigate('CreateChattingGroup');
							},
						},
						{
							name: 'search',
							type: 'material-icon',
							size: 24,
							onPress: toggleSearchBar,
						},
					]}
				/>

				<Searchbar
					theme={whatIsTheme(DarkTheme, DefaultTheme)}
					style={{
						backgroundColor: whatIsTheme(COLORS.NEXTTODARK, COLORS.LIGHTBACKGROUND),
						transform: [
							{
								translateX: searchbarHideValue,
								// translateX: !show ? Dimensions.get('window').width : 0,
							},
						],
						height: hiddenViewHieght,
						borderRadius: 0,
					}}
					value={searchText}
					icon={() => (
						<Icon
							onPress={toggleSearchBar}
							iconStyle={styles.listIcon}
							// name='return-up-back-outline'
							name='keyboard-backspace'
							type='material-community-icons'
							size={26}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					)}
					onChangeText={setSearchText}
					clearIcon={() => {
						return (
							<Icon
								name='clear'
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
								type='material-icons'
								size={24}
							/>
						);
					}}
					placeholder='Search User...'
				/>

				{groupsList.length > 0 && groupsList ? (
					<FlatList
						data={groupsList}
						keyExtractor={item => item.id}
						renderItem={({ item, index }) => {
							let valid = false;
							if (item.image) {
								valid = item.image.match(imageValidator);
							}
							let lastMsgTime = null;
							if (item.lastMsg) {
								lastMsgTime = new Date(new Number(item.lastMsg.at));
							}
							// console.log(item.lastMsg.at);

							return (
								<ListItem
									key={item.id ? item.id : 'group' + index}
									underlayColor={whatIsTheme(
										COLORS.DARKPRIMARY,
										COLORS.BEFORELIGHT
									)}
									onPress={() => {
										props.navigation.navigate('Chattings', {
											id: item.id,
											groupName: item.name,
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
									}}>
									{item.image && valid ? (
										<Avatar.Image
											size={48}
											source={{
												uri: item.image,
											}}
											style={{
												borderRadius: 100,
												backgroundColor: COLORS.TRANSPARENT,
												borderWidth: 1,
												borderColor: whatIsTheme(
													COLORS.DARKPRIMARY,
													COLORS.FINALBEFORELIGHT
												),
											}}
										/>
									) : (
										<Avatar.Text
											size={48}
											label={
												item.name.length
													? item.name.charAt(0).toUpperCase()
													: 'SG'
											}
											style={{
												borderRadius: 100,
												backgroundColor: whatIsTheme(
													COLORS.DARKPRIMARY,
													COLORS.FINALBEFORELIGHT
												),
											}}
										/>
									)}
									<ListItem.Content>
										<ListItem.Title
											style={whatIsTheme(styles.textDark, styles.textLight)}>
											{item.name}
										</ListItem.Title>
										<ListItem.Subtitle style={{ color: COLORS.MID }}>
											{item.lastMsg
												? `${item.lastMsg.sender}: ${
														item.lastMsg.msg.length > 20
															? item.lastMsg.msg.substring(0, 20)
															: item.lastMsg.msg
												  }`
												: 'Loading...'}
										</ListItem.Subtitle>
									</ListItem.Content>
									<View>
										<ListItem.Content
											style={{
												justifyContent: 'flex-end',
												alignItems: 'flex-end',
											}}>
											<ListItem.Subtitle style={{ color: COLORS.MID }}>
												{`${
													lastMsgTime
														? ('0' + lastMsgTime.getHours()).slice(-2)
														: ''
												}:${
													lastMsgTime
														? ('0' + lastMsgTime.getMinutes()).slice(-2)
														: ''
												}`}
											</ListItem.Subtitle>
										</ListItem.Content>
									</View>
								</ListItem>
							);
						}}
					/>
				) : groups ? (
					<View style={styles.screen}>
						<Text style={whatIsTheme(styles.notTextDark, styles.notTextLight)}>
							You Haven't Joined any group Yet.
						</Text>
						<Text style={whatIsTheme(styles.notTextDark, styles.notTextLight)}>
							Create One Or Search for existing Groups.
						</Text>
					</View>
				) : (
					<View style={styles.screen}>
						<Text style={whatIsTheme(styles.notTextDark, styles.notTextLight)}>
							Loading...
						</Text>
					</View>
				)}
				{/* <Button title='Tap' onPress={togg} /> */}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	screen: {
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 300,
	},

	notTextDark: {
		fontSize: 17,
		color: COLORS.GREEN,
		textAlign: 'center',
		padding: 10,
	},
	notTextLight: {
		fontSize: 17,
		color: COLORS.PRIMARY,
		textAlign: 'center',
		padding: 10,
	},
	textDark: {
		color: COLORS.BEFORELIGHT,
	},
	textLight: {
		color: COLORS.DARKPRIMARY,
	},
});

export default MainChat;
