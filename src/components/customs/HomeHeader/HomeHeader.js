import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import COLORS from '../../../val/colors/Colors';

const HomeHeader = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	return (
		<View
			style={[
				styles.header,
				{
					borderBottomColor: whatIsTheme(
						COLORS.DARKSECONDARY,
						COLORS.NEXTLIGHT
					),
				},
			]}
		>
			<View style={styles.headerMainArea}>
				<TouchableOpacity onPress={props.navigation.toggleDrawer}>
					<View style={styles.iconHolder}>
						<Icon
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							size={27}
							name='menu'
							type='community-icons'
						/>
					</View>
				</TouchableOpacity>
				<Text
					style={[
						styles.appName,
						{ color: whatIsTheme(COLORS.WHITE, COLORS.BLACK) },
					]}
				>
					Socbyte
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		height: 60,
		paddingVertical: 5,
		paddingHorizontal: 1,
		borderBottomWidth: 0.4,
	},
	headerMainArea: {
		paddingHorizontal: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconHolder: {
		height: '100%',
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	appName: {
		fontSize: 26,
		fontFamily: 'robotoBold',
		padding: 10,
		paddingHorizontal: 10,
		marginLeft: 10,
	},
});

export default HomeHeader;
