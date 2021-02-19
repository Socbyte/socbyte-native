/**
 * This component is deprecated
 * @deprecated Component
 * new component is with name MusicPlayer.js in the same directory...
 */
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Image,
	ImageBackground,
	Easing,
	Dimensions,
} from 'react-native';
import {
	Text,
	Icon,
	Slider,
	BottomSheet,
	ListItem,
} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';

import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import Marquee from 'react-native-text-ticker';
import ytdl from 'react-native-ytdl';

import COLORS from '../../../val/colors/Colors';
import { setPlayerDetails, setPlayerState } from '../../../store/PlayerStore';
import { ActivityIndicator } from 'react-native-paper';

// progress bar component...
class SongProgressBar extends ProgressComponent {
	formatTime = (secs) => {
		let minutes = Math.floor(secs / 60);
		let seconds = Math.ceil(secs - minutes * 60);

		if (seconds < 10) seconds = `0${seconds}`;

		return `${minutes}:${seconds}`;
	};

	formatDuration(num) {
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

	render() {
		let progress = this.getProgress() * 100;

		return (
			<>
				<View>
					<Text
						style={[
							styles.timeContainer,
							{
								color: this.props.whatIsTheme(
									COLORS.WHITE,
									COLORS.BLACK
								),
							},
						]}
					>
						{this.formatDuration(
							this.getProgress() * this.props.duration
						)}
					</Text>
				</View>
				<Slider
					allowTouchTrack={true}
					animateTransitions={true}
					animationType='timing'
					style={{ padding: 1, width: '70%', marginVertical: 15 }}
					value={progress}
					minimumValue={0}
					maximumValue={100}
					step={0.01}
					trackStyle={{
						height: 4,
						backgroundColor: COLORS.DARKINLIGHTVIDIBLE,
						borderRadius: 10,
					}}
					maximumTrackTintColor={this.props.whatIsTheme(
						COLORS.DARKGLOW,
						COLORS.DARKFORLIGHT
					)}
					minimumTrackTintColor={this.props.whatIsTheme(
						COLORS.WHITE,
						COLORS.BLACK
					)}
					thumbStyle={{
						borderRadius: 100,
						height: 10,
						width: 10,
						backgroundColor: this.props.whatIsTheme(
							COLORS.WHITE,
							COLORS.BLACK
						),
					}}
					onSlidingComplete={(value) =>
						this.props.handleChange(value)
					}
				/>
			</>
		);
	}
}

const PlayMusic = (props) => {
	const { id, duration, image, item, artistList } = props.route.params;
	const { player, meta } = useSelector((state) => state.player);
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [URL, setURL] = useState('');
	const [loading, setLoading] = useState(true);
	const [playing, setPlaying] = useState(true);
	const [volume, setVolume] = useState(0);
	const [rate, setRate] = useState(0);
	const [showRateChanger, setShowRateChanger] = useState(false);

	useEffect(() => {
		(async () => {
			await TrackPlayer.getVolume().then((res) => {
				setVolume(res);
			});
		})();
	}, []);

	useEffect(() => {
		TrackPlayer.getRate().then((res) => {
			setRate(res);
		});
	}, []);

	const getRate = () => {
		return rate === 0.25
			? '0.25X'
			: rate === 0.5
			? '0.50X'
			: rate === 0.75
			? '0.75X'
			: rate === 1
			? '1X'
			: rate === 1.25
			? '1.25X'
			: rate === 1.5
			? '1.5X'
			: rate === 1.75
			? '1.75X'
			: rate === 2
			? '2X'
			: '-.-';
	};

	const changeVolume = (level) => {
		TrackPlayer.setVolume(level).then(async () => {
			await TrackPlayer.getVolume().then((res) => {
				setVolume(res);
			});
		});
	};

	const changeRateValue = (level) => {
		TrackPlayer.setRate(level).then(async () => {
			setRate(level);
			setShowRateChanger(false);
		});
	};

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

	const handleChange = async (val) => {
		setLoading(true);
		if (!Number.isNaN(val)) {
			TrackPlayer.seekTo((val * (await TrackPlayer.getDuration())) / 100)
				.then(async (res) => {
					setLoading(false);
				})
				.catch(async (err) => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	};

	function pausePlayer() {
		if (meta.playing) {
			TrackPlayer.pause().then(() => {
				dispatch(setPlayerState(false));
				setPlaying(false);
			});
		} else {
			TrackPlayer.play().then(() => {
				dispatch(setPlayerState(true));
				setPlaying(true);
			});
		}
	}

	async function seekBackward() {
		setLoading(true);
		TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 5).then(
			(res) => {
				setLoading(false);
			}
		);
	}

	async function seekForward() {
		setLoading(true);
		TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 10).then(
			(res) => {
				setLoading(false);
			}
		);
	}

	async function skipPrev() {
		setLoading(true);
		TrackPlayer.skipToPrevious().then((res) => {
			setLoading(false);
		});
	}

	async function skipNext() {
		setLoading(true);
		TrackPlayer.skipToNext().then((res) => {
			setLoading(false);
		});
	}

	const dispatch = useDispatch();
	useEffect(() => {
		async function loadThisSongData() {
			const youtubeURL = `http://www.youtube.com/watch?v=${id}`;
			const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
			setURL(urls[0].url);
			// dispatch(addToList(item.videoId, urls[0].url, item));
		}
		// dispatch(addToList(item.videoId, URL, item));
		loadThisSongData();
	}, [id]);

	useEffect(() => {
		TrackPlayer.addEventListener('remote-play', async () => {
			dispatch(setPlayerState(true));
			setPlaying(true);
		});

		TrackPlayer.addEventListener('remote-pause', async () => {
			dispatch(setPlayerState(false));
			setPlaying(false);
		});
		return async function () {};
	}, [URL]);

	useEffect(() => {
		setLoading(true);
		if (URL /*|| songList[item.videoId]*/) {
			// console.log(player.id, item.videoId);
			if (player.id === item.videoId) {
				// console.log('EQUAL');
				if (meta.playing === true) {
					setLoading(false);
					setPlaying(true);
					dispatch(setPlayerDetails({ id: item.videoId }));
				} else {
					TrackPlayer.play().then((res) => {
						// console.log('LOADED', songList[item.videoId].url);
						setLoading(false);
						setPlaying(true);
						dispatch(setPlayerState(true));
						dispatch(
							setPlayerDetails({
								image: image,
								title: item.name,
								id: item.videoId,
								artist: artistList,
								url: URL, //|| songList[item.videoId]?.url,
							})
						);
					});
				}
			} else {
				// TrackPlayer.stop();
				// TrackPlayer.setupPlayer()
				// 	.then(res => {
				TrackPlayer.add({
					id: item.videoId,
					url: URL, //|| songList[item.videoId]?.url,
					title: item.name,
					artist: artistList,
					artwork: image,
				})
					.then((res) => {
						// console.log('JOKER');

						TrackPlayer.play().then((res) => {
							// console.log(item.name);
							// console.log('LOADED', songList[item.videoId].url);
							dispatch(setPlayerState(true));
							dispatch(
								setPlayerDetails({
									image: image,
									title: item.name,
									id: item.videoId,
									artist: artistList,
									url: URL, // || songList[item.videoId]?.url,
								})
							);
							setLoading(false);
							setPlaying(true);
						});
					})
					.catch((err) => {
						// console.log('ERROR ADDING MUSIC', err);
						dispatch(setPlayerDetails({ id: '' }));
						dispatch(setPlayerState(false));
						setLoading(false);
						setPlaying(false);
					});
				// })
				// .catch(err => {
				// 	console.log('ERROR CREATING', err);
				// });
			}
		}
	}, [URL]);

	return (
		<View>
			<View style={styles.imageContainer}>
				{/* SONGS IMAGE WITH IMAGEBACGROUND */}
				<ImageBackground
					source={{ uri: image }}
					blurRadius={1}
					resizeMode='cover'
					style={styles.backgroundImage}
				>
					<View style={styles.navigator}>
						<Icon
							onPress={() => props.navigation.goBack()}
							name='chevron-thin-down'
							type='entypo'
							size={26}
							color={COLORS.WHITE}
							style={styles.navigationIcon}
						/>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-end',
								alignItems: 'center',
								flex: 1,
							}}
						>
							<Slider
								allowTouchTrack={true}
								animateTransitions={true}
								animationType='timing'
								style={{
									padding: 0,
									width: '45%',
								}}
								value={volume}
								minimumValue={0}
								maximumValue={1}
								step={0.01}
								trackStyle={{
									height: 4,
									backgroundColor: COLORS.BLACK,
									borderRadius: 10,
								}}
								maximumTrackTintColor={COLORS.BLACK}
								minimumTrackTintColor={COLORS.WHITE}
								thumbStyle={{
									borderRadius: 100,
									height: 6,
									width: 6,
									backgroundColor: COLORS.WHITE,
								}}
								onSlidingComplete={(value) => {
									changeVolume(value);
									// console.log(value);
								}}
							/>
							<Text
								onPress={() => setShowRateChanger(true)}
								style={styles.rateText}
							>
								{getRate()}
							</Text>
						</View>
					</View>
					<View style={styles.mainImage}>
						<Image source={{ uri: image }} style={styles.image} />
					</View>
				</ImageBackground>

				{/* SONGS NAME */}
				<Marquee
					style={whatIsTheme(
						styles.songTitleDark,
						styles.songTitleLight
					)}
					duration={6500}
					marqueeDelay={4500}
					useNativeDriver={true}
					loop
					isRTL={false}
					isInteraction={false}
					bounce
					easing={Easing.ease}
				>
					{item.name}
				</Marquee>

				<View>
					<Text
						style={{
							color: whatIsTheme(
								COLORS.DARKFORLIGHT,
								COLORS.DARKSECONDARY
							),
						}}
						numberOfLines={1}
					>
						{formatArtistsList(item.artist)}
					</Text>
				</View>

				<View
					style={{
						width: '100%',
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<SongProgressBar
						duration={item.duration}
						whatIsTheme={whatIsTheme}
						handleChange={handleChange}
					/>
					<View>
						<Text
							style={[
								styles.timeContainer,
								{
									color: whatIsTheme(
										COLORS.WHITE,
										COLORS.BLACK
									),
								},
							]}
						>
							{duration}
						</Text>
					</View>
				</View>

				{/* ICONS CONTAINERS FOR NEXT AND PREV SONGS CHANGER */}
				<View style={styles.allIconContainer}>
					<View style={styles.iconContainerSimple}>
						<Icon
							onPress={skipPrev}
							name='skip-previous'
							type='ionicons'
							size={42}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
					<View
						style={whatIsTheme(
							styles.iconContainerDark,
							styles.iconContainerLight
						)}
					>
						{loading ? (
							<ActivityIndicator
								size={48}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : (
							<Icon
								onPress={pausePlayer}
								name={
									playing || meta.playing
										? 'pause'
										: 'play-arrow'
								}
								type={
									playing || meta.playing
										? 'ionicons'
										: 'material-icons'
								}
								size={48}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						)}
					</View>
					<View style={styles.iconContainerSimple}>
						<Icon
							onPress={skipNext}
							name='skip-next'
							type='ionicons'
							size={42}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
				</View>

				<View style={styles.allIconContainer}>
					<View
						style={[styles.iconContainerSimple, styles.marginHori]}
					>
						<Icon
							onPress={seekBackward}
							name='skip-backward'
							type='material-community'
							size={36}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
					<View
						style={whatIsTheme(
							styles.iconContainerDark,
							styles.iconContainerLight
						)}
					>
						{loading ? (
							<ActivityIndicator
								size={48}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : (
							<Icon
								onPress={pausePlayer}
								name={
									playing || meta.playing
										? 'pause'
										: 'play-arrow'
								}
								type={
									playing || meta.playing
										? 'ionicons'
										: 'material-icons'
								}
								size={48}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						)}
					</View>
					<View
						style={[styles.iconContainerSimple, styles.marginHori]}
					>
						<Icon
							onPress={seekForward}
							name='skip-forward'
							type='material-community'
							size={36}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
				</View>

				<BottomSheet
					modalProps={{
						style: {
							backgroundColor: COLORS.TRANSPARENT,
						},
					}}
					isVisible={showRateChanger}
					containerStyle={{
						backgroundColor: whatIsTheme(
							COLORS.DARKSECONDARY,
							COLORS.DARKFORLIGHT
						),
					}}
				>
					<ListItem
						onPress={() => changeRateValue(0.25)}
						containerStyle={{
							backgroundColor:
								rate === 0.25
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								0.25x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						onPress={() => changeRateValue(0.5)}
						containerStyle={{
							backgroundColor:
								rate === 0.5
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								0.50x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						onPress={() => changeRateValue(0.75)}
						containerStyle={{
							backgroundColor:
								rate === 0.75
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								0.75x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						onPress={() => changeRateValue(1)}
						containerStyle={{
							backgroundColor:
								rate === 1
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								Normal
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>

					<ListItem
						onPress={() => changeRateValue(1.25)}
						containerStyle={{
							backgroundColor:
								rate === 1.25
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								1.25x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>

					<ListItem
						onPress={() => changeRateValue(1.5)}
						containerStyle={{
							backgroundColor:
								rate === 1.5
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								1.50x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>

					<ListItem
						onPress={() => changeRateValue(1.75)}
						containerStyle={{
							backgroundColor:
								rate === 1.75
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								1.75x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>

					<ListItem
						onPress={() => changeRateValue(2)}
						containerStyle={{
							backgroundColor:
								rate === 2
									? whatIsTheme(
											COLORS.BLACK,
											COLORS.BEFORELIGHT
									  )
									: whatIsTheme(
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
								2.0x
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>

					<ListItem
						onPress={() => {
							setShowRateChanger(false);
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
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	navigator: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	navigationIcon: {},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	backgroundImage: {
		width: '100%',
		height: 333,
		resizeMode: 'cover',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	mainImage: {
		width: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 6,
	},

	songTitleDark: {
		color: COLORS.WHITE,
		fontSize: 21,
		textAlign: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		fontWeight: 'bold',
	},
	songTitleLight: {
		color: COLORS.BLACK,
		fontSize: 21,
		textAlign: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		fontWeight: 'bold',
	},

	allIconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
	},
	iconContainerDark: {
		borderRadius: 100,
		borderWidth: 2,
		borderColor: COLORS.WHITE,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 30,
		padding: 8,
	},
	iconContainerLight: {
		borderRadius: 100,
		borderWidth: 2,
		borderColor: COLORS.BLACK,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 30,
		padding: 8,
	},
	iconContainerSimple: {
		borderRadius: 100,
		// borderWidth: 2,
		marginHorizontal: 8,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 3,
	},
	marginHori: {
		marginHorizontal: 20,
		padding: 10,
	},

	textDark: {
		color: COLORS.WHITE,
	},
	textLight: {
		color: COLORS.BLACK,
	},
	cancelButton: {
		textAlign: 'center',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		color: COLORS.RED,
	},
	rateText: {
		// paddingHorizontal: 12,
		// paddingVertical: 10,
		marginHorizontal: 10,
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: COLORS.WHITEINDARKVIDIBLE,
		color: COLORS.WHITE,
		borderRadius: 100,
		width: 45,
		height: 45,
		fontSize: 15,
		fontWeight: 'bold',
	},
});

export default PlayMusic;

{
	/* ICONS CONTAINERS FOR NEXT AND PREV SONGS CHANGER */
}
{
	/* <View style={styles.allIconContainer}>
					<View style={styles.iconContainerSimple}>
						<Icon
							onPress={skipPrev}
							name='skip-previous'
							type='ionicons'
							size={42}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
					<View style={whatIsTheme(styles.iconContainerDark, styles.iconContainerLight)}>
						{loading ? (
							<ActivityIndicator
								size={48}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : (
							<Icon
								onPress={pausePlayer}
								name={playing || meta.playing ? 'pause' : 'play-arrow'}
								type={playing || meta.playing ? 'ionicons' : 'material-icons'}
								size={48}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						)}
					</View>
					<View style={styles.iconContainerSimple}>
						<Icon
							onPress={skipNext}
							name='skip-next'
							type='ionicons'
							size={42}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					</View>
				</View> */
}
