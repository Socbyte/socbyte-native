import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, ListItem, Text } from 'react-native-elements';

const SearchBarHeader = props => {
	const { theme } = useSelector(state => state.settings.settings);
	const whatIsTheme = (f, s) => {
		return !theme || theme === 'd' ? f : s;
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				borderBottomWidth: 1,
				borderBottomColor: COLORS.MID,
				height: 50,
				backgroundColor: COLORS.BLACK,
			}}>
			<View style={styles.iconContainer}>
				<Icon
					onPress={() => {
						props.navigation.goBack();
					}}
					iconStyle={styles.listIcon}
					name='keyboard-backspace'
					type='material-community-icons'
					size={26}
					color={COLORS.WHITE}
				/>
			</View>
			<TextInput
				style={[
					{
						fontSize: 17,
						flex: 1,
						color: COLORS.WHITE,
					},
				]}
				onSubmitEditing={() => showResults(searchText)}
				autoFocus
				focusable
				keyboardAppearance={whatIsTheme('dark', 'light')}
				returnKeyLabel='ss'
				returnKeyType='search'
				maxLength={100}
				value={searchText}
				onChangeText={handleInputChange}
				placeholder='Search Song...'
				placeholderTextColor={COLORS.MID}
			/>
			<View style={styles.iconContainer}>
				<Icon
					onPress={() => {
						setSearchText('');
					}}
					iconStyle={styles.listIcon}
					name='cancel'
					type='material-community-icons'
					size={26}
					color={COLORS.WHITE}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	listIcon: {
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
});

export default SearchBarHeader;
