import React, { useEffect, useState, useCallback } from 'react';
import {
	StyleSheet,
	View,
	ImageBackground,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { ListItem, Text, Icon } from 'react-native-elements';
import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';
import { KEY, SufflerList } from '../../../val/constants/Constants';
import { usePlayerContext } from './context/PlayerContext';
import ytdl from 'react-native-ytdl';

const MusicHome = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	let mainindex = 1;

	const dispatch = useDispatch();
	const [refreshing, setRefresing] = useState(false);
	const [reload, setReload] = useState(false);
	const [loading, setLoading] = useState(true);

	const [data, setData] = useState([]);
	const [englishData, setEnglishData] = useState([]);
	const [hindiData, setHindiData] = useState([]);

	function formatDuration(num) {
		function numPadding(n, z) {
			z = z || 2;
			return ('00' + n).slice(-z);
		}

		var ms = num % 1000;
		num = (num - ms) / 1000;
		var secs = num % 60;
		num = (num - secs) / 60;
		var mins = num % 60;
		var hrs = (num - mins) / 60;

		return hrs > 0 ? numPadding(hrs) + ':' : '' + numPadding(mins) + ':' + numPadding(secs);
	}

	function formatArtistsList(artists) {
		if (artists.name && artists.name.length > 0) {
			return artists.name;
		}

		let str = '';
		for (let i in artists) {
			str += `${artists[i].name}, `;
		}
		return str;
	}

	function findThumbnail(thumbnail) {
		//sample link -> https://lh3.googleusercontent.com/IDWg6Ino1Owzlr06w6OgWAc8JYWj8-E8xWfzE7LA2gQbbLSh090IAiPnZ1GS7b2piWL23tnPS_NvGFtg=w60-h60-l90-rj
		const uptoEqualSign = thumbnail.split('=');
		return `${uptoEqualSign[0]}=w250-h250-l90-rj`;
	}

	const onRefresh = useCallback(() => {
		setRefresing(true);
		setReload(!reload);
	}, []);

	const playerContext = usePlayerContext();

	async function loadSong(item, artist = '', formatedDuration, imageFormated) {
		// props.navigation.navigate('PlayMusic', {
		// 	item,
		// 	data: data,
		// 	id: item.videoId,
		// 	duration: formatDuration(item.duration),
		// 	artistList: artist,
		// 	image: findThumbnail(item.thumbnails[item.thumbnails.length - 1]?.url),
		// });

		playerContext.loader();
		const youtubeURL = `http://www.youtube.com/watch?v=${item.videoId}`;
		const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });

		playerContext.play({
			id: item.videoId,
			title: item.name,
			artist: artist,
			duration: item.duration,
			url: urls[0].url,
			artwork: imageFormated,
			durationEdited: formatedDuration,
		});
	}

	async function addSongToQueue(item, artist = '', formatedDuration, imageFormated) {
		const youtubeURL = `http://www.youtube.com/watch?v=${item.videoId}`;
		const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });

		playerContext.addToQueue({
			id: item.videoId,
			title: item.name,
			artist: artist,
			duration: item.duration,
			url: urls[0].url,
			artwork: imageFormated,
			durationEdited: formatedDuration,
		});
	}

	function openSongSearch() {
		props.navigation.navigate('SearchSong');
	}

	function openAdvanceSongAndVideoSearch() {
		props.navigation.navigate('SearchVideo');
	}

	function shuffleArray(array) {
		var j, x, i;
		for (i = array.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = array[i];
			array[i] = array[j];
			array[j] = x;
		}
		return array;
	}

	useEffect(() => {
		setLoading(true);
		fetch(`https://socbyte-backend.herokuapp.com/msc/?query=hindi%20hits&key=${KEY.API_KEY}`)
			.then(res => res.json())
			.then(res => {
				setData(shuffleArray(res));
				setLoading(false);
				setRefresing(false);
				return res;
			})
			.catch(err => {
				console.log('2.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB', err);
				setLoading(false);
				setRefresing(false);
			});
		fetch(
			`https://socbyte-backend.herokuapp.com/msc/?query=top%20english%20songs&key=${KEY.API_KEY}`
		)
			.then(res => res.json())
			.then(res => {
				setEnglishData(shuffleArray(res));
				setLoading(false);
				setRefresing(false);
				return res;
			})
			.catch(err => {
				console.log('3.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB', err);
				setLoading(false);
				setRefresing(false);
			});
		fetch(
			`https://socbyte-backend.herokuapp.com/msc/?query=latest%20hindi%20songs&key=${KEY.API_KEY}`
		)
			.then(res => res.json())
			.then(res => {
				setHindiData(shuffleArray(res));
				setLoading(false);
				setRefresing(false);
				return res;
			})
			.catch(err => {
				console.log('4.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB', err);
				setLoading(false);
				setRefresing(false);
			});
	}, [reload]);

	return (
		<View>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				backgroundColor={COLORS.BLACK}
				renderRightActions
				headerTitle='Music'
				extraButtons={[
					{
						name: 'card-search-outline',
						type: 'material-community',
						size: 24,
						color: COLORS.WHITE,
						onPress: openAdvanceSongAndVideoSearch,
					},
					{
						name: 'search',
						type: 'material-icon',
						size: 24,
						color: COLORS.WHITE,
						onPress: openSongSearch,
					},
				]}
			/>

			<ScrollView
				refreshControl={
					<RefreshControl
						tintColor={COLORS.RED}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}>
				{loading ? (
					<View key='asdfasdf5' style={styles.loader}>
						<ActivityIndicator animating size={38} color={COLORS.BLUE_FAV} />
					</View>
				) : (
					<View key='asdfasdf6'>
						{/* HINDI TITLE */}
						<View key='asdfasdf' style={styles.titleContainer}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								Hindi Hits
							</Text>
						</View>

						{data.map((item, index) => {
							const artistList = formatArtistsList(item.artist);
							const formatedDuration = formatDuration(item.duration);
							const imageFormated = findThumbnail(
								item.thumbnails[item.thumbnails.length - 1]?.url
							);
							mainindex++;
							return (
								<ListItem
									onPress={() =>
										loadSong(item, artistList, formatedDuration, imageFormated)
									}
									key={item.videoId + mainindex}
									underlayColor={whatIsTheme(
										COLORS.DARKPRIMARY,
										COLORS.BEFORELIGHT
									)}
									bottomDivider
									containerStyle={{
										backgroundColor: COLORS.TRANSPARENT,
										borderBottomColor: whatIsTheme(
											COLORS.NEXTTODARK,
											COLORS.BEFORELIGHT
										),
										borderBottomWidth: 1,
										paddingVertical: 5,
										alignItems: 'flex-start',
									}}>
									<ImageBackground
										source={{
											uri: imageFormated,
										}}
										style={styles.songImage}>
										<Text style={styles.durationText}>{formatedDuration}</Text>
									</ImageBackground>

									<ListItem.Content style={styles.fullContainer}>
										<ListItem.Title
											numberOfLines={2}
											style={whatIsTheme(styles.textDark, styles.textLight)}>
											{item.name}
										</ListItem.Title>
										<ListItem.Subtitle
											numberOfLines={1}
											style={{ color: COLORS.MID }}>
											{formatArtistsList(item.artist)}
										</ListItem.Subtitle>
										<ListItem.Subtitle
											numberOfLines={1}
											style={{ color: COLORS.MID }}>
											Duration: {formatedDuration}
										</ListItem.Subtitle>
									</ListItem.Content>

									<Icon
										onPress={() =>
											addSongToQueue(
												item,
												artistList,
												formatedDuration,
												imageFormated
											)
										}
										name='add'
										type='ionicons'
										size={25}
										color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
									/>
								</ListItem>
							);
						})}

						{/* ENGLISH TITLE */}
						<View key='asdfasdf2' style={styles.titleContainer}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								English Songs
							</Text>
						</View>

						<View key='asdfasdf7'>
							<ScrollView
								horizontal
								snapToInterval={Dimensions.get('window').width}
								snapToAlignment='center'
								decelerationRate='fast'
								showsHorizontalScrollIndicator={false}
								style={{
									paddingBottom: 20,
								}}>
								{englishData.map((item, index) => {
									const artistList = formatArtistsList(item.artist);
									const formatedDuration = formatDuration(item.duration);
									const imageFormated = findThumbnail(
										item.thumbnails[item.thumbnails.length - 1]?.url
									);

									mainindex++;
									return (
										<TouchableOpacity
											style={{
												alignItems: 'center',
											}}
											onPress={() =>
												loadSong(
													item,
													artistList,
													formatedDuration,
													imageFormated
												)
											}
											key={item.videoId + mainindex}>
											<View
												style={[
													styles.songCardContainer,
													styles.songCardContainerLarge,
												]}>
												<ImageBackground
													source={{
														uri: imageFormated,
													}}
													style={[
														styles.songCardImage,
														styles.imageLargeDiff,
													]}>
													<Text style={styles.durationText}>
														{formatedDuration}
													</Text>
												</ImageBackground>
												<Text
													style={[
														whatIsTheme(
															styles.cardSongNameDark,
															styles.cardSongNameLight
														),
														styles.extraCardText,
													]}
													numberOfLines={2}>
													{item.name}
												</Text>
												<Text
													style={[
														whatIsTheme(
															styles.cardSongNameDark,
															styles.cardSongNameLight
														),
														styles.extraCardText,
													]}
													numberOfLines={2}>
													{artistList}
												</Text>
											</View>
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</View>

						{/* NEW TITLE */}
						<View key='asdfasdf3' style={styles.titleContainer}>
							<Text style={whatIsTheme(styles.titleDark, styles.titleLight)}>
								New Songs
							</Text>
						</View>

						<View key='asdfasdf4'>
							<ScrollView
								horizontal
								snapToInterval={Dimensions.get('window').width}
								snapToAlignment='center'
								decelerationRate='fast'
								showsHorizontalScrollIndicator={false}
								style={{
									paddingBottom: 20,
								}}>
								{hindiData.map((item, index) => {
									const artistList = formatArtistsList(item.artist);
									const formatedDuration = formatDuration(item.duration);
									const imageFormated = findThumbnail(
										item.thumbnails[item.thumbnails.length - 1]?.url
									);

									mainindex++;
									return (
										<TouchableOpacity
											style={{
												alignItems: 'center',
											}}
											onPress={() =>
												loadSong(
													item,
													artistList,
													formatedDuration,
													imageFormated
												)
											}
											key={item.videoId + mainindex}>
											<View
												style={[
													styles.songCardContainer,
													styles.songCardContainerLarge,
												]}>
												<ImageBackground
													source={{
														uri: imageFormated,
													}}
													style={[
														styles.songCardImage,
														styles.imageLargeDiff,
													]}>
													<Text style={styles.durationText}>
														{formatedDuration}
													</Text>
												</ImageBackground>
												<Text
													style={[
														whatIsTheme(
															styles.cardSongNameDark,
															styles.cardSongNameLight
														),
														styles.extraCardText,
													]}
													numberOfLines={2}>
													{item.name}
												</Text>
												<Text
													style={[
														whatIsTheme(
															styles.cardSongNameDark,
															styles.cardSongNameLight
														),
														styles.extraCardText,
													]}
													numberOfLines={2}>
													{artistList}
												</Text>
											</View>
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</View>
					</View>
				)}
				<View style={styles.lastElementOfTheProfileScrollView}></View>
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
	loader: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 120,
	},

	songCardContainer: {
		padding: 10,
	},
	songCardImage: {
		width: 115,
		height: 115,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	cardSongNameDark: {
		maxWidth: 115,
		textAlign: 'center',
		fontSize: 14,
		color: COLORS.WHITE,
	},
	cardSongNameLight: {
		maxWidth: 115,
		textAlign: 'center',
		fontSize: 14,
		color: COLORS.BLACK,
	},

	songConatainer: {
		flexDirection: 'row',
		marginVertical: 7,
		paddingHorizontal: 6,
		// backgroundColor: COLORS.BEFORELIGHT,
	},

	titleContainer: {
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
	titleDark: {
		color: COLORS.WHITE,
		fontSize: 22,
		fontWeight: 'bold',
	},
	titleLight: {
		color: COLORS.BLACK,
		fontSize: 22,
		fontWeight: 'bold',
	},

	imageContainer: {
		borderRadius: 10,
	},
	songImage: {
		width: 80,
		height: 80,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		borderRadius: 2,
		overflow: 'hidden',
	},
	durationText: {
		// fontSize: 14,
		color: COLORS.WHITE,
		backgroundColor: COLORS.WHITEINDARKVIDIBLE,
		padding: 1,
		borderRadius: 2,
	},

	songTitleDark: {
		color: COLORS.WHITE,
		fontSize: 15,
		fontFamily: 'roboto',
		paddingLeft: 10,
	},
	songTitleLight: {
		color: COLORS.BLACK,
		fontSize: 15,
		fontFamily: 'roboto',
		paddingLeft: 10,
	},

	textDark: {
		color: COLORS.BEFORELIGHT,
	},
	textLight: {
		color: COLORS.DARKPRIMARY,
	},
	fullContainer: {
		height: 75,
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},

	imageLargeDiff: {
		width: 200,
		height: 200,
		borderRadius: 6,
		overflow: 'hidden',
	},
	songCardContainerLarge: {
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'center',
	},

	extraCardText: {
		width: 200,
		maxWidth: 200,
	},

	lastElementOfTheProfileScrollView: {
		paddingBottom: 99,
	},
});

export default MusicHome;

// const [show, setshow] = useState(false);
// const searchbarHideValue = useRef(new Animated.Value(Dimensions.get('window').width)).current;
// const hiddenViewHieght = useRef(new Animated.Value(0)).current;
// const toggleSearchBar = () => {
// 	if (show) {
// 		setshow(false);
// 		Animated.sequence([
// 			Animated.timing(searchbarHideValue, {
// 				toValue: Dimensions.get('window').width,
// 				duration: 350,
// 				useNativeDriver: false,
// 			}),
// 			Animated.timing(hiddenViewHieght, {
// 				toValue: 0,
// 				duration: 350,
// 				useNativeDriver: false,
// 			}),
// 		]).start();
// 	} else {
// 		setshow(true);
// 		Animated.sequence([
// 			Animated.timing(hiddenViewHieght, {
// 				toValue: 50,
// 				duration: 350,
// 				useNativeDriver: false,
// 			}),
// 			Animated.timing(searchbarHideValue, {
// 				toValue: 0,
// 				duration: 350,
// 				useNativeDriver: false,
// 			}),
// 		]).start();
// 	}
// };

{
	/* <Searchbar
				onSubmitEditing={searchForSong}
				theme={whatIsTheme(DarkTheme, DefaultTheme)}
				style={{
					backgroundColor: whatIsTheme(COLORS.NEXTTODARK, COLORS.LIGHTBACKGROUND),
					transform: [
						{
							translateX: searchbarHideValue,
							// translateX: !show ? Dimensions.get('window').width : 0,
						},
					],
					height: hiddenViewHieght,
					borderRadius: 0,
				}}
				value={searchText}
				icon={() => (
					<Icon
						onPress={toggleSearchBar}
						iconStyle={styles.listIcon}
						// name='return-up-back-outline'
						name='keyboard-backspace'
						type='material-community-icons'
						size={26}
						color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
					/>
				)}
				onChangeText={setSearchText}
				clearIcon={() => {
					return (
						<Icon
							name='clear'
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							type='material-icons'
							size={24}
						/>
					);
				}}
				placeholder='Search Songs...'
			/> */
}
