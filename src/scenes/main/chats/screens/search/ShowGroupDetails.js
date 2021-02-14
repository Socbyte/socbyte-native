import React, { useRef, useState, useEffect } from "react";
import {
	Animated,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import {
	Icon,
	ListItem,
	Text,
	Avatar as ElementAvatar,
} from "react-native-elements";
import { Paragraph, Title, Avatar, Button } from "react-native-paper";
import { useSelector } from "react-redux";

import firebase from "../../../../../firebase/Firebase";
import Header from "../../../../../components/customs/Header/Header";
import COLORS from "../../../../../val/colors/Colors";
import md5 from "md5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ToastAndroid } from "react-native";

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
const IMAGE_HEIGHT = 350;

const AdminPanel = ({ admin, whatIsTheme, navigation }) => {
	const [adminImage, setAdminImage] = useState("");

	useEffect(() => {
		const emailHash = md5(admin.email);
		fetch(`https://www.gravatar.com/${emailHash}.json`)
			.then((res) => res.json())
			.then((res) => {
				if (JSON.stringify(res).includes("User not found")) {
					setAdminImage("");
				} else {
					setAdminImage(
						`https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`
					);
				}
			})
			.catch((err) => {
				console.log("THIS ERROR OCCURED WHILE LOADING GRAVATAR", err);
			});
	}, []);

	return (
		<View style={whatIsTheme(styles.sectionDark, styles.sectionLight)}>
			<Title style={whatIsTheme(styles.titleDark, styles.titleLight)}>
				Group's Admin
			</Title>
			<TouchableOpacity
				onPress={() => {
					navigation.navigate("ShowSearchedUserProfile", {
						uid: admin.uid,
						usernameText: admin.username,
					});
				}}
			>
				<View
					style={whatIsTheme(
						styles.userCardDark,
						styles.userCardLight
					)}
				>
					{adminImage ? (
						<ElementAvatar
							source={{ uri: adminImage }}
							size={42}
							avatarStyle={whatIsTheme(
								styles.avatarDark,
								styles.avatarLight
							)}
						/>
					) : (
						<Avatar.Text
							style={[
								whatIsTheme(
									styles.avatarDark,
									styles.avatarLight
								),
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
								admin.username
									? admin.username[0].toUpperCase()
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
						{admin.username}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const UserCard = ({ user, whatIsTheme, navigation }) => {
	const [image, setImage] = useState("");

	useEffect(() => {
		const emailHash = md5(user.email);
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
				console.log("THIS ERROR OCCURED WHILE LOADING GRAVATAR", err);
			});
	}, []);

	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate("ShowSearchedUserProfile", {
					uid: user.uid,
					usernameText: user.username,
				});
			}}
		>
			<View
				style={whatIsTheme(styles.userCardDark, styles.userCardLight)}
			>
				{image ? (
					// <Avatar.Image
					// 	={whatIsTheme(styles.avatarDark, styles.avatarLight)}
					// 	size={42}
					// 	source={{ uri: adminImage }}
					// />
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
							user.username ? user.username[0].toUpperCase() : ""
						}
					/>
				)}
				<Text
					style={whatIsTheme(
						styles.userCardTextDark,
						styles.userCardTextLight
					)}
				>
					{user.username}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const ShowGroupDetails = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const { username } = useSelector((state) => state.main.user);
	const whatIsTheme = (f, s) => {
		return !theme || theme === "d" ? f : s;
	};
	const { groupData } = props.route.params;
	const creationTime = new Date(new Number(groupData.at));
	const scrollerVal = useRef(new Animated.Value(0)).current;
	const [num, setNumber] = useState(0);
	const [canRequest, setCanRequest] = useState(true);
	const [memberList, setMembersList] = useState([]);

	const registerReportThisGroup = () => {
		if (num === 0) {
			setNumber(1);
			return;
		} else {
			//register report against this gruop...
			//currently does nothing...
			ToastAndroid.showWithGravity(
				"Group Reported",
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		}
	};

	const currentUser = firebase.auth().currentUser;
	const requestToJoinGroup = () => {
		const timestamp = new Date();
		firebase
			.database()
			.ref("GroupsNotifications")
			.child(groupData.id)
			.orderByChild("username")
			.startAt(username)
			.endAt(username + "\uf8ff")
			.limitToFirst(1)
			.once("value")
			.then((snap) => {
				if (snap.val()) {
					ToastAndroid.showWithGravity(
						"Your request is already made.",
						ToastAndroid.SHORT,
						ToastAndroid.CENTER
					);
				} else {
					firebase
						.database()
						.ref("GroupsNotifications")
						.child(groupData.id)
						.child(timestamp.getTime())
						.update({
							uid: currentUser.uid,
							email: currentUser.email,
							username: currentUser.displayName,
							time: timestamp.getTime(),
							type: "request",
						})
						.then((res) => {
							ToastAndroid.showWithGravity(
								"Your request has been made.",
								ToastAndroid.SHORT,
								ToastAndroid.CENTER
							);
						})
						.catch((err) => {
							ToastAndroid.showWithGravity(
								"Could not make request currently. Please try again.",
								ToastAndroid.SHORT,
								ToastAndroid.CENTER
							);
						});
				}
			});
	};

	useEffect(() => {
		const list = [];
		for (let i in groupData.members) {
			list.push(groupData.members[i]);
			if (groupData.members[i].username === username) {
				setCanRequest(false);
			}
		}
		setMembersList(list);
	}, []);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={groupData.name}
				absolute
				back
				realBackgroundColor={COLORS.TRANSPARENT}
			/>
			<Animated.ScrollView
				showsHorizontalScrollIndicator={false}
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
							// 	'https://blog.spoongraphics.co.uk/wp-content/uploads/2017/03/thumbnail-4.jpg',
							uri: groupData.image,
						}}
					/>
				</View>

				{/* Request to join this group */}
				{canRequest ? (
					<View style={{ alignItems: "center", marginVertical: 10 }}>
						<Button
							contentStyle={{
								backgroundColor: whatIsTheme(
									COLORS.DARKPRIMARY,
									COLORS.BLUE_FAV
								),
							}}
							onPress={requestToJoinGroup}
							color={whatIsTheme(COLORS.BLUE_FAV, COLORS.WHITE)}
						>
							Request To Join
						</Button>
					</View>
				) : (
					<View>{/* <Text>YOUR</Text> */}</View>
				)}

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
							{groupData.desc
								? groupData.desc
								: "No description Currently."}
						</Paragraph>
					</View>

					{/* groups admin details */}
					<AdminPanel
						{...props}
						admin={groupData.admin}
						whatIsTheme={whatIsTheme}
					/>

					{/* groups coadmins details... */}
					{/* {groupData.coads ? <} */}

					{/* groups members will not be shown */}
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
							Members
						</Title>
						{/* <GroupMember
							members={groupData.members}
							whatIsTheme={whatIsTheme}
							{...props}
						/> */}
						{memberList.map((member) => {
							return (
								<UserCard
									user={member}
									whatIsTheme={whatIsTheme}
									{...props}
								/>
							);
						})}
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
							{`Created By: ${groupData.by}`}
						</Text>
					</View>
				</View>

				<View
					style={whatIsTheme(styles.sectionDark, styles.sectionLight)}
				>
					<TouchableOpacity onPress={registerReportThisGroup}>
						<Text style={styles.reportText}>Report This Group</Text>
					</TouchableOpacity>
					{num !== 0 ? (
						<TouchableOpacity onPress={() => setNumber(0)}>
							<View>
								<Text
									style={{
										color: COLORS.MID,
										padding: 10,
										textAlign: "center",
									}}
								>
									Are you sure you want to register a report
									message against this group. Your details
									along with username and email will be sent
									to developers only. Click this text if you
									clicked on report button accidentally.
								</Text>
							</View>
						</TouchableOpacity>
					) : null}
				</View>

				<View style={styles.lastElementOfTheProfileScrollView} />
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
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
		color: COLORS.BLUE_FAV,
		backgroundColor: COLORS.DARKPRIMARY,
	},
	titleLight: {
		fontSize: 18,
		paddingTop: 3,
		paddingLeft: 3,
		fontFamily: "roboto",
		color: COLORS.BLUE_FAV,
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

	reportText: {
		paddingVertical: 3,
		color: COLORS.RED,
		textAlign: "center",
		width: "100%",
		marginVertical: 3,
		fontSize: 19,
		fontFamily: "roboto",
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
});

export default ShowGroupDetails;
