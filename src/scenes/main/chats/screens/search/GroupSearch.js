import React, { useEffect, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	TextInput,
	ToastAndroid,
	View,
} from 'react-native';
import { Icon, ListItem, Text } from 'react-native-elements';
import { Avatar, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '../../../../../components/customs/Header/Header';
import firebase from '../../../../../firebase/Firebase';
import COLORS from '../../../../../val/colors/Colors';

const GroupSearch = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [searchText, setSearchText] = useState('');
	const [searchedGroups, setSearchedGroup] = useState([]);
	const [searchLimit, setSearchLimit] = useState(5);
	const [error, setError] = useState({ error: '', msg: '' });
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		return () => {
			// setError({ error: '', msg: '' });
			// setSearchText('');
			// setSearchedGroup([]);
			// setSearchLimit(10);
		};
	}, []);

	const searchGroup = () => {
		setSearchText(searchText.trim());
		let curLength = searchedGroups.length;
		if (searchText.trim().length >= 3) {
			firebase
				.database()
				.ref('Groups')
				.orderByChild('searchTerm')
				.startAt(`${searchText.trim()}`)
				.endAt(searchText.trim() + '\uf8ff')
				.limitToFirst(searchLimit)
				.once('value')
				.then((snap) => {
					setError({ error: '', msg: '' });
					let list = [];
					for (let i in snap.val()) list.push(snap.val()[i]);
					setSearchedGroup(list);
					if (curLength !== list.length) setShowButton(true);
					else setShowButton(false);
					if (list.length < searchLimit) setShowButton(false);
					// console.log(list);
				})
				.catch((err) => {
					setError({
						error: 'Error while fetching users list',
						msg: 'Something went wrong. Please try again.',
					});
					console.log('ERR', err);
					setShowButton(false);
				});
		} else if (searchText.length <= 0) {
			if (searchedGroups.length) return;
			setError({
				error: 'Search For A Group',
				msg:
					'no user searched, group name should contain at least 8 character.',
			});
			setShowButton(false);
		} else {
			ToastAndroid.showWithGravity(
				'User Not Found!',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
			setError({
				error: 'Group Not Found',
				msg: 'No group exists with this name.',
			});
			setShowButton(false);
		}
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
				}}
			>
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
					onSubmitEditing={() => searchGroup(searchText)}
					autoFocus
					focusable
					keyboardAppearance={whatIsTheme('dark', 'light')}
					returnKeyLabel='ss'
					returnKeyType='search'
					maxLength={100}
					value={searchText}
					onChangeText={setSearchText}
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

			<ScrollView>
				{error.error.length > 0 ? (
					<View style={styles.errorArea}>
						<Text
							style={whatIsTheme(
								styles.errorTextDark,
								styles.errorTextLight
							)}
						>
							{error.error}
						</Text>
						<Text
							style={whatIsTheme(
								styles.errorMsgTextDark,
								styles.errorMsgTextLight
							)}
						>
							{error.msg}
						</Text>
					</View>
				) : searchedGroups.length >= 1 ? (
					searchedGroups.map((item) => {
						console.log(item.id);
						return (
							<ListItem
								key={item.id + item.by}
								onPress={() => {
									props.navigation.navigate(
										'ShowGroupDetails',
										{
											groupId: item.id,
											groupData: item,
										}
									);
								}}
								bottomDivider
								underlayColor={whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.BEFORELIGHT
								)}
								containerStyle={{
									backgroundColor: COLORS.TRANSPARENT,
									borderBottomColor: whatIsTheme(
										COLORS.NEXTTODARK,
										COLORS.BEFORELIGHT
									),
									borderBottomWidth: 1,
									paddingVertical: 10,
								}}
							>
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
								<ListItem.Content>
									<ListItem.Title
										style={whatIsTheme(
											styles.textDark,
											styles.textLight
										)}
									>
										{item.name}
									</ListItem.Title>
									<ListItem.Subtitle
										style={{ color: COLORS.MID }}
									>
										By: {item.by}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						);
					})
				) : (
					<View style={styles.errorArea}>
						<Text
							style={whatIsTheme(
								styles.errorTextDark,
								styles.errorTextLight
							)}
						>
							Search For A Group
						</Text>
						<Text
							style={whatIsTheme(
								styles.errorMsgTextDark,
								styles.errorMsgTextLight
							)}
						>
							no user searched, group name should contain at least
							8 character.
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
							}}
						>
							Load More...
						</Button>
					) : null}
				</View>

				<View style={{ paddingBottom: 90 }} />
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

export default GroupSearch;
