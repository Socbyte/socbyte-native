import React, { memo, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Image,
	TextInput,
	ToastAndroid,
	ScrollView,
	FlatList,
} from 'react-native';
import { Icon, ListItem, Text } from 'react-native-elements';
import { Avatar, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import md5 from 'md5';

import firebase from '../../../firebase/Firebase';
import COLORS from '../../../val/colors/Colors';

const ProfileSearch = props => {
	const { username } = useSelector(state => state.main.user);
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [searchText, setSearchText] = useState('');
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [searchLimit, setSearchLimit] = useState(10);
	const [error, setError] = useState({ error: '', msg: '' });
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		return () => {
			setError({ error: '', msg: '' });
			setSearchText('');
			setSearchedUsers([]);
			setSearchLimit(10);
		};
	}, []);

	const searchUser = () => {
		setSearchText(searchText.trim());
		let curLength = searchedUsers.length;
		if (searchText.trim().length >= 8) {
			firebase
				.database()
				.ref('Accounts')
				.orderByChild('username')
				.startAt(`${searchText.trim()}`)
				.endAt(searchText.trim() + '\uf8ff')
				.limitToFirst(searchLimit)
				.once('value')
				.then(snap => {
					setError({ error: '', msg: '' });
					let list = [];
					for (let i in snap.val()) {
						if (snap.val()[i].username === username) continue;
						list.push(snap.val()[i]);
					}
					setSearchedUsers(list);
					if (curLength !== list.length) setShowButton(true);
					else setShowButton(false);
					if (list.length < searchLimit) setShowButton(false);
				})
				.catch(err => {
					setError({
						error: 'Error while fetching users list',
						msg: 'Something went wrong. Please try again.',
					});
					console.log('ERR', err);
					setShowButton(false);
				});
		} else if (searchText.length <= 0) {
			if (searchedUsers.length) return;
			setError({
				error: 'Search For An User',
				msg: 'no user searched, username should contain at least 8 character.',
			});
			setShowButton(false);
		} else {
			ToastAndroid.showWithGravity(
				'User Not Found!',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
			setError({
				error: 'User Not Found',
				msg:
					"User with the following username not found. User's account be deleted, banned or disabled permanently",
			});
			setShowButton(false);
		}
	};

	const renderUserListItems = item => {
		return (
			<ListItem
				key={item.uid + item.username}
				onPress={() => {
					props.navigation.navigate('ShowSearchedUserProfile', {
						uid: item.uid,
						usernameText: item.username,
					});
				}}
				bottomDivider
				underlayColor={whatIsTheme(COLORS.DARKPRIMARY, COLORS.BEFORELIGHT)}
				containerStyle={{
					backgroundColor: COLORS.TRANSPARENT,
					borderBottomColor: whatIsTheme(COLORS.NEXTTODARK, COLORS.BEFORELIGHT),
					borderBottomWidth: 1,
					paddingVertical: 10,
				}}>
				<Avatar.Image
					size={48}
					source={{
						uri: `https://www.gravatar.com/avatar/${md5(item.email)}.jpg?s=200`,
					}}
					style={{
						borderRadius: 100,
						backgroundColor: COLORS.TRANSPARENT,
						borderWidth: 1,
						borderColor: whatIsTheme(COLORS.DARKPRIMARY, COLORS.FINALBEFORELIGHT),
					}}
				/>
				<ListItem.Content>
					<ListItem.Title style={whatIsTheme(styles.textDark, styles.textLight)}>
						{item.fullname}
					</ListItem.Title>
					<ListItem.Subtitle style={{ color: COLORS.MID }}>
						{item.username}
					</ListItem.Subtitle>
				</ListItem.Content>
			</ListItem>
		);
	};

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					borderBottomWidth: 1,
					borderBottomColor: COLORS.MID,
					height: 50,
					backgroundColor: COLORS.BLACK,
				}}>
				<View style={styles.iconContainer}>
					<Icon
						onPress={() => {
							props.navigation.goBack();
						}}
						iconStyle={styles.listIcon}
						name='keyboard-backspace'
						type='material-community-icons'
						size={26}
						color={COLORS.WHITE}
					/>
				</View>
				<TextInput
					style={[
						{
							fontSize: 17,
							flex: 1,
							color: COLORS.WHITE,
						},
					]}
					onSubmitEditing={() => searchUser(searchText)}
					autoFocus
					focusable
					keyboardAppearance={whatIsTheme('dark', 'light')}
					returnKeyLabel='ss'
					returnKeyType='search'
					maxLength={100}
					value={searchText}
					onChangeText={value => setSearchText(value.toLowerCase())}
					placeholder='Search Song...'
					placeholderTextColor={COLORS.MID}
				/>
				<View style={styles.iconContainer}>
					<Icon
						onPress={() => {
							setSearchText('');
						}}
						iconStyle={styles.listIcon}
						name='cancel'
						type='material-community-icons'
						size={26}
						color={COLORS.WHITE}
					/>
				</View>
			</View>
			{/* error found */}
			<ScrollView>
				{error.error.length > 0 ? (
					<View style={styles.errorArea}>
						<Text style={whatIsTheme(styles.errorTextDark, styles.errorTextLight)}>
							{error.error}
						</Text>
						<Text
							style={whatIsTheme(styles.errorMsgTextDark, styles.errorMsgTextLight)}>
							{error.msg}
						</Text>
					</View>
				) : searchedUsers.length ? (
					searchedUsers.map(user => renderUserListItems(user))
				) : (
					<View style={styles.errorArea}>
						<Text style={whatIsTheme(styles.errorTextDark, styles.errorTextLight)}>
							Search For An User
						</Text>
						<Text
							style={whatIsTheme(styles.errorMsgTextDark, styles.errorMsgTextLight)}>
							no user searched, username should contain at least 8 character.
						</Text>
					</View>
				)}

				<View style={styles.loadMoreButtomContainer}>
					{showButton ? (
						<Button
							color={COLORS.BLUE_FAV}
							onPress={() => {
								setSearchLimit(searchLimit + 5);
								searchUser();
							}}>
							Load More...
						</Button>
					) : null}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	listIcon: {
		paddingHorizontal: 10,
		paddingVertical: 10,
	},

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

	userDataContainer: {
		paddingHorizontal: 5,
	},

	userImageContainer: {
		borderRadius: 100,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	userImage: {
		width: 60,
		height: 60,
	},
	loadMoreButtomContainer: {
		alignItems: 'center',
		marginVertical: 50,
		marginBottom: 90,
	},

	textDark: {
		color: COLORS.BEFORELIGHT,
	},
	textLight: {
		color: COLORS.DARKPRIMARY,
	},
});

export default ProfileSearch;
