import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchDatabase } from '../../sql/SQLStarter';
import COLORS from '../../val/colors/Colors';

export function Alert(visible, header, description, primary) {
	// constructor(visible, header, description, primary) {
	this.visible = visible;
	this.header = header;
	this.description = description;
	this.primary = primary;
	// }
}

const CustomModalAlert = ({ alert, disableFunction, primaryFunction }) => {
	const { theme } = useSelector(state => state.settings.settings);

	return (
		<Modal transparent={true} visible={alert.visible}>
			<TouchableWithoutFeedback onPress={() => disableFunction(new Alert(false, '', '', ''))}>
				<View
					style={{
						backgroundColor: COLORS.SOMEWHATDARKALPHA,
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View
						style={[
							styles.inside,
							!theme ? null : theme === 'd' ? null : styles.darkLight,
						]}>
						<Text
							style={[
								styles.heading,
								!theme ? null : theme === 'd' ? null : styles.darkLight,
							]}>
							{alert.header}
						</Text>
						<Text
							style={[
								styles.description,
								!theme ? null : theme === 'd' ? null : styles.darkLight,
							]}>
							{alert.description}
						</Text>
						<View
							style={[
								styles.buttonsArea,
								!theme ? null : theme === 'd' ? null : styles.darkLight,
							]}>
							<TouchableOpacity
								onPress={() => disableFunction(new Alert(false, '', '', ''))}>
								<View style={styles.buttonView}>
									<Text
										style={[
											styles.buttonText,
											!theme
												? null
												: theme === 'd'
												? null
												: styles.buttonTextLight,
										]}>
										{alert.primary}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	inside: {
		padding: 10,
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 7,
		width: '80%',
		// flex: 1,
		// margin: 30,
		// padding: 50,
	},
	heading: {
		fontSize: 20,
		fontFamily: 'roboto',
		padding: 10,
		color: COLORS.WHITE,
	},
	description: {
		fontSize: 15,
		fontFamily: 'roboto',
		paddingTop: 5,
		paddingBottom: 10,
		paddingHorizontal: 10,
		color: COLORS.WHITE,
	},
	buttonsArea: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	buttonView: {
		padding: 10,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	buttonText: {
		fontFamily: 'roboto',
		fontSize: 16,
		color: COLORS.GREEN,
		padding: 5,
		marginHorizontal: 10,
	},

	darkLight: {
		backgroundColor: COLORS.WHITE,
		color: COLORS.DARKSECONDARY,
	},
	buttonTextLight: {
		color: COLORS.PRIMARY,
	},
});

export default CustomModalAlert;
