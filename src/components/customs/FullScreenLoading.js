import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import COLORS from '../../val/colors/Colors';

const LoadingAnimation = require('../../assets/animations/loading.json');
const CorrectAnimation = require('../../assets/animations/correct.json');

const FullScreenLoading = props => {
	return (
		<Modal>
			<View style={styles.container}>
				<LottieView source={props.loadingType ? LoadingAnimation : CorrectAnimation} autoPlay loop />
				{/* <View style={styles.loader}>
				<ActivityIndicator size='large' color={COLORS.PRIMARY} animating={true} />
			</View> */}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		backgroundColor: COLORS.DARKPRIMARY,
		alignItems: 'center',
	},
	loader: {
		elevation: 40,
		backgroundColor: COLORS.DARKSECONDARY,
		padding: 40,
		borderRadius: 10,
	},
});

export default FullScreenLoading;
