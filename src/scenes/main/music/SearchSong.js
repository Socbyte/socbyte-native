import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
	FlatList,
} from 'react-native';

import { Icon, ListItem, Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';

import { KEY, TrendingSearchQueries, SufflerList } from '../../../val/constants/Constants';
import COLORS from '../../../val/colors/Colors';
import { ActivityIndicator } from 'react-native-paper';
import { usePlayerContext } from './context/PlayerContext';
import ytdl from 'react-native-ytdl';

const SearchSong = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const playerContext = usePlayerContext();

	const [searchText, setSearchText] = useState('');
	const [searchHelperResults, setSearchHelperResults] = useState([]);

	const [searchResults, setSearchResult] = useState([]);
	const [avaliable, setAvaliability] = useState(false);
	const [loading, setLoading] = useState(false);

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
		if (artists.name && artists.name.length > 30) {
			return `${artists.name.substring(0, 25)} and more`;
		}
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
		return `${uptoEqualSign[0]}=w260-h260-l90-rj`;
	}

	async function loadSong(item, artist = '', thumbnail, dur) {
		// console.log(thumbnail, dur);
		// props.navigation.navigate('PlayMusic', {
		// 	item,
		// 	id: item.videoId,
		// 	duration: dur,
		// 	artistList: artist,
		// 	image: thumbnail,
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
			artwork: thumbnail,
			durationEdited: dur,
		});

		// for (let i = 0; i < 3; ++i) {
		// 	let ranListItem = searchResults[Math.floor(Math.random() * searchResults.length)];
		// 	playerContext.addRecommendedSong({
		// 		id: ranListItem.videoId,
		// 		title: ranListItem.name,
		// 		artist: formatArtistsList(ranListItem.artist),
		// 		duration: ranListItem.duration,
		// 		artwork: findThumbnail(
		// 			ranListItem.thumbnails[ranListItem.thumbnails.length - 1]?.url
		// 		),
		// 		durationEdited: formatDuration(ranListItem.duration),
		// 	});
		// 	// console.log(ranListItem);
		// }
	}

	async function addSongToQueue(item, authors = '', formatedDuration, imageFormated) {
		const youtubeURL = `http://www.youtube.com/watch?v=${item.videoId}`;
		const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });

		playerContext.addToQueue({
			id: item.videoId,
			title: item.name,
			artist: authors,
			duration: item.duration,
			url: urls[0].url,
			artwork: imageFormated,
			durationEdited: formatedDuration,
		});

		for (let i = 0; i < 3; ++i) {
			let ranListItem = searchResults[Math.floor(Math.random() * searchResults.length)];
			playerContext.addRecommendedSong({
				id: ranListItem.videoId,
				title: ranListItem.name,
				artist: formatArtistsList(ranListItem.artist),
				duration: ranListItem.duration,
				artwork: findThumbnail(
					ranListItem.thumbnails[ranListItem.thumbnails.length - 1]?.url
				),
				durationEdited: formatDuration(ranListItem.duration),
			});
			// console.log(ranListItem);
		}
	}

	function handleInputChange(value) {
		setAvaliability(false);
		if (value.length > 10) {
			fetch(
				`https://socbyte-backend${
					Math.floor(Math.random() * 10) < 5 ? '-2' : ''
				}.herokuapp.com/searchq/?query=${value.trim()}&key=${KEY.API_KEY}`
			)
				.then(res => res.json())
				.then(res => {
					setSearchHelperResults(res);
					// console.log(res);
				})
				.catch(err => console.log('ERROR FETCHING THE SEARCHRESULTS', err));
		}
		setSearchText(value);
	}

	const showResults = text => {
		setLoading(true);
		setAvaliability(false);
		setSearchResult([]);
		setSearchText(text);

		fetch(
			`https://socbyte-backend${
				Math.floor(Math.random() * 10) < 5 ? '-2' : ''
			}.herokuapp.com/msc/?query=${text.trim()}&key=${KEY.API_KEY}`
		)
			.then(res => res.json())
			.then(res => {
				setSearchResult(res);
				// console.log(res);
				setLoading(false);
				setAvaliability(true);
			})
			.catch(err => {
				console.log('ERROR IN ERR', err);
				setLoading(false);
				setAvaliability(false);
			});
	};

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					borderBottomWidth: 1,
					borderBottomColor: COLORS.MID,
					height: 50,
					backgroundColor: COLORS.BLACK,
				}}>
				<View style={styles.iconContainer}>
					<Icon
						onPress={() => {
							props.navigation.goBack();
						}}
						iconStyle={styles.listIcon}
						name='keyboard-backspace'
						type='material-community-icons'
						size={26}
						color={COLORS.WHITE}
					/>
				</View>
				<TextInput
					style={[
						{
							fontSize: 17,
							flex: 1,
							color: COLORS.WHITE,
						},
					]}
					onSubmitEditing={() => showResults(searchText)}
					autoFocus
					focusable
					keyboardAppearance={whatIsTheme('dark', 'light')}
					returnKeyLabel='ss'
					returnKeyType='search'
					maxLength={100}
					value={searchText}
					onChangeText={handleInputChange}
					placeholder='Search Song...'
					placeholderTextColor={COLORS.MID}
				/>
				<View style={styles.iconContainer}>
					<Icon
						onPress={() => {
							setSearchText('');
						}}
						iconStyle={styles.listIcon}
						name='cancel'
						type='material-community-icons'
						size={26}
						color={COLORS.WHITE}
					/>
				</View>
			</View>

			{loading ? (
				<ActivityIndicator
					style={{ paddingVertical: 30 }}
					size={48}
					color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
				/>
			) : avaliable ? (
				<FlatList
					data={searchResults}
					showsVerticalScrollIndicator={false}
					keyExtractor={item => item.videoId}
					style={{
						paddingBottom: 20,
					}}
					renderItem={({ item, index }) => {
						const artistList = formatArtistsList(item.artist);
						const formatedDuration = formatDuration(item.duration);
						const foundThumbnail = findThumbnail(
							item.thumbnails[item.thumbnails.length - 1]?.url
						);

						return (
							<ListItem
								onPress={() =>
									loadSong(item, artistList, foundThumbnail, formatedDuration)
								}
								key={item.videoId + item.playlistId + index}
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
									marginBottom: index === searchResults.length - 1 ? 90 : 0,
								}}>
								<ImageBackground
									source={{
										uri: foundThumbnail,
									}}
									style={styles.songImage}>
									{playerContext.isPlaying &&
									item.videoId === playerContext.currentTrack.id ? (
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
										numberOfLines={2}
										style={whatIsTheme(styles.textDark, styles.textLight)}>
										{item.name}
									</ListItem.Title>
									<ListItem.Subtitle
										numberOfLines={1}
										style={{ color: COLORS.MID }}>
										{artistList}
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
											foundThumbnail
										)
									}
									name='add'
									type='ionicons'
									size={25}
									color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
								/>
							</ListItem>
						);
					}}
				/>
			) : (
				// <ScrollView
				// 	showsVerticalScrollIndicator={false}
				// 	style={{
				// 		paddingBottom: 20,
				// 	}}>
				// 	{searchResults.map((item, index) )}
				// </ScrollView>
				<ScrollView key='scrollview'>
					<View key='random1'>
						{searchText ? (
							<ListItem
								// bottomDivider
								onPress={() => showResults(searchText)}
								underlayColor={whatIsTheme(COLORS.DARKPRIMARY, COLORS.BEFORELIGHT)}
								containerStyle={{
									backgroundColor: COLORS.TRANSPARENT,
									paddingVertical: 14,
								}}>
								<ListItem.Content style={styles.searchHintConatiner}>
									<ListItem.Title
										numberOfLines={1}
										style={whatIsTheme(styles.textDark, styles.textLight)}>
										{searchText}
									</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						) : null}
					</View>
					<View key='random2'>
						{searchHelperResults.map((result, index) => {
							// console.log(String(result));
							return (
								<ListItem
									// bottomDivider
									onPress={() => showResults(result)}
									key={result + index}
									underlayColor={whatIsTheme(
										COLORS.DARKPRIMARY,
										COLORS.BEFORELIGHT
									)}
									// bottomDivider
									containerStyle={[
										// index === searchResults.length - 1 ? styles.lastElement : null,
										{
											backgroundColor: COLORS.TRANSPARENT,
											paddingVertical: 14,
										},
									]}>
									<ListItem.Content style={styles.searchHintConatiner}>
										<ListItem.Title
											numberOfLines={1}
											style={whatIsTheme(styles.textDark, styles.textLight)}>
											{`${result}`}
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							);
						})}
					</View>
					<View key='random3'>
						{SufflerList.provideARandomOrderSearchHintList().map((result, index) => {
							// console.log(String(result));
							return (
								<ListItem
									// bottomDivider
									onPress={() => showResults(result)}
									key={result + index}
									underlayColor={whatIsTheme(
										COLORS.DARKPRIMARY,
										COLORS.BEFORELIGHT
									)}
									// bottomDivider
									containerStyle={[
										index === TrendingSearchQueries.length - 1
											? styles.lastElement
											: null,
										{
											backgroundColor: COLORS.TRANSPARENT,
											paddingVertical: 14,
										},
									]}>
									<ListItem.Content style={styles.searchHintConatiner}>
										<ListItem.Title
											numberOfLines={1}
											style={whatIsTheme(styles.textDark, styles.textLight)}>
											{`${result}`}
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							);
						})}
					</View>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	listIcon: {
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	searchInput: {
		width: '90%',
	},
	searchText: {
		height: '90%',
		textAlignVertical: 'center',
		textAlign: 'center',
		paddingHorizontal: 8,
		fontSize: 17,
		color: COLORS.WHITE,
		// backgroundColor: COLORS.ACCENT,
	},
	textDark: {
		color: COLORS.BEFORELIGHT,
	},
	textLight: {
		color: COLORS.DARKPRIMARY,
	},
	fullContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},

	songImage: {
		width: 80,
		height: 80,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		borderRadius: 3,
		overflow: 'hidden',
	},
	durationText: {
		// fontSize: 14,
		color: COLORS.WHITE,
		backgroundColor: COLORS.WHITEINDARKVIDIBLE,
		padding: 1,
		borderRadius: 2,
	},
	fullContainer: {
		height: 75,
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},

	searchHintConatiner: {
		paddingVertical: 0,
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},

	lastElement: {
		marginBottom: 90,
	},
});

export default SearchSong;
