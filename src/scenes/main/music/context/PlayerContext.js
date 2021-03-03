import React, { createContext, useContext, useEffect, useState } from 'react';
import { ToastAndroid, Vibration } from 'react-native';
import TrackPlayer, {
	STATE_PLAYING,
	STATE_PAUSED,
	STATE_STOPPED,
	CAPABILITY_STOP,
	CAPABILITY_PLAY,
	CAPABILITY_PAUSE,
	CAPABILITY_SKIP,
	CAPABILITY_SKIP_TO_NEXT,
	CAPABILITY_SKIP_TO_PREVIOUS,
	CAPABILITY_JUMP_BACKWARD,
	CAPABILITY_JUMP_FORWARD,
} from 'react-native-track-player';
import { useSelector } from 'react-redux';

export const PlayerContext = createContext({
	isPlaying: false,
	isPaused: false,
	isStopped: false,
	isEmpty: false,
	// isLoading: false,here
	currentTrack: null,
	addToQueue: (track) => null,
	resetPlayer: () => null,
	addRecommendedSong: (song) => null,

	play: (track) => null,
	pause: () => null,
	// loader: () => null,here
	seekTo: (interval) => null,
	seekLevel: () => null,

	rate: 1,
	getRateText: () => null,
	setRate: (level) => null,

	volume: 1,
	setVolume: (level) => null,

	playPrev: () => null,
	playNext: () => null,
	themeProvider: (first, second) => null,

	recommendedSongsList: [],
});

export const PlayerContextProvider = (props) => {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [playerState, setPlayerState] = useState();
	const [currentTrack, setCurrentTrack] = useState({
		id: '',
		title: '',
		artwork: '',
		thumbnail: '',
	});
	// const [isLoading, setLoading] = useState(false);here
	const [volume, setVolume] = useState(1);
	const [rate, setRate] = useState(1);
	const [recommendedSongsList, setRecommendedSongsList] = useState([]);

	const getRateText = () => {
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

	useEffect(() => {
		const listener = TrackPlayer.addEventListener(
			'playback-state',
			({ state }) => {
				setPlayerState(state);
			}
		);

		const playerNext = TrackPlayer.addEventListener(
			'remote-previous',
			async () => {
				playPrev();
			}
		);

		const playerPrev = TrackPlayer.addEventListener(
			'remote-next',
			async () => {
				playNext();
			}
		);

		TrackPlayer.addEventListener('playback-track-changed', async (res) => {
			if (!res.nextTrack) {
				// || currentTrack.id === res.track) {
				// setLoading(false);here
				return;
			}

			await TrackPlayer.getTrack(res.nextTrack)
				.then(async (result) => {
					if (result === null) {
						// setLoading(false);here
						// console.log(isLoading);here
						return;
					}
					setCurrentTrack(result);
				})
				.catch((err) => {
					// setLoading(false);here
				});
		});

		TrackPlayer.addEventListener('remote-stop', () => {
			TrackPlayer.reset();
			setCurrentTrack({ id: '', title: '', artwork: '', thumbnail: '' });
		});

		(async () => {
			await TrackPlayer.getVolume().then((res) => {
				setVolume(res);
			});

			await TrackPlayer.getRate().then((res) => {
				setRate(res);
			});
		})();

		return () => {
			listener.remove();
			playerNext.remove();
			playerPrev.remove();
		};
	}, []);

	// useEffect(() => {
	// 	TrackPlayer.updateOptions({
	// 		stopWithApp: false,
	// 		capabilities: [
	// 			CAPABILITY_PLAY,
	// 			CAPABILITY_PAUSE,
	// 			CAPABILITY_STOP,
	// 			// CAPABILITY_SKIP,
	// 			// CAPABILITY_SKIP_TO_NEXT,
	// 			// CAPABILITY_SKIP_TO_PREVIOUS,
	// 			CAPABILITY_JUMP_BACKWARD,
	// 			CAPABILITY_JUMP_FORWARD,
	// 		],
	// 		jumpInterval: 5,
	// 	});
	// 	TrackPlayer.setupPlayer().then(async res => {});
	// }, []);

	const addToQueue = async (track = {}) => {
		// Vibration.vibrate([50, 100, 250, 50]);
		ToastAndroid.showWithGravity(
			'Adding To Queue.',
			ToastAndroid.SHORT,
			ToastAndroid.CENTER
		);

		try {
			await TrackPlayer.getTrack(track.id).then(async (res) => {
				if (!res /*|| res === null*/) {
					await TrackPlayer.add([track]);
					ToastAndroid.showWithGravity(
						'Song Added To Queue',
						ToastAndroid.SHORT,
						ToastAndroid.CENTER
					);
				} else {
					ToastAndroid.showWithGravity(
						'Song Already Exists In Queue',
						ToastAndroid.SHORT,
						ToastAndroid.CENTER
					);
				}
			});
			// .catch(async (err) => {
			// 	await TrackPlayer.add([track]);
			// 	ToastAndroid.showWithGravity(
			// 		"Song Added To Queue",
			// 		ToastAndroid.SHORT,
			// 		ToastAndroid.CENTER
			// 	);
			// });
		} catch (err) {
			await TrackPlayer.add([track]);
			ToastAndroid.showWithGravity(
				'Song Added To Queue',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
			// } finally {
			// 	ToastAndroid.showWithGravity(
			// 		'Song Added To Queue',
			// 		ToastAndroid.SHORT,
			// 		ToastAndroid.CENTER
			// 	);
		}

		if (!currentTrack) {
			setCurrentTrack(track);
			await TrackPlayer.play();
		}
	};

	const resetPlayer = async () => {
		await TrackPlayer.reset().then((res) => {
			setCurrentTrack({ id: '', title: '', artwork: '', thumbnail: '' });
		});
	};

	const play = async (track) => {
		await pause();

		if (!track) {
			if (currentTrack) await TrackPlayer.play();
			return;
		}

		if (currentTrack && track.id === currentTrack.id) {
			await TrackPlayer.play();
			return;
		}

		// setLoading(true); here
		try {
			//we are checking that the track exists or not...
			await TrackPlayer.getTrack(track.id)
				.then(async (res) => {
					if (!res || res === null) {
						await TrackPlayer.add([track]);
					}
				})
				.catch(async (err) => {
					await TrackPlayer.add([track]);
				});
		} catch (err) {
			//track not found than add it...
			await TrackPlayer.add([track]);
		} finally {
			//and finally set currentTrack to track and
			//play after skiping to the track with id [track.id]
			setCurrentTrack(track);
			// setLoading(false);here
			await TrackPlayer.skip(track.id)
				.then((res) => {})
				.catch(async (err) => {
					// console.log('SSSSSS', err);
					const qu = await TrackPlayer.getQueue();
					// console.log('QUQUQU', qu);
				});
			await TrackPlayer.play()
				.then((res) => {})
				.catch((err) => {
					// console.log('PPPP', err);
				});
		}

		// await TrackPlayer.add([track]);
		// setCurrentTrack(track);
		// await TrackPlayer.play();
		// setLoading(false);
	};

	const pause = async () => {
		await TrackPlayer.pause();
	};

	// const loader = () => {
	// 	setLoading(true);
	// };herehereherehere

	const seekTo = async (interval = 10) => {
		const currPos = await TrackPlayer.getPosition();
		await TrackPlayer.seekTo(currPos + interval);
	};

	const seekLevel = async (level) => {
		// console.log('SEKE');
		// console.log(level);
		if (!Number.isNaN(level)) {
			await TrackPlayer.seekTo(level);
		}
	};

	const setVolumeLevel = (level) => {
		TrackPlayer.setVolume(level).then(async () => {
			await TrackPlayer.getVolume().then((res) => {
				setVolume(res);
			});
		});
	};

	const setRateLevel = (level) => {
		TrackPlayer.setRate(level).then(async () => {
			setRate(level);
		});
	};

	const playPrev = async () => {
		TrackPlayer.skipToPrevious()
			.then((res) => {})
			.catch((err) => {
				// console.log('ERRO WHILE PREVIOUS', err.code);
			});
	};

	const playNext = async () => {
		TrackPlayer.skipToNext()
			.then((res) => {})
			.catch((err) => {
				// console.log('ERRO WHILE NEXT', err.code);
			});
	};

	const arr = [
		{
			sadf: 1,
		},
	];

	const addRecommendedSong = (track) => {
		if (recommendedSongsList.length > 50) {
			return;
		}

		// const recommendIsPresent = recommendedSongsList.filter(song => song.id === track.id);
		if (
			recommendedSongsList.filter((song) => song.id === track.id)
				.length <= 0
		) {
			const temp = recommendedSongsList;
			temp.push(track);
			setRecommendedSongsList(temp);
		}

		// let thresold = 5,
		// 	ranIndex = 0,
		// 	rate = 2;
		// while (thresold-- && rate) {
		// 	ranIndex = Math.floor(Math.random() * list.length);
		// 	if (!recommendedSongsList.includes(list[ranIndex])) {
		// 		setRecommendedSongsList(recommendedSongsList.push(list[ranIndex]));
		// 		rate--;
		// 	}
		// }
	};

	const value = {
		isPlaying: playerState === STATE_PLAYING,
		isPaused: playerState === STATE_PAUSED,
		isStopped: playerState === STATE_STOPPED,
		isEmpty: playerState === null,

		currentTrack,
		play,
		pause,
		// loader,here
		seekTo,
		seekLevel,
		addToQueue,
		resetPlayer,
		addRecommendedSong,

		rate,
		getRateText,
		setRate: setRateLevel,

		volume,
		setVolume: setVolumeLevel,
		playPrev,
		playNext,
		themeProvider: whatIsTheme,
		recommendedSongsList,
	};

	return (
		<PlayerContext.Provider value={value}>
			{props.children}
		</PlayerContext.Provider>
	);
};

export const usePlayerContext = () => useContext(PlayerContext);
