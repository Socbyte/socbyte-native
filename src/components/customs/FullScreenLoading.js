import React from 'react';
import { Modal, StyleSheet, View, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

import COLORS from '../../val/colors/Colors';
import { useSelector } from 'react-redux';

const LoadingAnimationLight = require('../../assets/animations/loadingLight.json');
const LoadingAnimationDark = require('../../assets/animations/loadingDark.json');
const CorrectAnimation = require('../../assets/animations/correct.json');

const FullScreenLoading = props => {
	const { theme } = useSelector(state => state.settings.settings);

	return (
		<Modal>
			<View style={!theme || theme === 'd' ? styles.containerDark : styles.containerLight}>
				<LottieView
					source={
						props.loadingType
							? theme === 'l'
								? LoadingAnimationLight
								: LoadingAnimationDark
							: CorrectAnimation
					}
					autoPlay
					loop
				/>
				{/* <View style={styles.loader}>
					<ActivityIndicator size='large' color={theme === 'd' ? COLORS.GREEN : COLORS.PRIMARY} animating={true} />
				</View> */}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	containerDark: {
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		backgroundColor: COLORS.DARKPRIMARY,
		alignItems: 'center',
	},
	containerLight: {
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		backgroundColor: COLORS.WHITE,
		alignItems: 'center',
	},
	loaderDark: {
		elevation: 40,
		backgroundColor: COLORS.DARKPRIMARY,
		padding: 40,
		borderRadius: 10,
	},
	loaderLight: {
		elevation: 40,
		backgroundColor: COLORS.WHITE,
		padding: 40,
		borderRadius: 10,
	},
});

export default FullScreenLoading;
