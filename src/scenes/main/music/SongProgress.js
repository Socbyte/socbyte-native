import React from 'react';
import { View } from 'react-native';
import { ProgressComponent } from 'react-native-track-player';
import { Text, Slider } from 'react-native-elements';
import { PlayerContext } from './context/PlayerContext';
import COLORS from '../../../val/colors/Colors';

function formatDuration(time) {
	const hrs = Math.floor(time / 3600);
	time %= 3600;
	const mins = Math.floor(time / 60);
	const secs = Math.floor(time % 60);
	const minsStr = String(mins).padStart(2, '0');
	const sec = String(secs).padStart(2, '0');
	if (hrs > 0) return `${hrs}:${minsStr}:${sec}`;
	return `${minsStr}:${sec}`;
}

class SongProgressSlider extends ProgressComponent {
	static contextType = PlayerContext;

	get currentPosition() {
		return formatDuration(this.state.position);
	}

	render() {
		return (
			<>
				<View>
					<Text
						style={{
							color: this.context.themeProvider(COLORS.WHITE, COLORS.BLACK),
						}}>
						{this.currentPosition}
					</Text>
				</View>
				<Slider
					allowTouchTrack={true}
					animateTransitions={true}
					animationType='timing'
					style={{ padding: 1, width: '65%', marginVertical: 15 }}
					minimumValue={0}
					maximumValue={this.context.currentTrack.duration / 1000}
					value={this.state.position}
					step={0.01}
					onSlidingComplete={value => {
						// console.log(value);
						this.context.seekLevel(value);
					}}
					trackStyle={{
						height: 4,
						backgroundColor: COLORS.DARKINLIGHTVIDIBLE,
						borderRadius: 10,
					}}
					minimumTrackTintColor={this.context.themeProvider(COLORS.WHITE, COLORS.BLACK)}
					maximumTrackTintColor={this.context.themeProvider(
						COLORS.DARKGLOW,
						COLORS.DARKFORLIGHT
					)}
					thumbStyle={{
						borderRadius: 100,
						height: 10,
						width: 10,
						backgroundColor: this.context.themeProvider(COLORS.WHITE, COLORS.BLACK),
					}}
				/>
				<View>
					<Text
						style={{
							color: this.context.themeProvider(COLORS.WHITE, COLORS.BLACK),
						}}>
						{this.context.currentTrack.durationEdited}
					</Text>
				</View>
			</>
		);
	}
}

export class MiniplayerSongProgressSlider extends ProgressComponent {
	static contextType = PlayerContext;

	render() {
		return (
			<View style={{ padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
				<Slider
					disabled
					animateTransitions={true}
					animationType='timing'
					style={{ width: '100%', padding: 0, margin: 0, paddingTop: 0 }}
					minimumValue={0}
					maximumValue={this.context.currentTrack.duration / 1000}
					value={this.state.position}
					step={0.01}
					onSlidingComplete={value => {
						this.context.seekLevel(value);
					}}
					trackStyle={{
						height: 2,
						backgroundColor: COLORS.DARKINLIGHTVIDIBLE,
						borderRadius: 10,
					}}
					thumbStyle={{
						borderRadius: 10,
						height: 2,
						width: 2,
						backgroundColor: this.context.themeProvider(COLORS.WHITE, COLORS.BLACK),
					}}
					minimumTrackTintColor={this.context.themeProvider(COLORS.WHITE, COLORS.BLACK)}
					maximumTrackTintColor={this.context.themeProvider(
						COLORS.DARKGLOW,
						COLORS.DARKFORLIGHT
					)}
				/>
			</View>
		);
	}
}

export default SongProgressSlider;
