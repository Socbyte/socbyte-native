import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchDatabase } from '../../sql/SQLStarter';
import COLORS from '../../val/colors/Colors';

const ModalAlert = ({ header, description, visible, primary, secondary, disableFunction, primaryFunction, secondaryFuntion }) => {
	const [theme, setTheme] = useState();

	useEffect(() => {
		fetchDatabase()
			.then(res => {
				const settings = JSON.parse(JSON.stringify(res.rows._array));
				for (let i in settings) if (settings[i].key === 'theme') setTheme(settings[i].value);
			})
			.catch(err => {
				setTheme(false);
			});
	}, []);

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
					<View style={[styles.inside, !theme ? null : theme === 'd' ? null : styles.darkLight]}>
						<Text style={[styles.heading, !theme ? null : theme === 'd' ? null : styles.darkLight]}>{header}</Text>
						<Text style={[styles.description, !theme ? null : theme === 'd' ? null : styles.darkLight]}>{description}</Text>
						<View style={[styles.buttonsArea, !theme ? null : theme === 'd' ? null : styles.darkLight]}>
							{secondary ? (
								<TouchableOpacity onPress={() => (secondaryFuntion ? secondaryFuntion() : disableFunction({}))}>
									<View style={styles.buttonView}>
										<Text style={[styles.buttonText, !theme ? null : theme === 'd' ? null : styles.buttonTextLight]}>
											{secondary}
										</Text>
									</View>
								</TouchableOpacity>
							) : null}
							{primary ? (
								<TouchableOpacity onPress={() => (primaryFunction ? primaryFunction() : disableFunction({}))}>
									<View style={styles.buttonView}>
										<Text style={[styles.buttonText, !theme ? null : theme === 'd' ? null : styles.buttonTextLight]}>
											{primary}
										</Text>
									</View>
								</TouchableOpacity>
							) : (
								<TouchableOpacity onPress={() => disableFunction({})}>
									<View style={styles.buttonView}>
										<Text style={[styles.buttonText, !theme ? null : theme === 'd' ? null : styles.buttonTextLight]}>Okay!</Text>
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

export default ModalAlert;
