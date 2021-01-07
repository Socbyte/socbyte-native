import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import COLORS from '../../val/colors/Colors';

const Home = props => {
	return (
		<View>
			<Text style={{ color: COLORS.WHITE }}>HOME</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Home;
