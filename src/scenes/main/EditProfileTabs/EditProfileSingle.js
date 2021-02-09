import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ToastAndroid } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { Caption } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { Text, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Firebase from '../../../firebase/Firebase';
import COLORS from '../../../val/colors/Colors';
import Header from '../../../components/customs/Header/Header';
import CustomModalAlert, { Alert } from '../../../components/customs/CustomModalAlert';
import { ScrollView } from 'react-native';

const UpdatedTextInput = props => {
	return (
		<TextInput
			style={props.whatIsTheme(styles.inputItselfDark, styles.inputItselfLight)}
			placeholder={props.placeholder}
			placeholderTextColor={COLORS.PLACEHOLDER}
			// multiline={true}
			underlineColorAndroid={props.whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
			value={props.value}
			keyboardType={props.keyboardType ? props.keyboardType : 'default'}
			onChangeText={value => {
				if (value.length <= props.limit) props.onChangeText(value);
			}}
		/>
	);
};

const LimitText = props => {
	return (
		<Text
			style={[
				props.context.length >= props.limit
					? styles.redText
					: props.whatIsTheme(styles.limitTextDark, styles.limitTextLight),
				styles.smallFontSize,
			]}>
			{props.context.length <= props.limit - 1 ? 'Allowed Length' : 'Length Exceeded'}:{' '}
			{props.context ? props.context.length : 0} / {props.limit}
		</Text>
	);
};

const EditProfileByPart = props => {
	const { username, status, about, social, location, expertise, education } = useSelector(
		state => state.main.user
	);
	const { theme } = useSelector(state => state.settings.settings);
	const { part, edit } = props.route.params;

	let finalExpertise = [];
	if (expertise) finalExpertise = expertise.split(',');

	// this is the final education list shown to the user
	// const finalEducation = [];
	// if (education) for (let i in education) finalEducation.push(education[i]);

	const [newStatus, setNewStatus] = useState(status);
	const [newAbout, setNewAbout] = useState(about);
	const [newLocation, setNewLocation] = useState(location);
	const [newExpertise, setNewExpertise] = useState(finalExpertise ? finalExpertise : []);
	const [addExpertise, setAddExpertise] = useState('');

	const [updatedEducation, setUpdatedEducation] = useState(education ? education : {});
	const [newEducation, setNewEducation] = useState([]);
	const [degree, setDegree] = useState('');
	const [school, setSchool] = useState('');
	const [yearFrom, setYearFrom] = useState('');
	const [yearTo, setYearTo] = useState('');

	const [alert, setAlert] = useState(new Alert(false, 'Error', 'Error', 'Okay'));
	const [disabled, setDisabled] = useState(false);

	const [github, setGithub] = useState(social.github ? social.github : '');
	const [linkedin, setLinkedin] = useState(social.linkedin ? social.linkedin : '');
	const [twitter, setTwitter] = useState(social.twitter ? social.twitter : '');
	const [facebook, setFacebook] = useState(social.facebook ? social.facebook : '');
	const [instagram, setInstagram] = useState(social.instagram ? social.instagram : '');
	const [dribbble, setDribble] = useState(social.dribble ? social.dribble : '');
	const [red, setRed] = useState(false);

	useEffect(() => {
		const tempEducation = [];
		if (updatedEducation)
			for (let i in updatedEducation) tempEducation.push(updatedEducation[i]);
		setNewEducation(tempEducation);
	}, [updatedEducation]);

	const socialEdited = () => {
		if (
			(github !== social.github ||
				linkedin !== social.linkedin ||
				twitter !== social.twitter ||
				facebook !== social.facebook ||
				instagram !== social.instagram) &&
			github.length <= 0 &&
			linkedin.length <= 0 &&
			twitter.length <= 0 &&
			facebook.length <= 0 &&
			instagram.length <= 0
		) {
			return true;
		} else {
			return false;
		}
	};

	const socialEditedLoosely = () => {
		if (
			github !== social.github ||
			linkedin !== social.linkedin ||
			twitter !== social.twitter ||
			facebook !== social.facebook ||
			instagram !== social.instagram
		) {
			if (
				github.length >= 0 ||
				linkedin.length >= 0 ||
				twitter.length >= 0 ||
				facebook.length >= 0 ||
				instagram.length >= 0
			) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	const updateStatus = () => {
		if (!edit) {
			setDisabled(true);
			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					status: '',
				})
				.then(res => {
					setDisabled(false);
					// setAlert(
					// 	new Alert(
					// 		true,
					// 		'Status Removed',
					// 		'Your status is removed from permanently successfully.',
					// 		'Fine'
					// 	)
					// );
					ToastAndroid.showWithGravity(
						'Your status is removed from permanently successfully.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else if (newStatus !== status) {
			setDisabled(true);
			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					status: edit ? newStatus : '',
				})
				.then(res => {
					setDisabled(false);
					// setAlert(
					// 	new Alert(
					// 		true,
					// 		'Status Updated',
					// 		'Your new status is updated successfully.',
					// 		'Fine'
					// 	)
					// );
					ToastAndroid.showWithGravity(
						'Your new status is updated successfully.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else {
			setAlert(
				new Alert(
					true,
					'No Update Found',
					'Please edit the status to update and store that in database.',
					'Okay'
				)
			);
		}
	};

	const updateAbout = () => {
		if (!edit) {
			setDisabled(true);
			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					about: '',
				})
				.then(res => {
					setDisabled(false);
					// setAlert(
					// 	new Alert(
					// 		true,
					// 		'About Removed',
					// 		'Your about section has been successfully.',
					// 		'Fine'
					// 	)
					// );
					ToastAndroid.showWithGravity(
						'Your about section has been successfully.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else if (newAbout.length >= 100) {
			if (newAbout !== about) {
				setDisabled(true);
				Firebase.database()
					.ref('Users')
					.child(Firebase.auth().currentUser.uid)
					.update({
						about: edit ? newAbout : '',
					})
					.then(res => {
						setDisabled(false);
						// setAlert(
						// 	new Alert(
						// 		true,
						// 		'About Updated',
						// 		'Your new about section is updated successfully.',
						// 		'Fine'
						// 	)
						// );
						ToastAndroid.showWithGravity(
							'Your new about section is updated successfully.',
							ToastAndroid.LONG,
							ToastAndroid.CENTER
						);
						props.navigation.goBack();
					})
					.catch(err => {
						setDisabled(false);
					});
			} else {
				setAlert(
					new Alert(
						true,
						'No Update Found',
						'Please edit the about to update and store that in database.',
						'Okay'
					)
				);
			}
		} else {
			setAlert(
				new Alert(
					true,
					'Minimum Requirements',
					'Your about section must contain at least 100 chatacters, if you want to add about yourself.',
					'Okay'
				)
			);
		}
	};

	const updateLocation = () => {
		if (!edit) {
			setDisabled(true);
			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					location: '',
				})
				.then(res => {
					setDisabled(false);
					// setAlert(
					// 	new Alert(
					// 		true,
					// 		'Location Removed',
					// 		'Your location data has been successfully.',
					// 		'Fine'
					// 	)
					// );
					ToastAndroid.showWithGravity(
						'Your location data has been successfully.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else {
			if (newLocation !== location) {
				setDisabled(true);
				Firebase.database()
					.ref('Users')
					.child(Firebase.auth().currentUser.uid)
					.update({
						location: edit ? newLocation : '',
					})
					.then(res => {
						setDisabled(false);
						// setAlert(
						// 	new Alert(
						// 		true,
						// 		'Location Updated',
						// 		'Your new location is updated successfully.',
						// 		'Fine'
						// 	)
						// );
						ToastAndroid.showWithGravity(
							'Your new location is updated successfully.',
							ToastAndroid.LONG,
							ToastAndroid.CENTER
						);
						props.navigation.goBack();
					})
					.catch(err => {
						setDisabled(false);
					});
			} else {
				setAlert(
					new Alert(
						true,
						'No Update Found',
						'Please edit your location to update and store that in database.',
						'Okay'
					)
				);
			}
		}
	};

	const updateSocialLinks = () => {
		if (socialEditedLoosely()) {
			setDisabled(true);
			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					social: {
						github: github,
						instagram: instagram,
						facebook: facebook,
						twitter: twitter,
						linkedin: linkedin,
						dribbble: dribbble,
					},
				})
				.then(res => {
					setDisabled(false);
					// setAlert(
					// 	new Alert(
					// 		true,
					// 		'Social Updated',
					// 		'Your social media link has been successfully updated.',
					// 		'Fine'
					// 	)
					// );
					ToastAndroid.showWithGravity(
						'Your social media link has been successfully updated.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else {
			setAlert(
				new Alert(
					true,
					'No Update Found',
					'Please edit the links currently. please try again',
					'Okay'
				)
			);
		}
	};

	const removeExpertiseItem = item => {
		const tempExpertise = newExpertise.filter(i => i !== item);

		if (tempExpertise.length < 1) {
			setAlert(
				new Alert(
					true,
					'Are You Sure?',
					'Atleast One expertise is required if you want to provide. Or you can go back.',
					'Fine'
				)
			);
			return;
		}

		setNewExpertise(tempExpertise);
		ToastAndroid.show(`${item} removed from expertise list`, ToastAndroid.SHORT);
	};

	const addExpertiseItem = () => {
		if (!addExpertise || addExpertise.length <= 0) return;

		for (let i in newExpertise) {
			if (addExpertise.toLowerCase() === newExpertise[i].toLowerCase()) {
				console.log('RETURN');
				return;
			}
		}

		const tempExpertise = newExpertise;
		tempExpertise.push(addExpertise);

		if (tempExpertise.length > 50) {
			setAlert(
				new Alert(
					true,
					'Maximum Limit Crossed',
					'Maximum limit for number of expertises is 50.',
					'Fine'
				)
			);
			return;
		}

		setNewExpertise(tempExpertise);
		ToastAndroid.show(`${addExpertise} added to expertise list`, ToastAndroid.SHORT);
		setAddExpertise('');
	};

	const updateExpertiseList = () => {
		if (newExpertise !== finalExpertise) {
			setDisabled(true);
			const length = newExpertise.length;
			let updatedExpertise = '';
			for (let i = 0; i < length; ++i) {
				if (i !== length - 1) updatedExpertise += `${newExpertise[i]},`;
				else updatedExpertise += `${newExpertise[i]}`;
			}

			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					expertise: updatedExpertise,
				})
				.then(res => {
					setDisabled(false);
					ToastAndroid.showWithGravity(
						'Your expertise list has been updated successfully.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else {
			setAlert(
				new Alert(
					true,
					'No Update Found',
					'Please edit the expertise list to update and store that in database.',
					'Okay'
				)
			);
		}
	};

	const removeEducationItem = item => {
		let currItem = 0;
		Object.keys(updatedEducation).map(it => {
			if (
				updatedEducation[it].degree === item.degree &&
				updatedEducation[it].school === item.school &&
				updatedEducation[it].yearFrom === item.yearFrom &&
				updatedEducation[it].yearTo === item.yearTo
			) {
				currItem = it;
			}
		});
		const tempEducation = {
			...updatedEducation,
		};
		delete tempEducation[currItem];
		setUpdatedEducation(tempEducation);
		// const tempEducation = Object.keys(updatedEducation).filter(i => {
		// 	// console.log(updatedEducation[i].degree, item.degree);
		// 	// console.log(
		// 	// 	updatedEducation[i].degree !== item.degree &&
		// 	// 		updatedEducation[i].school !== item.school &&
		// 	// 		updatedEducation[i].yearFrom !== item.yearFrom &&
		// 	// 		updatedEducation[i].yearTo !== item.yearTo
		// 	// );
		// 	return (
		// 		updatedEducation[i].degree !== item.degree &&
		// 		updatedEducation[i].school !== item.school &&
		// 		updatedEducation[i].yearFrom !== item.yearFrom &&
		// 		updatedEducation[i].yearTo !== item.yearTo
		// 	);
		// });

		// Object.keys(tempEducation).map(it => {
		// 	console.log(tempEducation[it].degree);
		// });

		// setUpdatedEducation(tempEducation);
		// console.log(tempEducation[currItem]);

		// if (tempEducation.length < 1) {
		// 	setAlert(
		// 		new Alert(
		// 			true,
		// 			'Are You Sure?',
		// 			'Atleast One education is required if you want to provide. Or you can go back.',
		// 			'Fine'
		// 		)
		// 	);
		// 	return;
		// }

		// setNewEducation(tempEducation);
		// ToastAndroid.show(`${item} removed from expertise list`, ToastAndroid.SHORT);
	};

	const addEducationItem = () => {
		if (!degree || degree.length <= 0) return;
		if (!school || school.length <= 0) return;
		if (!yearFrom || yearFrom.length <= 0) return;

		// const yearF = new Number(yearFrom);
		// const yearT = new Number(yearTo);
		// if (yearF < 1980) {
		// 	ToastAndroid.show('Minimum joined year must be 1980.');
		// 	return;
		// } else if ((yearTo && yearF > yearT) || yearF > new Date().getFullYear()) {
		// 	ToastAndroid.show('Please enter valid years.');
		// 	return;
		// }
		//
		//
		//
		//

		let toContinueAddinItem = true;
		Object.keys(updatedEducation).map(item => {
			if (updatedEducation[item].degree.toLowerCase() === degree.toLowerCase()) {
				toContinueAddinItem = false;
			}
		});
		if (!toContinueAddinItem) {
			return;
		}

		const currEducationItem = {
			degree: degree,
			school: school,
			yearFrom: yearFrom,
			yearTo: yearTo || yearTo.length > 0 ? yearTo : 'Present',
		};
		const timestamp = new Date().getTime();
		const educationToAdd = {
			[`edu${timestamp}`]: { ...currEducationItem },
		};

		const tempEducation = {
			...updatedEducation,
			...educationToAdd,
		};

		setUpdatedEducation(tempEducation);
		console.log(tempEducation);

		setDegree('');
		setSchool('');
		setYearFrom('');
		setYearTo('');

		//
		//
		//
		//
		//
		// if (tempEducation.length > 10) {
		// 	setAlert(
		// 		new Alert(
		// 			true,
		// 			'Maximum Limit Crossed',
		// 			'Maximum limit for number of expertises is 10.',
		// 			'Fine'
		// 		)
		// 	);
		// 	return;
		// }

		// setNewExpertise(tempEducation);
		// ToastAndroid.show(`new education added to your education list`, ToastAndroid.SHORT);
	};

	const updateEducationList = () => {
		if (updatedEducation !== education) {
			setDisabled(true);

			Firebase.database()
				.ref('Users')
				.child(Firebase.auth().currentUser.uid)
				.update({
					education: updatedEducation,
				})
				.then(res => {
					setDisabled(false);
					ToastAndroid.showWithGravity(
						'Your education list has been updated successfully.',
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					props.navigation.goBack();
				})
				.catch(err => {
					setDisabled(false);
				});
		} else {
			setAlert(
				new Alert(
					true,
					'No Update Found',
					'Please edit the education list to update and store that in database.',
					'Okay'
				)
			);
		}
	};

	useEffect(() => {
		setRed(socialEdited());
		// if (
		// 	(github !== social.github ||
		// 		linkedin !== social.linkedin ||
		// 		twitter !== social.twitter ||
		// 		facebook !== social.facebook ||
		// 		instagram !== social.instagram) &&
		// 	github.length <= 0 &&
		// 	linkedin.length <= 0 &&
		// 	twitter.length <= 0 &&
		// 	facebook.length <= 0 &&
		// 	instagram.length <= 0
		// ) {
		// 	setRed(true);
		// } else {
		// 	setRed(false);
		// }
	}, [github, linkedin, facebook, instagram, twitter]);

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
				back
				headerTitle={
					part === 'status'
						? 'New Status'
						: part === 'status'
						? 'Update About Yourself'
						: 'Update Profile'
				}
			/>

			<CustomModalAlert disableFunction={setAlert} alert={alert} />

			<ScrollView>
				<View style={styles.mainArea}>
					{part === 'status' ? (
						<View style={styles.mainAreaStarting}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								{edit ? 'Enter New Status' : 'Remove Status'}
							</Text>

							<View style={styles.input}>
								<TextInput
									style={whatIsTheme(
										styles.inputItselfDark,
										styles.inputItselfLight
									)}
									placeholder='Status'
									multiline={true}
									placeholderTextColor={COLORS.PLACEHOLDER}
									underlineColorAndroid={whatIsTheme(
										COLORS.GREEN,
										COLORS.PRIMARY
									)}
									value={newStatus}
									onChangeText={value => {
										if (value.length <= 100) setNewStatus(value);
									}}
								/>
							</View>

							<Text
								style={
									newStatus.length >= 100
										? styles.redText
										: whatIsTheme(styles.limitTextDark, styles.limitTextLight)
								}>
								{newStatus.length <= 99 ? 'Allowed Length' : 'Length Exceeded'}:{' '}
								{newStatus ? newStatus.length : 0} / 100
							</Text>

							<Button
								disabled={disabled}
								onPress={updateStatus}
								style={
									!edit
										? styles.deleteButton
										: whatIsTheme(styles.darkButton, styles.lightButton)
								}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{edit ? 'Update Status' : 'Remove Status'}
							</Button>

							{!edit ? (
								<Text style={styles.redText}>
									Note: Your status will be removed permanently.
								</Text>
							) : null}
						</View>
					) : part === 'about' ? (
						<View style={styles.mainAreaStarting}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								{edit ? 'Enter About Yourself' : 'Remove About'}
							</Text>

							<View style={styles.input}>
								<TextInput
									style={whatIsTheme(
										styles.inputItselfDark,
										styles.inputItselfLight
									)}
									placeholder='About Yourself'
									placeholderTextColor={COLORS.PLACEHOLDER}
									multiline={true}
									underlineColorAndroid={whatIsTheme(
										COLORS.GREEN,
										COLORS.PRIMARY
									)}
									value={newAbout}
									onChangeText={value => {
										if (value.length <= 500) setNewAbout(value);
									}}
								/>
							</View>

							<Text
								style={
									newAbout.length >= 500
										? styles.redText
										: whatIsTheme(styles.limitTextDark, styles.limitTextLight)
								}>
								{newAbout.length <= 499 ? 'Allowed Length' : 'Length Exceeded'}:{' '}
								<Text
									style={
										newAbout.length >= 100
											? whatIsTheme(styles.greenColor, styles.primaryColor)
											: styles.normalColor
									}>
									{newAbout ? newAbout.length : 0}
								</Text>
								{' / 500'}
							</Text>

							<Button
								disabled={disabled}
								onPress={updateAbout}
								style={
									!edit
										? styles.deleteButton
										: whatIsTheme(styles.darkButton, styles.lightButton)
								}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{edit ? 'Update About' : 'Remove About'}
							</Button>

							{!edit ? (
								<Text style={styles.redText}>
									Note: Your about section will be removed permanently.
								</Text>
							) : null}
						</View>
					) : part === 'location' ? (
						<View style={styles.mainAreaStarting}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								{edit ? 'Enter New Location' : 'Remove Location'}
							</Text>

							<View style={styles.input}>
								<TextInput
									style={whatIsTheme(
										styles.inputItselfDark,
										styles.inputItselfLight
									)}
									placeholder='Location'
									multiline={true}
									placeholderTextColor={COLORS.PLACEHOLDER}
									underlineColorAndroid={whatIsTheme(
										COLORS.GREEN,
										COLORS.PRIMARY
									)}
									value={newLocation}
									onChangeText={value => {
										if (value.length <= 100) setNewLocation(value);
									}}
								/>
							</View>

							<Text
								style={
									newLocation.length >= 100
										? styles.redText
										: whatIsTheme(styles.limitTextDark, styles.limitTextLight)
								}>
								{newLocation.length <= 99 ? 'Allowed Length' : 'Length Exceeded'}:{' '}
								{newLocation ? newLocation.length : 0} / 100
							</Text>

							<Button
								disabled={disabled}
								onPress={updateLocation}
								style={
									!edit
										? styles.deleteButton
										: whatIsTheme(styles.darkButton, styles.lightButton)
								}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{edit ? 'Update Status' : 'Remove Status'}
							</Button>

							{!edit ? (
								<Text style={styles.redText}>
									Note: Your location will be removed permanently.
								</Text>
							) : null}
						</View>
					) : part === 'expertise' ? (
						<View style={styles.mainAreaStarting}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								{'Update you expertises'}
							</Text>

							<View style={styles.input}>
								<TextInput
									style={whatIsTheme(
										styles.inputItselfDark,
										styles.inputItselfLight
									)}
									placeholder='Add New Expertise'
									placeholderTextColor={COLORS.PLACEHOLDER}
									underlineColorAndroid={whatIsTheme(
										COLORS.GREEN,
										COLORS.PRIMARY
									)}
									value={addExpertise}
									onChangeText={value => {
										if (value.length <= 20) {
											if (value.includes(',') || value.includes(' ')) return;
											setAddExpertise(value);
										}
									}}
								/>
							</View>

							<Button
								disabled={!addExpertise || addExpertise.length <= 0}
								onPress={addExpertiseItem}
								style={whatIsTheme(styles.darkButton, styles.lightButton)}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{'Add'}
							</Button>

							{newExpertise.map(item => {
								return (
									<View
										style={whatIsTheme(
											styles.expertiseCardDark,
											styles.expertiseCardLight
										)}>
										<Text
											style={whatIsTheme(
												styles.expertiseTextDark,
												styles.expertiseTextLight
											)}>
											{item}
										</Text>
										<Entypo
											name='cross'
											onPress={() => removeExpertiseItem(item)}
											size={25}
											color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}
										/>
									</View>
								);
							})}

							<Button
								disabled={
									disabled === true ? disabled : newExpertise === finalExpertise
								}
								onPress={updateExpertiseList}
								style={whatIsTheme(styles.darkButton, styles.lightButton)}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{'Update'}
							</Button>
						</View>
					) : part === 'edu' ? (
						<View style={styles.mainAreaStarting}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								{'Update you educations'}
							</Text>

							<View style={styles.input}>
								<UpdatedTextInput
									whatIsTheme={whatIsTheme}
									placeholder='Add New Degree'
									value={degree}
									limit={20}
									onChangeText={setDegree}
								/>
							</View>
							<View style={styles.input}>
								<UpdatedTextInput
									whatIsTheme={whatIsTheme}
									placeholder='Add institute where you got degree'
									value={school}
									limit={60}
									onChangeText={setSchool}
								/>
							</View>
							<View style={styles.input}>
								<UpdatedTextInput
									whatIsTheme={whatIsTheme}
									placeholder='Starting year'
									value={yearFrom}
									limit={4}
									keyboardType='number-pad'
									onChangeText={setYearFrom}
								/>
							</View>
							<View style={styles.input}>
								<UpdatedTextInput
									whatIsTheme={whatIsTheme}
									placeholder='End year'
									value={yearTo}
									limit={4}
									keyboardType='number-pad'
									onChangeText={setYearTo}
								/>
								<Text
									style={whatIsTheme(
										styles.limitTextDark,
										styles.limitTextLight
									)}>
									{'Leave Empty if you are currently studying here'}
								</Text>
							</View>

							<Button
								disabled={
									degree.length <= 0 || school.length <= 0 || yearFrom.length <= 0
								}
								onPress={addEducationItem}
								style={whatIsTheme(styles.darkButton, styles.lightButton)}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{'Add'}
							</Button>

							<View styles={styles.educationHolder}>
								{newEducation.map((item, _) => {
									return (
										<View
											key={_}
											style={whatIsTheme(
												styles.educationSectionCardDark,
												styles.educationSectionCardLight
											)}>
											<View style={styles.rowButSpaceBetween}>
												<Text
													style={[
														whatIsTheme(
															styles.educationBoldTextDark,
															styles.educationBoldTextLight
														),
														whatIsTheme(
															styles.font16Dark,
															styles.font16Light
														),
													]}>
													{item.degree}
												</Text>

												<Entypo
													name='cross'
													onPress={() => removeEducationItem(item)}
													size={25}
													color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
												/>
											</View>
											<Text
												style={whatIsTheme(
													styles.educationBoldTextDark,
													styles.educationBoldTextLight
												)}>
												{item.school}
											</Text>
											<Caption
												style={whatIsTheme(
													styles.educationRegularTextDark,
													styles.educationRegularTextLight
												)}>
												{`${item.yearFrom} - ${item.yearTo}`}
											</Caption>
										</View>
									);
								})}
							</View>

							<Button
								disabled={
									disabled === true ? disabled : updatedEducation === education
								}
								onPress={updateEducationList}
								style={
									newEducation.length <= 0
										? styles.deleteButton
										: whatIsTheme(styles.darkButton, styles.lightButton)
								}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{newEducation.length <= 0 ? 'Remove' : 'Update'}
							</Button>
						</View>
					) : part === 'social' ? (
						<View style={styles.mainAreaStarting}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								Edit Your Social Media Profiles
							</Text>

							<View style={styles.oneHolder}>
								<View style={styles.input}>
									<View style={styles.row}>
										<SocialIcon type='github' disabled raised />
										<LimitText
											context={github}
											limit={100}
											whatIsTheme={whatIsTheme}
										/>
									</View>

									<UpdatedTextInput
										placeholder='GitHub Profile'
										whatIsTheme={whatIsTheme}
										limit={100}
										onChangeText={setGithub}
										value={github}
									/>
								</View>

								<View style={styles.input}>
									<View style={styles.row}>
										<SocialIcon type='linkedin' disabled raised />
										<LimitText
											context={linkedin}
											limit={100}
											whatIsTheme={whatIsTheme}
										/>
									</View>
									<UpdatedTextInput
										placeholder='Linkedin Profile'
										whatIsTheme={whatIsTheme}
										limit={100}
										onChangeText={setLinkedin}
										value={linkedin}
									/>
								</View>

								<View style={styles.input}>
									<View style={styles.row}>
										<SocialIcon type='twitter' disabled raised />
										<LimitText
											context={twitter}
											limit={100}
											whatIsTheme={whatIsTheme}
										/>
									</View>
									<UpdatedTextInput
										placeholder='Twitter Profile'
										whatIsTheme={whatIsTheme}
										limit={100}
										onChangeText={setTwitter}
										value={twitter}
									/>
								</View>

								<View style={styles.input}>
									<View style={styles.row}>
										<SocialIcon type='facebook' disabled raised />
										<LimitText
											context={facebook}
											limit={100}
											whatIsTheme={whatIsTheme}
										/>
									</View>
									<UpdatedTextInput
										placeholder='Facebook Profile'
										whatIsTheme={whatIsTheme}
										limit={100}
										onChangeText={setFacebook}
										value={facebook}
									/>
								</View>

								<View style={styles.input}>
									<View style={styles.row}>
										<SocialIcon type='instagram' disabled raised />
										<LimitText
											context={instagram}
											limit={100}
											whatIsTheme={whatIsTheme}
										/>
									</View>
									<UpdatedTextInput
										placeholder='Instagram Profile'
										whatIsTheme={whatIsTheme}
										limit={100}
										onChangeText={setInstagram}
										value={instagram}
									/>
								</View>
							</View>

							<Button
								disabled={disabled}
								onPress={updateSocialLinks}
								style={
									red
										? styles.deleteButton
										: whatIsTheme(styles.darkButton, styles.lightButton)
								}
								color={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}>
								{red ? 'Remove' : 'Update'}
							</Button>

							<Text
								style={[
									whatIsTheme(styles.greenColor, styles.primaryColor),
									styles.centerText,
									styles.lastElement,
								]}>
								{
									'Note: \nPlease paste/provide the correct links to these profile. If the link exceed the limit then please provide a shorted link.'
								}
							</Text>
						</View>
					) : null}
				</View>
				<View style={styles.lastElement}></View>
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

	mainAreaStarting: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	oneHolder: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	shortHeaderDark: {
		color: COLORS.WHITE,
		fontSize: 16,
		paddingVertical: 6,
		paddingHorizontal: 5,
		textDecorationLine: 'underline',
	},
	shortHeaderLight: {
		color: COLORS.BLACK,
		fontSize: 16,
		paddingVertical: 6,
		paddingHorizontal: 5,
		textDecorationLine: 'underline',
	},

	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rowButSpaceBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	titleDark: {
		color: COLORS.GREEN,
		fontSize: 22,
		fontFamily: 'Inter',
		marginVertical: 10,
		padding: 5,
	},
	titleLight: {
		color: COLORS.PRIMARY,
		fontSize: 22,
		fontFamily: 'Inter',
		marginVertical: 10,
		padding: 5,
	},

	input: {
		margin: 10,
		fontFamily: 'karla',
		paddingHorizontal: 8,
		borderColor: '#909090',
		borderWidth: 1,
		borderRadius: 5,
		elevation: 1,
		width: '90%',
	},

	inputItselfDark: {
		color: COLORS.TEXT,
		fontSize: 15,
		paddingVertical: 8,
		paddingHorizontal: 5,
	},
	inputItselfLight: {
		color: COLORS.DARKTEXT,
		fontSize: 15,
		paddingVertical: 8,
		paddingHorizontal: 5,
	},

	redText: {
		color: COLORS.RED,
		textAlign: 'left',
	},
	limitTextDark: {
		color: COLORS.GREEN,
		textAlign: 'left',
	},
	limitTextLight: {
		color: COLORS.PRIMARY,
		textAlign: 'left',
	},
	greenColor: {
		color: COLORS.GREEN,
	},
	primaryColor: {
		color: COLORS.PRIMARY,
	},
	normalColor: {
		color: COLORS.MID,
	},
	centerText: {
		textAlign: 'center',
	},
	smallFontSize: {
		fontSize: 12,
	},

	expertiseCardDark: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		width: '90%',
		marginVertical: 5,
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: COLORS.GREEN,
	},
	expertiseCardLight: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		width: '90%',
		marginVertical: 5,
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: COLORS.PRIMARY,
	},
	expertiseTextDark: {
		fontSize: 16,
		fontFamily: 'Inter',
		paddingVertical: 5,
		color: COLORS.BLACK,
	},
	expertiseTextLight: {
		fontSize: 16,
		fontFamily: 'Inter',
		paddingVertical: 5,
		color: COLORS.WHITE,
	},

	deleteButton: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginVertical: 25,
		backgroundColor: COLORS.RED,
		color: COLORS.WHITE,
		elevation: 5,
	},
	darkButton: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginVertical: 25,
		backgroundColor: COLORS.GREEN,
		color: COLORS.BLACK,
		elevation: 5,
	},
	lightButton: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		marginVertical: 25,
		backgroundColor: COLORS.PRIMARY,
		color: COLORS.WHITE,
		elevation: 5,
	},

	lastElement: {
		paddingBottom: 150,
		paddingHorizontal: 10,
	},

	educationSectionCardDark: {
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 5,
		paddingVertical: 8,
		paddingHorizontal: 5,
		marginVertical: 5,
		marginHorizontal: 2,
		elevation: 1,
	},
	educationSectionCardLight: {
		backgroundColor: COLORS.BEFORELIGHT,
		borderRadius: 5,
		paddingVertical: 8,
		paddingHorizontal: 5,
		marginVertical: 5,
		marginHorizontal: 2,
		elevation: 1,
	},

	educationBoldTextDark: {
		color: COLORS.WHITE,
		fontSize: 15,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},
	educationBoldTextLight: {
		color: COLORS.DARKSECONDARY,
		fontSize: 15,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},

	font16Dark: {
		fontSize: 16,
		color: COLORS.GREEN,
	},
	font16Light: {
		fontSize: 16,
		color: COLORS.PRIMARY,
	},

	educationRegularTextDark: {
		color: COLORS.MID,
		fontSize: 13,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},
	educationRegularTextLight: {
		color: COLORS.MID,
		fontSize: 13,
		paddingVertical: 1,
		paddingHorizontal: 4,
	},
});

export default EditProfileByPart;

// social:
// dribbble:
// "https://dribbble.com/sobhanbera"
// facebook:
// "https://www.facebook.com/sobhan.b.90/"
// github:
// "https://github.com/SobhanBera"
// instagram:
// "https://www.instagram.com/sobhanbera_/"
// linkedin:
// "https://www.linkedin.com/in/sobhanbera/"
// twitter:
// "https://twitter.com/BeraSobhan"

// [C++,Java,Javascript,Python,ReactJS,HTML,CSS,SASS,LESS,Competitive_Programming]
