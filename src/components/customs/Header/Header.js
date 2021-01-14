import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import { ListItem, Avatar, Icon } from 'react-native-elements';
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
}) => {
	const { theme } = useSelector(state => state.settings.settings);

	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	return (
		<Card
			style={[
				styles.card,
				absolute ? styles.absolute : null,
				{
					backgroundColor: backgroundColor
						? backgroundColor
						: theme === 'd'
						? COLORS.TRANSPARENT
						: COLORS.TRANSPARENT,
				},
				whatIsTheme(styles.borderBottomDark, styles.borderBottomLight),
			]}>
			<View style={styles.content}>
				<Card.Title
					title={headerTitle}
					titleStyle={{
						color: backgroundColor
							? ISDARKCOLOR.colorIsLight(backgroundColor)
								? COLORS.BLACK
								: COLORS.WHITE
							: theme === 'd'
							? COLORS.BEFORELIGHT
							: COLORS.DARKSECONDARY,
					}}
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
								size={26}
								color={
									backgroundColor
										? ISDARKCOLOR.colorIsLight(backgroundColor)
											? COLORS.BLACK
											: COLORS.WHITE
										: theme === 'd'
										? COLORS.BEFORELIGHT
										: COLORS.DARKSECONDARY
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
												: theme === 'd'
												? COLORS.BEFORELIGHT
												: COLORS.DARKSECONDARY
										}
										size={26}
									/>
								)}
							/>
						)
					}
					right={renderRightActions ? renderRightActions : null}
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
	absolute: {
		zIndex: 5,
		backgroundColor: COLORS.TRANSPARENT,
	},
});

export default Header;
