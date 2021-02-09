import { StyleSheet } from 'react-native';
import COLORS from '../colors/Colors';

const GlobalStyles = StyleSheet.create({
	buttonPrimary: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: COLORS.PRIMARY,
		borderRadius: 3,
		elevation: 3,
	},
	buttonSecondary: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: COLORS.SECONDARY,
		borderRadius: 3,
		elevation: 3,
	},
});

export default GlobalStyles;
