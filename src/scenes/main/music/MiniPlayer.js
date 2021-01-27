import React from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	View,
	Text,
	Image,
	Easing,
	ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Marquee from 'react-native-text-ticker';
import { useSelector } from 'react-redux';

import { usePlayerContext } from './context/PlayerContext';
import COLORS from '../../../val/colors/Colors';

const MiniPlayer = props => {
	const playerContext = usePlayerContext();

	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	if ((playerContext.isEmpty || !playerContext.currentTrack) && !playerContext.isLoading) {
		return null;
	}

	return (
		<TouchableOpacity onPress={() => props.navigation.navigate('MainPlayMusicScreen')}>
			<View style={styles.mainContainer}>
				<View
					style={[
						styles.miniplayer,
						{
							borderTopColor: whatIsTheme(COLORS.DARKPRIMARY, COLORS.DARKFORLIGHT),
						},
					]}>
					<View style={styles.imageContainer}>
						<Image
							style={styles.image}
							source={{ uri: playerContext?.currentTrack?.artwork }}
						/>
					</View>
					<View style={styles.textContainer}>
						<Marquee
							style={whatIsTheme(styles.songTitleDark, styles.songTitleLight)}
							duration={6500}
							marqueeDelay={4500}
							useNativeDriver={true}
							loop
							isRTL={false}
							isInteraction={false}
							bounce
							easing={Easing.ease}>
							{playerContext.currentTrack?.title
								? playerContext.currentTrack?.title
								: 'Loading....'}
						</Marquee>
						<Text numberOfLines={1} style={styles.subtitleText}>
							{playerContext.currentTrack?.artist
								? playerContext.currentTrack?.artist
								: 'Loading....'}
						</Text>
					</View>
					<View style={styles.iconContainer}>
						{playerContext.isPaused ? (
							<Icon
								onPress={() => playerContext.play()}
								name='controller-play'
								type='entypo'
								size={33}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : playerContext.isPlaying ? (
							<Icon
								onPress={() => playerContext.pause()}
								name='pause'
								type='ant-design'
								size={33}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : playerContext.isLoading ? (
							<ActivityIndicator
								size={33}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : null}
					</View>
					{/* <View style={[styles.iconContainer, { padding: 6 }]}>
						{playerContext.isPlaying ||
						playerContext.isPaused ||
						playerContext.isLoading ? (
							<Icon
								onPress={() => playerContext.seekTo(10)}
								name='spinner-rotate-forward'
								type='fontisto'
								size={23}
								color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
							/>
						) : null} */}
					{/* <Icon
							onPress={() => playerContext.seekTo(10)}
							name='spinner-rotate-forward'
							type='fontisto'
							size={23}
							color={whatIsTheme(COLORS.WHITE, COLORS.BLACK)}
						/> */}
					{/* </View> */}
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		// position: 'relative',
	},
	miniplayer: {
		height: 53,
		paddingTop: 3,
		paddingBottom: 4,
		paddingHorizontal: 5,
		borderTopWidth: 0.3,
		flexDirection: 'row',
		alignItems: 'flex-start',
		// backgroundColor: COLORS.RED,
	},
	imageContainer: {
		padding: 3,
	},
	image: {
		height: 43,
		width: 43,
		borderRadius: 3,
	},
	textContainer: {
		flexDirection: 'column',
		marginHorizontal: 5,
		flex: 1,
	},

	songTitleDark: {
		fontSize: 16,
		textAlign: 'center',
		paddingVertical: 2,
		fontWeight: 'bold',
		color: COLORS.WHITE,
	},
	songTitleLight: {
		fontSize: 16,
		textAlign: 'center',
		paddingVertical: 2,
		fontWeight: 'bold',
		color: COLORS.BLACK,
	},
	subtitleText: {
		fontSize: 14,
		color: COLORS.MID,
	},

	iconContainer: {
		padding: 4,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 6,
	},
});

export default MiniPlayer;
