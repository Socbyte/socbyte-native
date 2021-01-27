import md5 from 'md5';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, ScrollView, Image } from 'react-native';
import { Avatar, Paragraph, Text, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Avatar as ElementAvatar } from 'react-native-elements';

import Header from '../../../../components/customs/Header/Header';
import COLORS from '../../../../val/colors/Colors';

const IMAGE_HEIGHT = 350;

const GroupDetailsScreen = props => {
	const scrollerVal = useRef(new Animated.Value(0)).current;

	const { groupData } = props.route.params;
	const { desc, image, name, at, by, admin, members } = groupData;
	const creationTime = new Date(new Number(at));
	const [adminImage, setImage] = useState('');
	const [membersList, setMembersList] = useState([]);

	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	useEffect(() => {
		const tempMembersList = [];
		for (var i in members) {
			tempMembersList.push(members[i]);
		}
		setMembersList(tempMembersList);
		// console.log('LIST', tempMembersList);

		// console.log(groupData);

		const emailHash = md5(admin.email);
		fetch(`https://www.gravatar.com/${emailHash}.json`)
			.then(res => res.json())
			.then(res => {
				if (JSON.stringify(res).includes('User not found')) {
					setImage('');
				} else {
					setImage(`https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`);
				}
			})
			.catch(err => {
				console.log('THIS ERROR OCCURED WHILE LOADING GRAVATAR', err);
			});
	}, []);

	const MembersCard = ({ member }) => {
		const [image, setImage] = useState('');

		useEffect(() => {
			const emailHash = md5(member.email);
			fetch(`https://www.gravatar.com/${emailHash}.json`)
				.then(res => res.json())
				.then(res => {
					if (JSON.stringify(res).includes('User not found')) {
						setImage('');
					} else {
						setImage(`https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`);
					}
				})
				.catch(err => {
					console.log('THIS ERROR OCCURED WHILE LOADING GRAVATAR', err);
				});
		}, []);

		return (
			<>
				{image ? (
					<ElementAvatar
						source={{ uri: image }}
						size={42}
						avatarStyle={whatIsTheme(styles.avatarDark, styles.avatarLight)}
					/>
				) : (
					<Avatar.Text
						style={[
							whatIsTheme(styles.avatarDark, styles.avatarLight),
							whatIsTheme(
								{
									borderWidth: 1,
									borderColor: COLORS.GREEN,
								},
								{
									borderWidth: 1,
									borderColor: COLORS.PRIMARY,
								}
							),
						]}
						labelStyle={whatIsTheme(styles.avatarLabelDark, styles.avatarLabelLight)}
						label={member.username ? member.username[0].toUpperCase() : ''}
					/>
				)}
				<Text style={whatIsTheme(styles.userCardTextDark, styles.userCardTextLight)}>
					{member.username}
				</Text>
			</>
		);
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={name}
				absolute
				back
				realBackgroundColor={COLORS.TRANSPARENT}
			/>
			<Animated.ScrollView
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									y: scrollerVal,
								},
							},
						},
					],
					{
						useNativeDriver: true,
					}
				)}
				scrollEventThrottle={9}>
				{/* group image */}
				<View style={styles.imageContainer}>
					<Animated.Image
						style={[
							styles.image,
							{
								transform: [
									{
										translateY: scrollerVal.interpolate({
											inputRange: [
												-IMAGE_HEIGHT,
												0,
												IMAGE_HEIGHT,
												IMAGE_HEIGHT + 1,
											],
											outputRange: [
												-IMAGE_HEIGHT / 2,
												0,
												IMAGE_HEIGHT * 0.65,
												IMAGE_HEIGHT * 0.65,
											],
										}),
									},
								],
								resizeMode: 'cover',
							},
						]}
						source={{
							// uri:
							// 	'https://blog.spoongraphics.co.uk/wp-content/uploads/2017/03/thumbnail-4.jpg',
							uri: image,
						}}
					/>
				</View>

				{/* group other contents */}
				<View style={styles.mainContentContainer}>
					{/* GROUP DESCRIPTION */}
					<View
						style={[
							whatIsTheme(styles.sectionDark, styles.sectionLight),
							styles.firstSection,
						]}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							Description
						</Title>

						<Paragraph style={whatIsTheme(styles.paraDark, styles.paraLight)}>
							{desc ? desc : 'No description Currently.'}
						</Paragraph>
					</View>

					{/* ADMINS AND CO-ADMINS */}
					<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							Group's Admin
						</Title>
						<View style={whatIsTheme(styles.userCardDark, styles.userCardLight)}>
							{adminImage ? (
								// <Avatar.Image
								// 	={whatIsTheme(styles.avatarDark, styles.avatarLight)}
								// 	size={42}
								// 	source={{ uri: adminImage }}
								// />
								<ElementAvatar
									source={{ uri: adminImage }}
									size={42}
									avatarStyle={whatIsTheme(styles.avatarDark, styles.avatarLight)}
								/>
							) : (
								<Avatar.Text
									style={[
										whatIsTheme(styles.avatarDark, styles.avatarLight),
										whatIsTheme(
											{
												borderWidth: 1,
												borderColor: COLORS.GREEN,
											},
											{
												borderWidth: 1,
												borderColor: COLORS.PRIMARY,
											}
										),
									]}
									labelStyle={whatIsTheme(
										styles.avatarLabelDark,
										styles.avatarLabelLight
									)}
									label={admin.username ? admin.username[0].toUpperCase() : ''}
								/>
							)}
							<Text
								style={whatIsTheme(
									styles.userCardTextDark,
									styles.userCardTextLight
								)}>
								{admin.username}
							</Text>
						</View>
					</View>

					{/* ALL PARTICIPANT OR MEMBERS LIST */}
					<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
						<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
							Group Members
						</Title>
						{membersList.map(member => (
							<View
								key={member.uid}
								style={whatIsTheme(styles.userCardDark, styles.userCardLight)}>
								<MembersCard member={member} />
							</View>
						))}
					</View>

					{/* GROUP CREATION DETAILS */}
					<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
						<Text style={whatIsTheme(styles.createdOnDark, styles.createdOnLight)}>
							{`Created On: ${creationTime.getDate()} ${
								months[creationTime.getMonth()]
							} ${creationTime.getFullYear()}`}
						</Text>
					</View>
					<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
						<Text style={whatIsTheme(styles.createdOnDark, styles.createdOnLight)}>
							{`Created By: ${by}`}
						</Text>
					</View>
				</View>
				<View style={styles.lastElementOfTheProfileScrollView}></View>
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	lastElementOfTheProfileScrollView: {
		paddingBottom: 100,
	},

	imageContainer: {
		marginTop: -1000,
		paddingTop: 1000,
		alignItems: 'center',
		overflow: 'hidden',
		width: '100%',
	},
	image: {
		width: '100%',
		height: IMAGE_HEIGHT,
		resizeMode: 'cover',
	},
	mainContentContainer: {
		borderTopColor: COLORS.MID,
		borderTopWidth: 0.6,
	},

	groupDescDark: {
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	groupDescLight: {
		paddingVertical: 10,
		paddingHorizontal: 10,
	},

	groupDescTestDark: {
		paddingVertical: 3,
		paddingHorizontal: 2,
	},
	groupDescTestLight: {
		paddingVertical: 3,
		paddingHorizontal: 2,
	},

	sectionDark: {
		padding: 5,
		borderTopColor: COLORS.DARKGLOW,
		borderTopWidth: 1,
		borderBottomColor: COLORS.DARKGLOW,
		borderBottomWidth: 1,
		marginVertical: 10,
		elevation: 1,
		backgroundColor: COLORS.DARKPRIMARY,
		color: COLORS.WHITE,
	},
	sectionLight: {
		padding: 5,
		borderTopColor: COLORS.DARKFORLIGHT,
		borderTopWidth: 1,
		borderBottomColor: COLORS.DARKFORLIGHT,
		borderBottomWidth: 1,
		marginVertical: 10,
		elevation: 1,
		backgroundColor: COLORS.LIGHTBACKGROUND,
		color: COLORS.BLACK,
	},

	firstSection: {
		marginTop: 0,
		borderTopWidth: 0,
	},

	titleDark: {
		fontSize: 18,
		paddingTop: 3,
		paddingLeft: 3,
		fontFamily: 'roboto',
		color: COLORS.GREEN,
		backgroundColor: COLORS.DARKPRIMARY,
	},
	titleLight: {
		fontSize: 18,
		paddingTop: 3,
		paddingLeft: 3,
		fontFamily: 'roboto',
		color: COLORS.PRIMARY,
		backgroundColor: COLORS.LIGHTBACKGROUND,
	},

	paraDark: {
		paddingHorizontal: 5,
		fontFamily: 'Inter',
		color: COLORS.WHITE,
	},
	paraLight: {
		paddingHorizontal: 5,
		fontFamily: 'Inter',
		color: COLORS.BLACK,
	},

	createdOnDark: {
		paddingVertical: 10,
		color: COLORS.BEFORELIGHT,
		textAlign: 'center',
		width: '100%',
		marginVertical: 10,
		fontSize: 19,
		fontFamily: 'Inter',
	},
	createdOnLight: {
		paddingVertical: 10,
		color: COLORS.DARKGLOW,
		textAlign: 'center',
		width: '100%',
		marginVertical: 10,
		fontSize: 19,
		fontFamily: 'Inter',
	},

	userCardDark: {
		paddingVertical: 7,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	userCardLight: {
		paddingVertical: 7,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},

	userCardTextDark: {
		fontSize: 16,
		paddingHorizontal: 10,
		color: COLORS.WHITE,
	},
	userCardTextLight: {
		fontSize: 16,
		paddingHorizontal: 10,
		color: COLORS.BLACK,
	},

	avatarLight: {
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 100,
		// borderWidth: 1,
		// borderColor: COLORS.PRIMARY,
		overflow: 'hidden',
		maxWidth: 42,
		maxHeight: 42,
		width: 42,
		height: 42,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.TRANSPARENT,
		resizeMode: 'cover',
	},
	avatarDark: {
		resizeMode: 'cover',
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 100,
		// borderWidth: 1,
		// borderColor: COLORS.GREEN,
		overflow: 'hidden',
		maxWidth: 42,
		maxHeight: 42,
		width: 42,
		height: 42,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.TRANSPARENT,
	},

	avatarLabelDark: {
		color: COLORS.GREEN,
		fontFamily: 'inter',
	},
	avatarLabelLight: {
		color: COLORS.PRIMARY,
		fontFamily: 'inter',
	},
});

export default GroupDetailsScreen;
