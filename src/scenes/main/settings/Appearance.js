import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Text,
	Switch,
	Title,
	Caption,
	TouchableRipple,
} from 'react-native-paper';
import { BottomSheet, CheckBox, List, ListItem } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../../components/customs/Header/Header';
import { updateDatabase } from '../../../sql/SQLStarter';
import { updateSettings } from '../../../store/Settings';
import COLORS from '../../../val/colors/Colors';
import { ToastAndroid } from 'react-native';
import ThemeToggler from '../../../scenes/main/animations/ThemeToggler';

const AppearanceSetting = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const dispatch = useDispatch();

	const [showThemeChanger, setShowThemeChanger] = useState(false);
	const [showFontChooser, setShowFontChooser] = useState(false);
	const [themeAnim, setThemeAnimation] = useState(false);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const setFontSize = (size) => {
		// console.log(size);
		setShowFontChooser(false);
		ToastAndroid.show(
			'This feature is in development. May come in later versions.',
			ToastAndroid.LONG
		);
	};

	const toggleTheme = (toggledTheme) => {
		// console.log('TOGGLE THE CURRENT THEME...');
		// const toggledTheme = whatIsTheme('l', 'd');

		if (toggledTheme !== theme) {
			setThemeAnimation(true);
			updateDatabase('theme', toggledTheme)
				.then((result) => {
					dispatch(updateSettings('theme', toggledTheme));
					setShowThemeChanger(false);
					// setThemeAnimation(false);
				})
				.catch((err) => {
					// console.log('ERROR WHILE UPDATING DATABASE FROM PROFILE SECTION');
					// console.log(err);

					setShowThemeChanger(false);
					// setThemeAnimation(false);
					ToastAndroid.show(
						'Cannot change theme currently. Sorry for your inconvenience.',
						ToastAndroid.SHORT
					);
				});
		} else {
			setShowThemeChanger(false);
			// setThemeAnimation(false);
		}
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

			{themeAnim ? (
				<ThemeToggler theme={theme} setValueFalse={setThemeAnimation} />
			) : null}

			<TouchableRipple
				onPress={() => setShowThemeChanger(true)}
				rippleColor={whatIsTheme(COLORS.DARKGLOW, COLORS.DARKFORLIGHT)}
			>
				<View
					style={[
						whatIsTheme(
							styles.settingCardDark,
							styles.settingCardLight
						),
						{
							borderBottomColor: whatIsTheme(
								COLORS.DARKSECONDARY,
								COLORS.DARKFORLIGHT
							),
							borderBottomWidth: 1,
						},
					]}
				>
					<View style={styles.leftSideOfCard}>
						<Title
							style={whatIsTheme(
								styles.titleDark,
								styles.titleLight
							)}
						>
							Toggle Theme
						</Title>
						<Caption
							style={whatIsTheme(
								styles.captiondark,
								styles.captionlight
							)}
						>
							{whatIsTheme('Dark Theme', 'Light Theme')}
						</Caption>
					</View>

					{/* <View style={styles.rightSideOfCard}>
						<CheckBox
							center
							checkedColor={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
							uncheckedColor={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							checked={whatIsTheme(true, false)}
							onPress={toggleTheme}
						/>
					</View> */}

					<BottomSheet
						modalProps={{
							style: {
								backgroundColor: COLORS.TRANSPARENT,
							},
						}}
						isVisible={showThemeChanger}
						containerStyle={{
							backgroundColor: whatIsTheme(
								`${COLORS.DARKPRIMARY}6f`,
								`${COLORS.DARKFORLIGHT}6f`
							),
						}}
					>
						<ListItem
							onPress={() => {
								toggleTheme('d');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Dark Theme
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								toggleTheme('l');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Light Theme
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setShowThemeChanger(false);
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.BLACK,
									COLORS.BEFORELIGHT
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title style={styles.cancelButton}>
									Cancel
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</BottomSheet>
				</View>
			</TouchableRipple>

			<TouchableRipple
				onPress={() => setShowFontChooser(true)}
				rippleColor={whatIsTheme(COLORS.DARKGLOW, COLORS.DARKFORLIGHT)}
			>
				<View
					style={[
						whatIsTheme(
							styles.settingCardDark,
							styles.settingCardLight
						),
						{
							borderBottomColor: whatIsTheme(
								COLORS.DARKSECONDARY,
								COLORS.DARKFORLIGHT
							),
							borderBottomWidth: 1,
						},
					]}
				>
					<View style={styles.leftSideOfCard}>
						<Title
							style={whatIsTheme(
								styles.titleDark,
								styles.titleLight
							)}
						>
							Font Size
						</Title>
						<Caption
							style={whatIsTheme(
								styles.captiondark,
								styles.captionlight
							)}
						>
							Regular
						</Caption>
					</View>

					<BottomSheet
						modalProps={{
							style: {
								backgroundColor: COLORS.TRANSPARENT,
							},
						}}
						isVisible={showFontChooser}
						containerStyle={{
							backgroundColor: whatIsTheme(
								COLORS.DARKSECONDARY,
								COLORS.DARKFORLIGHT
							),
						}}
					>
						<ListItem
							onPress={() => {
								setFontSize('vs');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Very Small
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setFontSize('s');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Small
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setFontSize('r');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Regular
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setFontSize('l');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Large
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setFontSize('vl');
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.WHITE
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}
								>
									Very Large
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>

						<ListItem
							onPress={() => {
								setShowFontChooser(false);
							}}
							containerStyle={{
								backgroundColor: whatIsTheme(
									COLORS.BLACK,
									COLORS.BEFORELIGHT
								),
							}}
						>
							<ListItem.Content>
								<ListItem.Title style={styles.cancelButton}>
									Cancel
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</BottomSheet>
				</View>
			</TouchableRipple>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	settingCardDark: {
		backgroundColor: COLORS.TRANSPARENT,
		paddingVertical: 5,
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	settingCardLight: {
		backgroundColor: COLORS.TRANSPARENT,
		paddingVertical: 5,
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	leftSideOfCard: {
		flexDirection: 'column',
		paddingHorizontal: 5,
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	rightSideOfCard: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleDark: {
		fontSize: 18,
		paddingBottom: 0,
		color: COLORS.WHITE,
	},
	titleLight: {
		fontSize: 18,
		paddingBottom: 0,
		color: COLORS.BLACK,
	},
	captiondark: {
		fontSize: 15,
		paddingLeft: 3,
		color: COLORS.MID,
		fontFamily: 'Inter',
	},
	captionlight: {
		fontSize: 15,
		paddingLeft: 3,
		color: COLORS.MID,
		fontFamily: 'Inter',
	},
	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},
	cancelButton: {
		textAlign: 'center',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		color: COLORS.RED,
	},
});

export default AppearanceSetting;
