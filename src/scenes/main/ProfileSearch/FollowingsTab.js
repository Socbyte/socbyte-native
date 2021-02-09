import md5 from "md5";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, StyleSheet, ScrollView } from "react-native";
import { Icon, ListItem, Text } from "react-native-elements";
import { Avatar, Button } from "react-native-paper";
import { useSelector } from "react-redux";

import Header from "../../../components/customs/Header/Header";
import firebase from "../../../firebase/Firebase";
import COLORS from "../../../val/colors/Colors";

const FollowTab = (props) => {
	const { usernameText, userUid } = props.route.params;
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === "d" ? f : s;
	};

	const [followersList, setFollowersList] = useState([]);
	const [limit, setLimit] = useState(10);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
        setLoading(true)
		firebase
			.database()
			.ref("Followings")
			.child(userUid)
			.limitToFirst(limit)
			.once("value")
			.then((res) => {
				const tempdata = [];
				for (let i in res.val()) {
					tempdata.push(res.val()[i]);
				}
				setFollowersList(tempdata);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}, [limit]);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				headerTitle={`${usernameText} Followings`}
				absolute
				back
				backgroundColor={whatIsTheme(COLORS.BLACK, COLORS.WHITE)}
			/>

			<ScrollView>
				{followersList.map((item) => {
					return (
						<ListItem
							key={item.uid + item.username}
							onPress={() => {
								props.navigation.push(
									"ShowSearchedUserProfile",
									{
										uid: item.uid,
										usernameText: item.username,
									}
								);
							}}
							bottomDivider
							underlayColor={whatIsTheme(
								COLORS.DARKPRIMARY,
								COLORS.BEFORELIGHT
							)}
							containerStyle={{
								backgroundColor: COLORS.TRANSPARENT,
								borderBottomColor: whatIsTheme(
									COLORS.NEXTTODARK,
									COLORS.BEFORELIGHT
								),
								borderBottomWidth: 1,
								paddingVertical: 10,
							}}>
							<Avatar.Image
								size={48}
								source={{
									uri: `https://www.gravatar.com/avatar/${md5(
										item.email
									)}.jpg?s=200`,
								}}
								style={{
									borderRadius: 100,
									backgroundColor: COLORS.TRANSPARENT,
									borderWidth: 1,
									borderColor: whatIsTheme(
										COLORS.DARKPRIMARY,
										COLORS.FINALBEFORELIGHT
									),
								}}
							/>
							<ListItem.Content>
								<ListItem.Title
									style={whatIsTheme(
										styles.textDark,
										styles.textLight
									)}>
									{item.username}
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					);
				})}

				{loading ? (
					<View
						style={{
							height: 100,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<ActivityIndicator
							size={33}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
				) : null}

				<View style={styles.loadMoreButtomContainer}>
					{followersList.length < limit ? (
						// this button doesn't do any thing...
						<Button
							color={COLORS.BLUE_FAV}
							disabled
							labelStyle={{
								color: COLORS.MID,
							}}
							onPress={() => {}}>
							No More...
						</Button>
					) : (
						<Button
							color={COLORS.BLUE_FAV}
							onPress={() => setLimit(limit + 7)}>
							Load More...
						</Button>
					)}
				</View>

				<View style={{ paddingBottom: 90 }} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	loadMoreButtomContainer: {
		alignItems: "center",
		marginVertical: 50,
		marginBottom: 90,
	},

	textDark: {
		color: COLORS.BEFORELIGHT,
	},
	textLight: {
		color: COLORS.DARKPRIMARY,
	},
});

export default FollowTab;
