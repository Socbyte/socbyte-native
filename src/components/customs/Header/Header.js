import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	TouchableRipple,
	Avatar,
	Caption,
	Title,
	Text,
	ProgressBar,
	Paragraph,
	Banner,
	Menu,
	Button,
	IconButton,
	Card,
	Switch,
	Searchbar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import COLORS from '../../../val/colors/Colors';

const Header = fprops => {
	const { theme } = useSelector(state => state.settings.settings);

	return (
		<Card style={[styles.card, { backgroundColor: theme === 'd' ? COLORS.NEXTTODARK : COLORS.WHITE }]}>
			<View style={styles.content}>
				<Card.Title
					title={fprops.headerTitle}
					titleStyle={{
						color: theme === 'd' ? COLORS.BEFORELIGHT : COLORS.DARKSECONDARY,
					}}
					left={props =>
						fprops.back ? (
							<IconButton
								style={{
									margin: 0,
								}}
								onPress={() => {
									fprops.navigation.goBack();
								}}
								// onPress={() => fprops.leftButton()}
								icon={() => (
									<Ionicons name='arrow-back-sharp' color={theme === 'd' ? COLORS.BEFORELIGHT : COLORS.DARKSECONDARY} size={26} />
								)}
							/>
						) : (
							<IconButton
								style={{
									margin: 0,
								}}
								onPress={() => {
									fprops.navigation.toggleDrawer();
								}}
								// onPress={() => fprops.leftButton()}
								icon={() => <Ionicons name='menu' color={theme === 'd' ? COLORS.BEFORELIGHT : COLORS.DARKSECONDARY} size={26} />}
							/>
						)
					}
					right={props =>
						fprops.includeRight ? (
							<IconButton
								onPress={fprops.leftButton}
								icon={() => (
									<Ionicons name={fprops.rightButton} color={theme === 'd' ? COLORS.BEFORELIGHT : COLORS.DARKSECONDARY} size={20} />
								)}
							/>
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
	},
	content: {
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
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
});

export default Header;
