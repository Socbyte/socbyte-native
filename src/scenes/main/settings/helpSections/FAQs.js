import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Input, Button, Rating, AirbnbRating } from 'react-native-elements';
import { useSelector } from 'react-redux';

import Firebase from '../../../../firebase/Firebase';
import Header from '../../../../components/customs/Header/Header';
import COLORS from '../../../../val/colors/Colors';
import { ToastAndroid } from 'react-native';

export const FAQ = (props) => {
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
				headerTitle='FAQ Section'
				back
			/>

			<Text>FAQ</Text>
		</View>
	);
};

export const ContactUS = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const { username, email } = useSelector((state) => state.main.user);

	const [text, setText] = useState('');
	const [rating, setRating] = useState(6);

	const [loading, setLoading] = useState(false);
	// const [disabled, setDisabled] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const sendQuery = () => {
		setLoading(true);
		if (text.toString().length > 5) {
			const timestamp = new Date().getTime().toLocaleString();
			// console.log('STARTED SJKHKJHKJLSHDJKHGJLKA');

			Firebase.database()
				.ref('Query')
				.child(`${Firebase.auth().currentUser.uid}/` + timestamp)
				.set({
					query: text,
					rating: rating.toString(),
					username: username,
				})
				.then((res) => {
					ToastAndroid.show(
						'Thanks for sharing your experience.',
						ToastAndroid.SHORT
					);
					setLoading(false);
					setText('');
				})
				.catch((err) => {
					ToastAndroid.show(
						'Server are busy. Try again.',
						ToastAndroid.SHORT
					);
					setLoading(false);
				});
			// setLoading(false);
		} else {
			setLoading(false);
		}
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle='Contact Me'
				back
			/>

			<ScrollView>
				<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
					Contact Me:
				</Text>

				<View
					style={whatIsTheme(
						styles.inputContainerDark,
						styles.inputContainerLight
					)}
				>
					<Input
						placeholder='Write something'
						value={text}
						onChangeText={(value) => setText(value)}
						multiline
						numberOfLines={6}
						textAlignVertical='top'
						style={whatIsTheme(styles.textDark, styles.textLight)}
					/>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<Text
						style={whatIsTheme(styles.titleDark, styles.titleLight)}
					>
						Please Rate (optional):
					</Text>
					{rating ? (
						<TouchableOpacity
							onPress={() => {
								setRating(6);
								setRating(0);
							}}
						>
							<Text
								style={{
									color: COLORS.MID,
									paddingVertical: 8,
									fontSize: 16,
								}}
							>
								Clear Response
							</Text>
						</TouchableOpacity>
					) : null}
				</View>

				<View style={styles.ratingsContainer}>
					<AirbnbRating
						size={22}
						count={6}
						defaultRating={rating}
						reviews={[
							'Terrible',
							'Bad',
							'OK',
							'Good',
							'Excellent',
							'Amazing',
						]}
						onFinishRating={(rating) => setRating(rating)}
						starStyle={{
							backgroundColor: whatIsTheme(
								COLORS.DARKSECONDARY,
								COLORS.BEFORELIGHT
							),
							borderRadius: 10,
						}}
					/>
					{/* <Rating
						type='custom'
						ratingColor='#3498db'
						tintColor={whatIsTheme('#000000', '#efefef')}
						ratingBackgroundColor={COLORS.MID}
						ratingCount={6}
						startingValue={4.5}
						onFinishRating={rating => {
							setRating(rating);
							console.log(rating);
						}}
						onStartRating={rating => {
							setRating(rating);
							console.log(rating);
						}}
						style={{ paddingVertical: 10, borderRadius: 15 }}
					/> */}
				</View>

				<View style={styles.buttonContainer}>
					<Button
						title='Contact'
						loading={loading}
						disabledStyle={styles.opacityDown}
						buttonStyle={styles.updateButton}
						onPress={sendQuery}
					/>
				</View>
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
		color: COLORS.WHITE,
		fontSize: 16,
		paddingHorizontal: 15,
		paddingVertical: 8,
	},
	titleLight: {
		color: COLORS.BLACK,
		fontSize: 16,
		paddingHorizontal: 15,
		paddingVertical: 8,
	},

	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},

	inputContainerDark: {
		margin: 5,
		marginVertical: 8,
		marginHorizontal: 15,
		paddingBottom: 0,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 1,
		borderBottomRightRadius: 1,
		backgroundColor: COLORS.DARKPRIMARY,
	},
	inputContainerLight: {
		margin: 5,
		marginVertical: 8,
		marginHorizontal: 15,
		paddingBottom: 0,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 1,
		borderBottomRightRadius: 1,
		backgroundColor: COLORS.NEXTLIGHT,
	},

	buttonContainer: {
		alignItems: 'center',
		marginVertical: 15,
		marginBottom: 200,
	},
	updateButton: {
		minWidth: 150,
		minHeight: 50,
	},
	opacityDown: {
		opacity: 0.8,
	},
});
