import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import COLORS from '../../val/colors/Colors';

const ModalAlert = ({
	header,
	description,
	visible,
	primary,
	secondary,
	disableFunction,
	primaryFunction,
	secondaryFuntion,
}) => {
	return (
		<Modal transparent={true} visible={visible}>
			<TouchableWithoutFeedback onPress={() => disableFunction({})}>
				<View
					style={{
						backgroundColor: COLORS.SOMEWHATDARKALPHA,
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View style={styles.inside}>
						<Text style={styles.heading}>{header}</Text>
						<Text style={styles.description}>{description}</Text>
						<View style={styles.buttonsArea}>
							{secondary ? (
								<TouchableOpacity
									onPress={() =>
										secondaryFuntion ? secondaryFuntion() : disableFunction({})
									}>
									<View style={styles.buttonView}>
										<Text style={styles.buttonText}>{secondary}</Text>
									</View>
								</TouchableOpacity>
							) : null}
							{primary ? (
								<TouchableOpacity
									onPress={() =>
										primaryFunction ? primaryFunction() : disableFunction({})
									}>
									<View style={styles.buttonView}>
										<Text style={styles.buttonText}>{primary}</Text>
									</View>
								</TouchableOpacity>
							) : (
								<TouchableOpacity onPress={() => disableFunction({})}>
									<View style={styles.buttonView}>
										<Text style={styles.buttonText}>Okay!</Text>
									</View>
								</TouchableOpacity>
							)}
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
		color: COLORS.PRIMARY,
		padding: 5,
		marginHorizontal: 10,
	},
});

export default ModalAlert;
