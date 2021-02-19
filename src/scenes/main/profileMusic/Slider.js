import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';
import { Slider } from 'react-native-elements';
import COLORS from '../../../val/colors/Colors';
import { useSelector } from 'react-redux';

function CustomSlider() {
	const { theme } = useSelector((state) => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	const { position, duration } = useTrackPlayerProgress();

	const [currposition, setCurrPosition] = useState(0);
	const [totalduration, setTotalDuration] = useState(0);

	useEffect(() => {
		// console.log(position);
		setCurrPosition(position);
		setTotalDuration(duration);
		// console.log(currposition, totalduration);
	});

	const formatTime = (secs) => {
		let minutes = Math.floor(secs / 60);
		let seconds = Math.ceil(secs - minutes * 60);

		if (seconds < 10) seconds = `0${seconds}`;

		return `${minutes}:${seconds}`;
	};

	const handleChange = (val) => {
		TrackPlayer.seekTo(val)
			.then((res) => {
				// console.log('CHANGED SUCCESS');
			})
			.catch((err) => {
				// console.log('CANNOT CHANGE THE SLIDER', err, 'VAL IS THIS THIS', val);
			});
	};

	return (
		<View
			style={{
				// backgroundColor: COLORS.RED,
				width: '82%',
			}}
		>
			<Slider
				style={{ width: 320, height: 40 }}
				minimumValue={0}
				value={position ? position : 0}
				maximumValue={duration}
				minimumTrackTintColor='#ffffff'
				onSlidingComplete={handleChange}
				maximumTrackTintColor='rgba(255, 255, 255, .5)'
				thumbTintColor='#fff'
			/>
			{/* <Slider
						allowTouchTrack={true}
						// animateTransitions={true}
						// animationType='timing'
						style={{ padding: 10 }}
						value={position}
						minimumValue={0}
						maximumValue={duration}
						step={1}
						trackStyle={{
							height: 7,
							backgroundColor: COLORS.TRANSPARENT,
							borderRadius: 100,
						}}
						maximumTrackTintColor={whatIsTheme(COLORS.DARKGLOW, COLORS.DARKFORLIGHT)}
						minimumTrackTintColor={whatIsTheme(COLORS.GREEN, COLORS.PRIMARY)}
						thumbStyle={{
							borderRadius: 100,
							height: 18,
							width: 18,
							backgroundColor: whatIsTheme(COLORS.GREEN, COLORS.PRIMARY),
						}}
						onSlidingComplete={value => handleChange(value)}
					/> */}

			<View style={styles.timeContainer}>
				<Text style={{ color: whatIsTheme(COLORS.MID) }}>
					{formatTime(position)}
				</Text>
				<Text style={{ color: whatIsTheme(COLORS.MID) }}>
					{formatTime(duration)}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	timeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export default CustomSlider;
