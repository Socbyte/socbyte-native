import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ToastAndroid } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '../../../../components/customs/Header/Header';
import COLORS from '../../../../val/colors/Colors';
import IDGenerator from '../../../../val/ids/IDGenerator';
import { ChatTypes } from '../../../../val/constants/Constants';
import firebase from '../../../../firebase/Firebase';

const CreateChattingGroup = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const { uid, email, displayName } = useSelector(state => state.main.currentUser);

	const [groupName, setGroupName] = useState('College Projects');
	const [groupDescription, setGroupDescription] = useState('');
	const [groupImage, setGroupImage] = useState('');

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const createNewGroup = () => {
		if (groupName.length <= 0) {
			ToastAndroid.show('Please enter a valid group name', ToastAndroid.SHORT);
			return;
		} else if (groupImage.length >= 20) {
			if (!groupImage.match(/\.(jpg|png)$/)) {
				ToastAndroid.show(
					'Only png and jpg image extensions (formats) are supported, via links.',
					ToastAndroid.SHORT
				);
				return;
			}
		} else {
			/**
			 * All tests passed
			 * create new group now...
			 * TODO - error handling while storing that data in Users as well as Messages reference
			 * but since while storing new group detail if it succeed then the others should be same too.
			 */
			if (displayName && displayName.length >= 0) {
				const { id, timestamp } = IDGenerator.generate();

				firebase
					.database()
					.ref('Groups')
					.child(id)
					.set({
						id,
						name: groupName,
						desc: '',
						image: groupImage,
						by: displayName,
						at: timestamp,
						admin: {
							uid: uid,
							username: displayName,
							email: email,
						},
						cadmins: {},
						members: {
							[uid]: {
								uid: uid,
								username: displayName,
								email: email,
								admin: {
									[0]: true,
									[1]: false,
								},
							},
						},
					})
					.then(res => {
						ToastAndroid.show('new group created successfully', ToastAndroid.SHORT);

						const timestamps = new Date().getTime();

						firebase
							.database()
							.ref('Users')
							.child(uid)
							.child('groups')
							.update({
								[id]: {
									id,
									name: groupName,
								},
							})
							.then(res => {
								firebase
									.database()
									.ref('Messages')
									.child(id)
									.update({
										[timestamps]: {
											msg: `${displayName} created group "${groupName}".`,
											sender: 'socbyte',
											at: timestamps,
											type: ChatTypes.CMD,
										},
									})
									.then(res => {
										props.navigation.goBack();
									});
							});

						// firebase
						// 	.database()
						// 	.ref('LastMessages')
						// 	.child(id)
						// 	.update({
						// 		msg: `${displayName} created group "${groupName}".`,
						// 		sender: '',
						// 		at: timestamps,
						// 		type: ChatTypes.CMD,
						// 	})
						// 	.then(res => {

						// });
					})
					.catch(err => {
						console.log('ERROR WHILE CREATING NEW GROUP.', err);
						ToastAndroid.showWithGravity(
							'Cannot create new group. Sorry for your inconvenience. Please contact the developer if this occurs repeatedly.',
							ToastAndroid.LONG,
							ToastAndroid.CENTER
						);
					});
			} else {
				ToastAndroid.show(
					'Cannot load user data currently. Join existing groups. Or try again',
					ToastAndroid.LONG
				);
			}

			/**
			 * @detail
			 * @extraIfCondition
			 * @deprecated currently
			 * this below code should be between if conditions if we also accept desctiption while creating group
			 */
			// else if (groupDescription.length > 0) {
			// 	if (groupDescription.length < 10 || groupDescription.length > 150) {
			// 		ToastAndroid.show(
			// 			'Please enter a valid group desciption of length 10-150 characters',
			// 			ToastAndroid.SHORT
			// 		);
			// 		return;
			// 	}
			// }
		}
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle='Create New Group'
				back
			/>
			<ScrollView>
				<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
					Enter Group Details
				</Text>

				<Input
					placeholder='Group Name'
					inputStyle={whatIsTheme(styles.textDark, styles.textLight)}
					returnKeyType='next'
					autoFocus
					value={groupName}
					onChangeText={setGroupName}
				/>

				{/* 
				<Input
					value={groupDescription}
					onChangeText={setGroupDescription}
					placeholder='Group Description (optional)'
					multiline
					numberOfLines={2}
					textAlignVertical='top'
					inputStyle={whatIsTheme(styles.textDark, styles.textLight)}
				/> */}

				<Input
					value={groupImage}
					onChangeText={setGroupImage}
					placeholder='Group Image Link (optional)'
					inputStyle={whatIsTheme(styles.textDark, styles.textLight)}
				/>

				<View style={styles.buttonContainer}>
					<Button
						onPress={createNewGroup}
						buttonStyle={styles.submitButton}
						title='Create Group'
					/>
				</View>
				<View style={styles.lastElement} />
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
	titleDark: {
		fontSize: 18,
		width: '100%',
		textAlign: 'center',
		marginVertical: 10,
		color: COLORS.WHITE,
	},
	titleLight: {
		fontSize: 18,
		width: '100%',
		textAlign: 'center',
		marginVertical: 10,
		color: COLORS.BLACK,
	},
	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},
	buttonContainer: {
		alignItems: 'center',
		marginVertical: 15,
	},
	submitButton: {
		minWidth: 136,
		minHeight: 45,
	},
	lastElement: {
		paddingBottom: 200,
		// backgroundColor: COLORS.RED,
	},
});

export default CreateChattingGroup;

// Firebase.database()
// 			.ref('Users')
// 			.orderByChild('username')
// 			.equalTo('sobhanbera')
// 			.on('value', function (snap) {
// 			});
