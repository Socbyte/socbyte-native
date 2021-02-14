import md5 from "md5";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, ScrollView, Image } from "react-native";
import { Avatar, Paragraph, Text, Title } from "react-native-paper";
import { useSelector } from "react-redux";
import {
	Avatar as ElementAvatar,
	BottomSheet,
	ListItem,
} from "react-native-elements";

import Header from "../../../../components/customs/Header/Header";
import COLORS from "../../../../val/colors/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "../../../../firebase/Firebase";
import { ToastAndroid } from "react-native";
import { ActivityIndicator } from "react-native";
import sendMessage from "../../../../val/functions/SendMessage";
import { ChatTypes } from "../../../../val/constants/Constants";

const IMAGE_HEIGHT = 350;

const GroupDetailsScreen = (props) => {
	const scrollerVal = useRef(new Animated.Value(0)).current;
	const { group } = useSelector((state) => state.groups);
	const { id } = props.route.params;

	const [currGroupData, setCurrGroupData] = useState({});
	const [loading, setLoading] = useState(true);
	const creationTime = new Date(
		new Number(currGroupData?.at ? currGroupData.at : 0)
	);
	const [coadminsList, setCoAdminsList] = useState([]);
	const [membersList, setMembersList] = useState([]);
	const [userIsAdmin, setUserIsAdmin] = useState(0);
	const [onUserPressed, setOnUserPressed] = useState({});

	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === "d" ? f : s;
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	useEffect(() => {
		const tempMembersList = [];
		if (currGroupData.members) {
			for (var i in currGroupData.members)
				tempMembersList.push(currGroupData.members[i]);
		}
		setMembersList(tempMembersList);

		const tempCoList = [];
		if (currGroupData.coadmins) {
			for (var i in currGroupData.coadmins) {
				tempCoList.push(currGroupData.coadmins[i]);
			}
		}
		setCoAdminsList(tempCoList);
	}, [currGroupData]);

	useEffect(() => {
		setUserIsAdmin(0);
		if (currGroupData.admin?.email) {
			if (
				currGroupData.admin.email === firebase.auth().currentUser.email
			) {
				setUserIsAdmin(1);
				return;
			} else {
				setUserIsAdmin(0);
			}
		}

		if (coadminsList.length) {
			for (var i in coadminsList) {
				console.log("AA", coadminsList);
				if (coadminsList[i]?.uid === firebase.auth().currentUser.uid) {
					console.log("BB", coadminsList);
					setUserIsAdmin(2);
				}
			}
		}
	}, [coadminsList]);

	useEffect(() => {
		// console.log(':MESSAGES', messages);
		/**
		 * settings the current group the user is in...
		 */
		setLoading(true);
		setCurrGroupData(group[id]);
		setLoading(false);

		// console.log('LIST', tempMembersList);

		// console.log(groupData);
	}, [group[id]]);

	const userIsAdminOrCoAdmin = () => {
		if (onUserPressed.email === currGroupData.admin.email) return 1;
		if (coadminsList.length) {
			for (let i in coadminsList) {
				if (coadminsList[i].uid === onUserPressed.uid) {
					return 2;
				}
			}
		}
		return 0;
	};

	function userIsAmongAdmin(uid) {
		if (uid === currGroupData.admin.email) return 1;
		if (coadminsList.length)
			for (let i in coadminsList)
				if (uid === coadminsList[i].uid) return 2;
		return 0;
	}

	const makeUserCoAdmin = () => {
		if (userIsAdmin) {
			// console.log(id);
			if (id) {
				if (userIsAdminOrCoAdmin() !== 0) {
					ToastAndroid.show(
						"User is already co-admin",
						ToastAndroid.SHORT
					);
					return;
				}
				firebase
					.database()
					.ref("Groups")
					.child(id)
					.child("coadmins")
					.child(onUserPressed.uid)
					.update({
						uid: onUserPressed.uid,
					})
					.then((res) => {
						ToastAndroid.show(
							"New Co-Admin Added.",
							ToastAndroid.SHORT
						);

						setOnUserPressed({});
						sendMessage(
							"app",
							`${onUserPressed.username} was added to co-admins list`,
							id,
							ChatTypes.CMD2
						);
					})
					.catch((err) => {
						ToastAndroid.show(
							"Error while adding new co-admin.",
							ToastAndroid.SHORT
						);
						setOnUserPressed({});
					});
			} else {
				ToastAndroid.show(
					"Cannot make this operation currently. Group data not available",
					ToastAndroid.SHORT
				);
			}
		} else {
			ToastAndroid.show(
				"You are not allowed to do this.",
				ToastAndroid.SHORT
			);
		}
	};

	const removeUserAsCoAdmin = () => {
		if (userIsAdmin) {
			// console.log(id);
			if (id) {
				if (userIsAdminOrCoAdmin() === 0) {
					ToastAndroid.show(
						"User is already co-admin",
						ToastAndroid.SHORT
					);
					return;
				}

				firebase
					.database()
					.ref("Groups")
					.child(id)
					.child("coadmins")
					.child(onUserPressed.uid)
					.remove()
					.then((res) => {
						ToastAndroid.show(
							"User removed from co-admins list",
							ToastAndroid.SHORT
						);
						setOnUserPressed({});
						sendMessage(
							"app",
							`${onUserPressed.username} was removed from co-admins list`,
							id,
							ChatTypes.CMD2
						);
					})
					.catch((err) => {
						ToastAndroid.show(
							"Error while removing from co-admins list.",
							ToastAndroid.SHORT
						);
						setOnUserPressed({});
					});
			} else {
				ToastAndroid.show(
					"Cannot make this operation currently. Group data not available",
					ToastAndroid.SHORT
				);
			}
		} else {
			ToastAndroid.show(
				"You are not allowed to do this.",
				ToastAndroid.SHORT
			);
		}
	};

	const MembersCard = ({ member }) => {
		const [image, setImage] = useState("");

		useEffect(() => {
			const emailHash = md5(member.email);
			fetch(`https://www.gravatar.com/${emailHash}.json`)
				.then((res) => res.json())
				.then((res) => {
					if (JSON.stringify(res).includes("User not found")) {
						setImage("");
					} else {
						setImage(
							`https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`
						);
					}
				})
				.catch((err) => {
					console.log(
						"THIS ERROR OCCURED WHILE LOADING GRAVATAR",
						err
					);
				});
		}, []);

		return (
			<>
				{image ? (
					<ElementAvatar
						source={{ uri: image }}
						size={42}
						avatarStyle={whatIsTheme(
							styles.avatarDark,
							styles.avatarLight
						)}
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
						label={
							member.username
								? member.username[0].toUpperCase()
								: ""
						}
					/>
				)}
				<Text
					style={whatIsTheme(
						styles.userCardTextDark,
						styles.userCardTextLight
					)}
				>
					{member.username}
				</Text>
			</>
		);
	};

	const CoAdminsList = () => {
		return coadminsList.map((coadmin) => {
			let thisMember = {
				email: "",
				username: "",
			};
			for (let i in membersList) {
				if (membersList[i].uid === coadmin.uid) {
					thisMember = membersList[i];
				}
			}

			return (
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate("ShowSearchedUserProfile", {
							uid: thisMember.uid,
							usernameText: thisMember.username,
						});
					}}
				>
					<View
						key={thisMember?.uid ? thisMember?.uid : ""}
						style={whatIsTheme(
							styles.userCardDark,
							styles.userCardLight
						)}
					>
						<MembersCard member={thisMember} />
					</View>
				</TouchableOpacity>
			);
		});
	};

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={currGroupData?.name ? currGroupData.name : ""}
				absolute
				back
				realBackgroundColor={COLORS.TRANSPARENT}
			/>
			{loading ? (
				<ActivityIndicator
					size={45}
					style={{ paddingVertical: 50 }}
					color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
				/>
			) : (
				<Animated.ScrollView
					showsVerticalScrollIndicator={false}
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
					scrollEventThrottle={9}
				>
					{/* group image */}
					<View style={styles.imageContainer}>
						<Animated.Image
							style={[
								styles.image,
								{
									transform: [
										{
											translateY: scrollerVal.interpolate(
												{
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
												}
											),
										},
										{
											scale: scrollerVal.interpolate({
												inputRange: [
													-IMAGE_HEIGHT,
													0,
													IMAGE_HEIGHT,
													IMAGE_HEIGHT + 1,
												],
												outputRange: [5, 1, 1.35, 1],
											}),
										},
									],
									resizeMode: "cover",
								},
							]}
							source={{
								// uri:
								//  'https://blog.spoongraphics.co.uk/wp-content/uploads/2017/03/thumbnail-4.jpg',
								uri: currGroupData.image,
							}}
						/>
					</View>

					{/* group other contents */}
					<View style={styles.mainContentContainer}>
						{/* GROUP DESCRIPTION */}
						<View
							style={[
								whatIsTheme(
									styles.sectionDark,
									styles.sectionLight
								),
								styles.firstSection,
							]}
						>
							<Title
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								Description
							</Title>

							<Paragraph
								style={whatIsTheme(
									styles.paraDark,
									styles.paraLight
								)}
							>
								{currGroupData?.desc
									? currGroupData.desc
									: "No description Currently."}
							</Paragraph>
						</View>

						{/* ADMINS AND CO-ADMINS */}
						<TouchableOpacity
							onPress={() => {
								if (!currGroupData.admin.uid) {
									ToastAndroid.show(
										"User not found!",
										ToastAndroid.SHORT
									);
									return;
								}
								props.navigation.navigate(
									"ShowSearchedUserProfile",
									{
										uid: currGroupData.admin.uid,
										usernameText:
											currGroupData.admin.username,
									}
								);
							}}
						>
							<View
								style={whatIsTheme(
									styles.sectionDark,
									styles.sectionLight
								)}
							>
								<Title
									style={whatIsTheme(
										styles.titleDark,
										styles.titleLight
									)}
								>
									Group's Admin
								</Title>
								<View
									key={
										currGroupData.admin?.uid
											? currGroupData.admin?.uid
											: "kekke-this is random"
									}
									style={whatIsTheme(
										styles.userCardDark,
										styles.userCardLight
									)}
								>
									<MembersCard member={currGroupData.admin} />
								</View>
							</View>
						</TouchableOpacity>

						{/* ADMINS AND CO-ADMINS */}
						{coadminsList.length > 0 ? (
							<View
								style={whatIsTheme(
									styles.sectionDark,
									styles.sectionLight
								)}
							>
								<Title
									style={whatIsTheme(
										styles.titleDark,
										styles.titleLight
									)}
								>
									Group's Co-Admins
								</Title>
								<CoAdminsList />
							</View>
						) : null}

						{/* ALL PARTICIPANT OR MEMBERS LIST */}
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Title
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								Group Members
							</Title>
							{membersList.map(
								(member) => (
									<TouchableOpacity
										onPress={() => {
											setOnUserPressed(member);
										}}
									>
										<View
											key={member.uid}
											style={whatIsTheme(
												styles.userCardDark,
												styles.userCardLight
											)}
										>
											<MembersCard member={member} />
										</View>
									</TouchableOpacity>
								)
								// userIsAdmin ? (
								// 	<TouchableOpacity
								// 		onPress={() => {
								// 			setOnUserPressed(member);
								// 		}}
								// 	>
								// 		<View
								// 			key={member.uid}
								// 			style={whatIsTheme(
								// 				styles.userCardDark,
								// 				styles.userCardLight
								// 			)}
								// 		>
								// 			<MembersCard member={member} />
								// 		</View>
								// 	</TouchableOpacity>
								// ) : (
								// 	<View
								// 		key={member.uid}
								// 		style={whatIsTheme(
								// 			styles.userCardDark,
								// 			styles.userCardLight
								// 		)}
								// 	>
								// 		<MembersCard member={member} />
								// 	</View>
								// )
							)}
						</View>

						{/* GROUP CREATION DETAILS */}
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Text
								style={whatIsTheme(
									styles.createdOnDark,
									styles.createdOnLight
								)}
							>
								{`Created On: ${creationTime.getDate()} ${
									months[creationTime.getMonth()]
								} ${creationTime.getFullYear()}`}
							</Text>
						</View>
						<View
							style={whatIsTheme(
								styles.sectionDark,
								styles.sectionLight
							)}
						>
							<Text
								style={whatIsTheme(
									styles.createdOnDark,
									styles.createdOnLight
								)}
							>
								{`Created By: ${
									currGroupData?.by
										? currGroupData.by
										: "Unkonwn"
								}`}
							</Text>
						</View>
					</View>

					<View
						style={styles.lastElementOfTheProfileScrollView}
					></View>
				</Animated.ScrollView>
			)}

			<BottomSheet
				modalProps={{
					style: {
						backgroundColor: COLORS.TRANSPARENT,
					},
				}}
				isVisible={onUserPressed?.uid ? true : false}
				containerStyle={{
					backgroundColor: whatIsTheme(
						`${COLORS.BLACK}6f`,
						`${COLORS.DARKFORLIGHT}6f`
					),
				}}
			>
				<ListItem
					onPress={() => {
						props.navigation.navigate("ShowSearchedUserProfile", {
							uid: onUserPressed.uid,
							usernameText: onUserPressed.username,
						});
						setOnUserPressed({});
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
							View Profile
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
				{currGroupData.admin?.uid &&
				onUserPressed.uid !== currGroupData.admin.uid &&
				userIsAdmin !== 0 /*&& userIsAdminOrCoAdmin() !== 0 */ ? (
					<ListItem
						onPress={() =>
							userIsAdminOrCoAdmin() !== 0
								? removeUserAsCoAdmin()
								: makeUserCoAdmin()
						}
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
								{userIsAdminOrCoAdmin() !== 0
									? "Remove from co-admin"
									: "Make User Co-Admin"}
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>
				) : null}

				<ListItem
					onPress={() => {
						ToastAndroid.show(
							"Development on this feature implementation is going on.",
							ToastAndroid.SHORT
						);
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
							Report User
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				<ListItem
					onPress={() => {
						setOnUserPressed({});
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
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	lastElementOfTheProfileScrollView: {
		paddingBottom: 100,
	},

	imageContainer: {
		marginTop: -1000,
		paddingTop: 1000,
		alignItems: "center",
		overflow: "hidden",
		width: "100%",
	},
	image: {
		width: "100%",
		height: IMAGE_HEIGHT,
		resizeMode: "cover",
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
		fontFamily: "roboto",
		color: COLORS.GREEN,
		backgroundColor: COLORS.DARKPRIMARY,
	},
	titleLight: {
		fontSize: 18,
		paddingTop: 3,
		paddingLeft: 3,
		fontFamily: "roboto",
		color: COLORS.PRIMARY,
		backgroundColor: COLORS.LIGHTBACKGROUND,
	},

	paraDark: {
		paddingHorizontal: 5,
		fontFamily: "Inter",
		color: COLORS.WHITE,
	},
	paraLight: {
		paddingHorizontal: 5,
		fontFamily: "Inter",
		color: COLORS.BLACK,
	},

	createdOnDark: {
		paddingVertical: 10,
		color: COLORS.BEFORELIGHT,
		textAlign: "center",
		width: "100%",
		marginVertical: 10,
		fontSize: 19,
		fontFamily: "Inter",
	},
	createdOnLight: {
		paddingVertical: 10,
		color: COLORS.DARKGLOW,
		textAlign: "center",
		width: "100%",
		marginVertical: 10,
		fontSize: 19,
		fontFamily: "Inter",
	},

	userCardDark: {
		paddingVertical: 7,
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	userCardLight: {
		paddingVertical: 7,
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
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
		overflow: "hidden",
		maxWidth: 42,
		maxHeight: 42,
		width: 42,
		height: 42,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.TRANSPARENT,
		resizeMode: "cover",
	},
	avatarDark: {
		resizeMode: "cover",
		backgroundColor: COLORS.DARKSECONDARY,
		borderRadius: 100,
		// borderWidth: 1,
		// borderColor: COLORS.GREEN,
		overflow: "hidden",
		maxWidth: 42,
		maxHeight: 42,
		width: 42,
		height: 42,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.TRANSPARENT,
	},

	avatarLabelDark: {
		color: COLORS.GREEN,
		fontFamily: "inter",
	},
	avatarLabelLight: {
		color: COLORS.PRIMARY,
		fontFamily: "inter",
	},

	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},
	cancelButton: {
		textAlign: "center",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		color: COLORS.RED,
	},
});

export default GroupDetailsScreen;
