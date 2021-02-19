import React, { useEffect, useState, useCallback } from 'react';
import {
	StyleSheet,
	View,
	ImageBackground,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Dimensions,
	ToastAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { ListItem, Text, Icon } from 'react-native-elements';
import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';
import { KEY } from '../../../val/constants/Constants';
import { usePlayerContext } from './context/PlayerContext';
import ytdl from 'react-native-ytdl';
import LottieView from 'lottie-react-native';
import { EnglishSongs, HindiHits } from '../../../val/constants/SongsList';

export const MusicItem = ({
	item,
	index,
	formatArtistsList,
	formatDuration,
	findThumbnail,
	loadSong,
	addSongToQueue,
	whatIsTheme,
	playerContext,
	data,
}) => {
	const [added, setAdded] = useState(false);
	const artistList = formatArtistsList(item.artist);
	const formatedDuration = formatDuration(item.duration);
	const imageFormated = findThumbnail(
		item.thumbnails[item.thumbnails.length - 1]?.url
	);

	return (
		<ListItem
			onPress={() => {
				loadSong(
					item,
					artistList,
					formatedDuration,
					imageFormated,
					data
				);
				setAdded(true);
			}}
			delayLongPress={1500}
			onLongPress={() => {
				ToastAndroid.showWithGravity(
					'Adding to queue...',
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
				addSongToQueue(
					item,
					artistList,
					formatedDuration,
					imageFormated
				);
				setAdded(true);
			}}
			key={item.videoId}
			underlayColor={whatIsTheme(COLORS.DARKPRIMARY, COLORS.BEFORELIGHT)}
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
			}}
		>
			<ImageBackground
				source={{
					uri: imageFormated,
				}}
				style={styles.songImage}
			>
				{playerContext.isPlaying && playerContext.currentTrack?.id ? (
					playerContext.currentTrack?.id === item.videoId
				) : false ? (
					<LottieView
						source={require('../../../assets/animations/waves.json')}
						style={{
							width: 80,
							height: 80,
							padding: 0,
							margin: 0,
							backgroundColor: `${COLORS.BLACK}30`,
							position: 'absolute',
						}}
						autoPlay={true}
						loop={true}
						autoSize={true}
						resizeMode='cover'
					/>
				) : null}
				<Text style={styles.durationText}>{formatedDuration}</Text>
			</ImageBackground>

			<ListItem.Content style={styles.fullContainer}>
				<ListItem.Title
					key='random1'
					numberOfLines={2}
					style={whatIsTheme(styles.textDark, styles.textLight)}
				>
					{item.name}
				</ListItem.Title>
				<ListItem.Subtitle
					key='random2'
					numberOfLines={1}
					style={{ color: COLORS.MID }}
				>
					{formatArtistsList(item.artist)}
				</ListItem.Subtitle>
				<ListItem.Subtitle
					key='random3'
					numberOfLines={1}
					style={{ color: COLORS.MID }}
				>
					Duration: {formatedDuration}
				</ListItem.Subtitle>
			</ListItem.Content>

			{!added ? (
				<Icon
					onPress={() => {
						addSongToQueue(
							item,
							artistList,
							formatedDuration,
							imageFormated
						);
						setAdded(true);
					}}
					name='add'
					type='ionicons'
					size={25}
					color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
				/>
			) : null}
		</ListItem>
	);
};

const MusicHome = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const playerContext = usePlayerContext();
	// const dispatch = useDispatch();

	const [refreshing, setRefresing] = useState(false);
	const [reload, setReload] = useState(false);
	const [loading, setLoading] = useState(true);

	const [data, setData] = useState([]);

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

		return hrs > 0
			? numPadding(hrs) + ':'
			: '' + numPadding(mins) + ':' + numPadding(secs);
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
		return `${uptoEqualSign[0]}=w400-h400-l90-rj`;
	}

	const onRefresh = useCallback(() => {
		setRefresing(true);
		setReload(!reload);
	}, []);

	async function loadSong(
		item,
		artist = '',
		formatedDuration,
		imageFormated,
		recommendList
	) {
		// props.navigation.navigate('PlayMusic', {
		// 	item,
		// 	data: data,
		// 	id: item.videoId,
		// 	duration: formatDuration(item.duration),
		// 	artistList: artist,
		// 	image: findThumbnail(item.thumbnails[item.thumbnails.length - 1]?.url),
		// });

		const youtubeURL = `http://www.youtube.com/watch?v=${item.videoId}`;
		const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });

		// console.log({
		// 	id: item.videoId,
		// 	title: item.name,
		// 	artist: artist,
		// 	duration: item.duration,
		// 	url: urls[0].url,
		// 	artwork: imageFormated,
		// 	durationEdited: formatedDuration,
		// });

		playerContext.play({
			id: item.videoId,
			title: item.name,
			artist: artist,
			duration: item.duration,
			url: urls[0].url,
			artwork: imageFormated,
			durationEdited: formatedDuration,
		});

		for (let i = 0; i < 2; ++i) {
			let ranListItem =
				recommendList[Math.floor(Math.random() * recommendList.length)];
			playerContext.addRecommendedSong({
				id: ranListItem.videoId,
				title: ranListItem.name,
				artist: formatArtistsList(ranListItem.artist),
				duration: ranListItem.duration,
				artwork: findThumbnail(
					ranListItem.thumbnails[ranListItem.thumbnails.length - 1]
						?.url
				),
				durationEdited: formatDuration(ranListItem.duration),
			});
			// console.log(ranListItem);
		}

		// playerContext.addRecommendedSong(song);
	}

	async function addSongToQueue(
		item,
		artist = '',
		formatedDuration,
		imageFormated
	) {
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

	async function playSongDirect(item, list) {
		playerContext.play({
			id: item.videoId,
			title: item.name,
			artist: item.artist,
			duration: item.duration,
			url: item.url,
			artwork: item.thumbnails,
			durationEdited: item.formatedDuration,
		});

		for (let i = 0; i < 2; ++i) {
			let ranListItem = list[Math.floor(Math.random() * list.length)];
			playerContext.addRecommendedSong({
				id: ranListItem.videoId,
				title: ranListItem.name,
				artist: formatArtistsList(ranListItem.artist),
				duration: ranListItem.duration,
				artwork: findThumbnail(
					ranListItem.thumbnails[ranListItem.thumbnails.length - 1]
						?.url
				),
				durationEdited: formatDuration(ranListItem.duration),
			});
		}
	}

	async function addSongToQueueDirect(item, list) {
		playerContext.addToQueue({
			id: item.videoId,
			title: item.name,
			artist: item.artist,
			duration: item.duration,
			url: item.url,
			artwork: item.thumbnails,
			durationEdited: item.formatedDuration,
		});
		for (let i = 0; i < 2; ++i) {
			let ranListItem = list[Math.floor(Math.random() * list.length)];
			playerContext.addRecommendedSong({
				id: ranListItem.videoId,
				title: ranListItem.name,
				artist: formatArtistsList(ranListItem.artist),
				duration: ranListItem.duration,
				artwork: findThumbnail(
					ranListItem.thumbnails[ranListItem.thumbnails.length - 1]
						?.url
				),
				durationEdited: formatDuration(ranListItem.duration),
			});
		}
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
		fetch(
			`https://socbyte-backend${
				Math.floor(Math.random() * 10) < 5 ? '-2' : ''
			}.herokuapp.com/msc/?query=today's%20top%20hindi%20songs&key=${
				KEY.API_KEY
			}`
		)
			.then((res) => res.json())
			.then((res) => {
				setLoading(false);
				setRefresing(false);
				setData(shuffleArray(res));
				return res;
			})
			.catch((err) => {
				setLoading(false);
				setRefresing(false);
				// console.log(
				// 	'2.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB',
				// 	err
				// );
			});

		// there were three listeners for fetching songs but since the server load increased so two are removed
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
				}
			>
				{loading ? (
					<View key='randomval1' style={styles.loader}>
						<ActivityIndicator
							animating
							size={38}
							color={COLORS.BLUE_FAV}
						/>
					</View>
				) : (
					<View key='randomval2'>
						{/* HINDI TITLE */}
						<View key='randomval3' style={styles.titleContainer}>
							<Text
								style={whatIsTheme(
									styles.titleDark,
									styles.titleLight
								)}
							>
								Today's Hindi Hits
							</Text>
						</View>

						{data.map((item, index) => (
							<MusicItem
								item={item}
								index={index}
								formatArtistsList={formatArtistsList}
								formatDuration={formatDuration}
								findThumbnail={findThumbnail}
								loadSong={loadSong}
								addSongToQueue={addSongToQueue}
								whatIsTheme={whatIsTheme}
								playerContext={playerContext}
								data={data}
							/>
						))}
					</View>
				)}

				<View key='random11'>
					{/* NEW TITLE */}
					<View key='randomval5' style={styles.titleContainer}>
						<Text
							style={whatIsTheme(
								styles.titleDark,
								styles.titleLight
							)}
						>
							Hindi Hits
						</Text>
					</View>

					<View key='randomval6'>
						<ScrollView
							horizontal
							snapToInterval={Dimensions.get('window').width}
							snapToAlignment='center'
							decelerationRate='fast'
							showsHorizontalScrollIndicator={false}
							style={{
								paddingBottom: 20,
							}}
						>
							{shuffleArray(HindiHits).map((item, index) => {
								return (
									<TouchableOpacity
										style={{
											alignItems: 'center',
										}}
										delayLongPress={1500}
										onLongPress={() => {
											ToastAndroid.showWithGravity(
												'Adding to queue...',
												ToastAndroid.SHORT,
												ToastAndroid.CENTER
											);
											addSongToQueueDirect(
												item,
												HindiHits
											);
										}}
										onPress={() =>
											playSongDirect(item, HindiHits)
										}
										key={item.videoId}
									>
										<View
											style={[
												styles.songCardContainer,
												styles.songCardContainerLarge,
											]}
										>
											<ImageBackground
												source={{
													uri: item.thumbnails,
												}}
												style={[
													styles.songCardImage,
													styles.imageLargeDiff,
												]}
											>
												{playerContext.isPlaying &&
												item.videoId ===
													playerContext.currentTrack
														.id ? (
													<LottieView
														source={require('../../../assets/animations/waves.json')}
														style={{
															width: 200,
															height: 200,
															padding: 0,
															margin: 0,
															backgroundColor: `${COLORS.BLACK}30`,
															position:
																'absolute',
														}}
														autoPlay={true}
														loop={true}
														autoSize={true}
														resizeMode='cover'
													/>
												) : null}
												<Text
													style={styles.durationText}
												>
													{item.formatedDuration}
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
												numberOfLines={2}
											>
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
												numberOfLines={2}
											>
												{item.artist}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>

					{/* ENGLISH TITLE */}
					<View key='randomval7' style={styles.titleContainer}>
						<Text
							style={whatIsTheme(
								styles.titleDark,
								styles.titleLight
							)}
						>
							English Songs
						</Text>
					</View>

					<View key='randomval8'>
						<ScrollView
							horizontal
							snapToInterval={Dimensions.get('window').width}
							snapToAlignment='center'
							decelerationRate='fast'
							showsHorizontalScrollIndicator={false}
							style={{
								paddingBottom: 20,
							}}
						>
							{shuffleArray(EnglishSongs).map((item, index) => {
								return (
									<TouchableOpacity
										style={{
											alignItems: 'center',
										}}
										delayLongPress={1500}
										onLongPress={() => {
											ToastAndroid.showWithGravity(
												'Adding to queue...',
												ToastAndroid.SHORT,
												ToastAndroid.CENTER
											);
											addSongToQueueDirect(
												item,
												EnglishSongs
											);
										}}
										onPress={() =>
											playSongDirect(item, EnglishSongs)
										}
										key={item.videoId}
									>
										<View
											style={[
												styles.songCardContainer,
												styles.songCardContainerLarge,
											]}
										>
											<ImageBackground
												source={{
													uri: item.thumbnails,
												}}
												style={[
													styles.songCardImage,
													styles.imageLargeDiff,
												]}
											>
												{playerContext.isPlaying &&
												item.videoId ===
													playerContext.currentTrack
														.id ? (
													<LottieView
														source={require('../../../assets/animations/waves.json')}
														style={{
															width: 200,
															height: 200,
															padding: 0,
															margin: 0,
															backgroundColor: `${COLORS.BLACK}30`,
															position:
																'absolute',
														}}
														autoPlay={true}
														loop={true}
														autoSize={true}
														resizeMode='cover'
													/>
												) : null}
												<Text
													style={styles.durationText}
												>
													{item.formatedDuration}
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
												numberOfLines={2}
											>
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
												numberOfLines={2}
											>
												{item.artist}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>
				</View>

				<View
					key='randomval5'
					style={styles.lastElementOfTheProfileScrollView}
				></View>
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
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		// paddingBottom: 120,
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
		paddingTop: 3,
		fontFamily: 'roboto',
	},
	cardSongNameLight: {
		maxWidth: 115,
		textAlign: 'center',
		fontSize: 14,
		color: COLORS.BLACK,
		paddingTop: 3,
		fontFamily: 'roboto',
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
		fontFamily: 'roboto',
		textAlign: 'center',
		paddingVertical: 8,
		borderBottomWidth: 0.3,
		borderBottomColor: COLORS.NEXTTODARK,
	},
	titleLight: {
		color: COLORS.BLACK,
		fontSize: 22,
		fontWeight: 'bold',
		fontFamily: 'roboto',
		textAlign: 'center',
		paddingVertical: 8,
		borderBottomWidth: 0.3,
		borderBottomColor: COLORS.BEFOREDARKFORLIGHT,
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
		width: 185,
		height: 185,
		borderRadius: 5,
		overflow: 'hidden',
	},
	songCardContainerLarge: {
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 0,
		marginBottom: 0,
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
