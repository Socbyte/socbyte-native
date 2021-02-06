import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { IconButton, Card, TouchableRipple, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import COLORS, { ISDARKCOLOR } from '../../../val/colors/Colors';

const Header = ({
	headerTitle,
	back,
	navigation,
	renderRightActions,
	absolute,
	backgroundColor,
	realBackgroundColor,
	extraButtons,
	extraImageButtons = null,
	onImagePress,
	extraImage,
	extraImageText,
}) => {
	const imageValidator = /(https?:\/\/.*\.(?:png|jpg))/i;
	const { theme } = useSelector(state => state.settings.settings);

	//for group details screen currently to animate the image...

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	return (
		<Card
			style={[
				styles.card,
				absolute ? styles.zIndex : null,
				{
					backgroundColor: backgroundColor
						? backgroundColor
						: whatIsTheme(COLORS.TRANSPARENT, COLORS.TRANSPARENT),
				},
				whatIsTheme(styles.borderBottomDark, styles.borderBottomLight),
			]}>
			<View
				style={[
					styles.content,
					realBackgroundColor ? { backgroundColor: realBackgroundColor } : null,
				]}>
				<Card.Title
					title={headerTitle}
					titleStyle={{
						color: backgroundColor
							? ISDARKCOLOR.colorIsLight(backgroundColor)
								? COLORS.BLACK
								: COLORS.WHITE
							: whatIsTheme(COLORS.BEFORELIGHT, COLORS.DARKSECONDARY),
					}}
					titleNumberOfLines={1}
					left={props =>
						back ? (
							// <IconButton
							// 	style={{
							// 		margin: 0,
							// 	}}
							// 	onPress={() => {
							// 		navigation.goBack();
							// 	}}
							// 	icon={() => (
							// 		<Ionicons
							// 			name='arrow-back-sharp'
							// 			color={
							// 				backgroundColor
							// 					? ISDARKCOLOR.colorIsLight(backgroundColor)
							// 						? COLORS.BLACK
							// 						: COLORS.WHITE
							// 					: theme === 'd'
							// 					? COLORS.BEFORELIGHT
							// 					: COLORS.DARKSECONDARY
							// 			}
							// 			size={26}
							// 		/>
							// 	)}
							// />

							<Icon
								onPress={() => {
									navigation.goBack();
								}}
								iconStyle={styles.listIcon}
								// name='return-up-back-outline'
								name='keyboard-backspace'
								type='material-community-icons'
								size={24}
								color={
									backgroundColor
										? ISDARKCOLOR.colorIsLight(backgroundColor)
											? COLORS.BLACK
											: COLORS.WHITE
										: whatIsTheme(COLORS.BEFORELIGHT, COLORS.DARKSECONDARY)
								}
							/>
						) : (
							<IconButton
								style={{
									margin: 0,
								}}
								onPress={() => {
									navigation.toggleDrawer();
								}}
								icon={() => (
									<Ionicons
										name='menu'
										color={
											backgroundColor
												? ISDARKCOLOR.colorIsLight(backgroundColor)
													? COLORS.BLACK
													: COLORS.WHITE
												: whatIsTheme(
														COLORS.BEFORELIGHT,
														COLORS.DARKSECONDARY
												  )
										}
										size={24}
									/>
								)}
							/>
						)
					}
					right={() =>
						renderRightActions ? (
							<View
								style={{
									paddingVertical: 8,
									paddingHorizontal: 10,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								{extraButtons
									? extraButtons.map(item => {
											return (
												<Icon
													name={item.name}
													type={item.type}
													size={item.size}
													onPress={item.onPress}
													color={
														item.color
															? item.color
															: whatIsTheme(
																	COLORS.WHITE,
																	COLORS.BLACK
															  )
													}
													iconStyle={{
														paddingHorizontal: 6,
													}}
												/>
											);
									  })
									: null}

								{extraImageButtons == true ? (
									<TouchableRipple
										rippleColor={COLORS.TRANSPARENT}
										onPress={onImagePress}>
										{extraImage && extraImage.match(imageValidator) ? (
											<Avatar.Image
												size={40}
												source={{
													uri: extraImage,
												}}
												style={{
													borderRadius: 100,
													borderWidth: 1,
													borderColor: COLORS.MID,
													marginHorizontal: 6,
													backgroundColor: whatIsTheme(
														COLORS.DARKSECONDARY,
														COLORS.FINALBEFORELIGHT
													),
												}}
											/>
										) : (
											<Avatar.Text
												size={40}
												label={extraImageText}
												style={{
													borderRadius: 100,
													borderWidth: 1,
													borderColor: COLORS.MID,
													backgroundColor: whatIsTheme(
														COLORS.DARKSECONDARY,
														COLORS.FINALBEFORELIGHT
													),
													marginHorizontal: 6,
												}}
											/>
										)}
									</TouchableRipple>
								) : null}

								{/* {renderRightActions} */}
							</View>
						) : null
					}
				/>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		width: '100%',
		height: 50,
		// justifyContent: 'space-between',
		// alignItems: 'center',
		borderRadius: 0,
		elevation: 1,
		borderBottomColor: COLORS.MID,
		borderBottomWidth: 0,
		borderColor: COLORS.TRANSPARENT,
	},
	borderBottomDark: {
		borderBottomColor: COLORS.DARKPRIMARY,
		borderBottomWidth: 1,
	},
	borderBottomLight: {
		borderBottomColor: COLORS.TRANSPARENT,
		borderBottomWidth: 1,
	},
	content: {
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	listIcon: {
		// marginLeft: 0,
		// padding: 0,
		// margin: 0,
	},
	headerTitle: {},
	firstSection: {
		flexDirection: 'row',
		width: '70%',
		padding: 0,
		margin: 0,
	},
	right: {
		marginRight: 10,
	},
	zIndex: {
		zIndex: 5,
		backgroundColor: COLORS.TRANSPARENT,
	},
});

export default Header;
