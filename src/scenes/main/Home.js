import React, { useEffect, useState } from 'react';
import { StyleSheet, Vibration, View } from 'react-native';
import {
	IconButton,
	Button,
	Menu,
	Provider,
	Divider,
	DarkTheme,
	DefaultTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ytdl from 'react-native-ytdl';

import COLORS from '../../val/colors/Colors';
import Firebase from '../../firebase/Firebase';

const Home = props => {
	const [menu, setMenu] = useState(false);

	useEffect(() => {
		// console.log('NOPE');
		// async function loadThisSongData() {
		// 	const youtubeURL = `http://www.youtube.com/watch?v=${RecommendedSongsList[i].id}`;
		// 	const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
		// 	console.log(RecommendedSongsList[i].title, urls[0].url);
		// }
		// loadThisSongData();
	}, []);

	return (
		<View style={styles.screen}>
			{/* <Provider theme={DarkTheme}>
				<View>
					<Menu
						visible={menu}
						onDismiss={() => setMenu(false)}
						anchor={
							<Button
								onPress={() => {
									setMenu(true);
								}}>
								Show Menu
							</Button>
						}>
						<Menu.Item onPress={() => {}} title='Item 1' />
						<Menu.Item onPress={() => {}} title='Item 2' />
						<Divider />
						<Menu.Item onPress={() => {}} title='Item 3' />
					</Menu>
				</View>
			</Provider> */}

			<Provider theme={DarkTheme}>
				<View
					style={{
						flex: 1,
						alignContent: 'center',
						justifyContent: 'center',
						// backgroundColor: COLORS.ACCENT,
					}}>
					<Menu
						style={
							{
								// backgroundColor: COLORS.ACCENT,
							}
						}
						visible={menu}
						onDismiss={() => setMenu(false)}
						anchor={
							<IconButton
								style={{
									margin: 0,
								}}
								onPress={() => {
									props.navigation.toggleDrawer();
								}}
								icon={() => <Ionicons name='menu' color={COLORS.MID} size={26} />}
							/>
						}>
						<Menu.Item onPress={() => {}} title='Item 1' />
						<Menu.Item onPress={() => {}} title='Item 2' />
						<Divider />
						<Menu.Item onPress={() => {}} title='Item 3' />
					</Menu>
				</View>
			</Provider>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Home;
