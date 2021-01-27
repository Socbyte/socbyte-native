import React, { Component, useEffect, useRef, useState, TouchableWithoutFeedback } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ScrollView,
	Image,
	ToastAndroid,
	ActivityIndicator,
	Animated,
	Easing,
} from 'react-native';
import { Text, Icon, Image as ElementImage, Slider } from 'react-native-elements';
import { useSelector } from 'react-redux';

const sounds = require('../../../assets/sounds/message_tone.mp3');

import TrackPlayer, {
	STATE_PLAYING,
	ProgressComponent,
	STATE_PAUSED,
	CAPABILITY_PLAY,
	CAPABILITY_PAUSE,
	CAPABILITY_STOP,
} from 'react-native-track-player';

import Header from '../../../components/customs/Header/Header';
import COLORS from '../../../val/colors/Colors';
import CustomSlider from './Slider';

const { width, height } = Dimensions.get('screen');
const imageWidth = width * 0.7;
const imageHeight = imageWidth * 1.2;

class ProgressBar extends ProgressComponent {
	formatTime = secs => {
		let minutes = Math.floor(secs / 60);
		let seconds = Math.ceil(secs - minutes * 60);

		if (seconds < 10) seconds = `0${seconds}`;

		return `${minutes}:${seconds}`;
	};

	render() {
		// const position = this.formatTime(Math.floor(this.state.position));
		// const duration = this.formatTime(Math.floor(this.state.duration));
		// const info = position + ' / ' + duration;

		let progress = this.getProgress() * 100;
		// let buffered = this.getBufferedProgress() * 100;
		// buffered -= progress;
		// if (buffered < 0) buffered = 0;

		// this.props.setVal((this.getProgress() * 100).toFixed(2));

		return (
			<>
				<Slider
					allowTouchTrack={true}
					// animateTransitions={true}
					// animationType='timing'
					style={{ padding: 10, width: '80%', marginVertical: 15 }}
					value={progress}
					minimumValue={0}
					maximumValue={100}
					step={0.01}
					trackStyle={{
						height: 7,
						backgroundColor: COLORS.TRANSPARENT,
						borderRadius: 100,
					}}
					maximumTrackTintColor={this.props.whatIsTheme(
						COLORS.DARKGLOW,
						COLORS.DARKFORLIGHT
					)}
					minimumTrackTintColor={this.props.whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
					thumbStyle={{
						borderRadius: 100,
						height: 18,
						width: 18,
						backgroundColor: this.props.whatIsTheme(COLORS.GREEN, COLORS.PRIMARY),
					}}
					onSlidingComplete={value => this.props.handleChange(value)}
				/>

				<View>
					<Text
						style={[
							styles.timeContainer,
							{
								color: COLORS.MID,
							},
						]}>
						{`${(this.getProgress() * 100).toFixed(2)}%`}
					</Text>
				</View>
			</>
		);
	}
}

const ProfileMusic = props => {
	const { username, coverImg, sound } = props.route.params;

	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const [loading, setLoading] = useState(true);
	const [playing, setPlaying] = useState(false);
	// const [progress, setProgress] = useState(0);

	const handleChange = async val => {
		setLoading(true);
		if (!Number.isNaN(val)) {
			TrackPlayer.seekTo((val * (await TrackPlayer.getDuration())) / 100)
				.then(async res => {
					setLoading(false);
				})
				.catch(async err => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	};

	const cdRotate = useRef(new Animated.Value(0)).current;
	const interpolatedValue = cdRotate.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
		extrapolate: false,
	});

	function runScallingAnimation() {
		cdRotate.setValue(0);
		Animated.sequence([
			Animated.timing(cdRotate, {
				toValue: 1,
				duration: 6500,
				delay: 0,
				useNativeDriver: false,
				easing: Easing.linear,
			}),
		]).start(() => {
			runScallingAnimation();
		});
	}

	useEffect(() => {
		runScallingAnimation();
	}, []);

	function pausePlayer() {
		if (playing) {
			TrackPlayer.pause().then(async () => {
				setPlaying(false);
			});
		} else {
			TrackPlayer.play().then(async () => {
				setPlaying(true);
			});
		}
	}

	async function seekBackward() {
		TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 5);
	}

	async function seekForward() {
		TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 5);
	}

	useEffect(() => {
		TrackPlayer.updateOptions({
			stopWithApp: false,
			capabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP],
		});

		TrackPlayer.addEventListener('remote-play', async () => {
			setPlaying(true);
		});

		TrackPlayer.addEventListener('remote-pause', async () => {
			setPlaying(false);
		});

		TrackPlayer.getState().then(async res => {
			if (res === STATE_PAUSED) {
				TrackPlayer.play().then(async () => {
					setLoading(false);
					setPlaying(true);
				});
			} else if (res === STATE_PLAYING) {
				setLoading(false);
				setPlaying(true);
			} else {
				TrackPlayer.add({
					id: '1',
					url: sound,
					title: 'Profile Song',
					artist: username,
					artwork: coverImg,
					album: '',
					genre: '',
					date: '',
				})
					.then(async () => {
						setLoading(true);

						TrackPlayer.play().then(async () => {
							setLoading(false);
							setPlaying(true);
						});
					})
					.catch(err => {
						setLoading(true);

						// TrackPlayer.play().then(async () => {
						// 	setLoading(false);
						// 	setPlaying(true);
						// });
					});
			}
		});

		return async function () {
			//leaved
			// console.log('LEAVED');
		};
	}, []);

	return (
		<View
			style={{
				alignItems: 'center',
				flex: 1,
				backgroundColor: COLORS.TRANSPARENT,
			}}>
			<Header
				{...props}
				leftButton={() => {
					props.navigation.toggleDrawer();
				}}
				back
				headerTitle={'Profile Music'}
			/>
			<View style={styles.mainContainer}>
				<Animated.View
					style={[
						whatIsTheme(styles.imageContainerDark, styles.imageContainerLight),
						{
							transform: [
								{
									rotateZ: interpolatedValue,
								},
							],
						},
						{
							marginVertical: 50,
						},
					]}>
					<Animated.Image
						style={{
							width: 200,
							height: 200,
							borderRadius: 200,
						}}
						source={{
							uri: coverImg,
						}}
					/>
				</Animated.View>

				<ProgressBar
					// setVal={prog => {
					// 	setProgress(prog);
					// 	console.log(progress);
					// }}
					whatIsTheme={whatIsTheme}
					handleChange={handleChange}
				/>

				<View style={styles.controllers}>
					<Icon
						onPress={seekBackward}
						containerStyle={styles.controls}
						name='controller-fast-backward'
						type='entypo'
						size={40}
						color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
					/>
					{loading ? (
						<ActivityIndicator
							style={styles.controls}
							size={40}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					) : (
						<Icon
							onPress={pausePlayer}
							containerStyle={styles.controls}
							name={playing ? 'pause' : 'play-arrow'}
							type='material-icon'
							size={40}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/>
					)}
					<Icon
						onPress={seekForward}
						containerStyle={styles.controls}
						name='controller-fast-forward'
						type='entypo'
						size={40}
						color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
					/>
				</View>
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
	mainContainer: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
	},
	imageContainerDark: {
		marginVertical: 20,
		elevation: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 250,
		borderWidth: 2,
		borderColor: COLORS.DARKSECONDARY,
	},
	imageContainerLight: {
		marginVertical: 20,
		elevation: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 250,
		borderWidth: 2,
		borderColor: COLORS.TRANSPARENT,
	},
	controllers: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '70%',
	},
	controls: {
		paddingHorizontal: 10,
	},
	timeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '70%',
		marginTop: -15,
		marginBottom: 15,
	},
});

export default ProfileMusic;

// "react-native-track-player": "^2.0.0-rc13",
