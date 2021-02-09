import React from 'react';
import { Modal, Easing, Animated, Dimensions } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { connect, useSelector } from 'react-redux';

import COLORS from '../../../val/colors/Colors';

class ThemeToggler extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			colorIndex: 0,
			diameter: new Animated.Value(0),
			visible: true,
		};
	}

	whatIsTheme(f, s) {
		return !this.props.theme || this.props.theme === 'd' ? f : s;
	}

	colors = [
		this.whatIsTheme(COLORS.BLACK, COLORS.WHITE),
		this.whatIsTheme(COLORS.WHITE, COLORS.BLACK),
	];
	// colors = [COLORS.WHITE, COLORS.BLACK];

	color = index => this.colors[index % this.colors.length];

	startAnimation() {
		Animated.timing(this.state.diameter, {
			toValue: Dimensions.get('window').height * 2,
			duration: 800,
			useNativeDriver: false,
			// easing: Easing.ease,
		}).start(() => {
			this.state.diameter.setValue(0);

			this.setState({
				colorIndex: this.state.colorIndex + 1,
			});

			if (this.state.colorIndex < 3) {
				this.startAnimation();
			} else {
				this.props.setValueFalse(false);
				this.setState({
					visible: false,
					// colorIndex: this.state.colorIndex + 1,
				});
			}
		});
	}
	componentDidMount() {
		this.setState({
			visible: true,
			colorIndex: 0,
		});
		this.startAnimation();
	}

	render() {
		const { colorIndex, diameter } = this.state;

		return (
			<Modal visible={this.state.visible}>
				<TouchableRipple
					style={{
						flex: 1,
						// width: '100%',
						// height: '100%',
						zIndex: 1,
						backgroundColor: this.color(colorIndex),
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Animated.View
						style={{
							backgroundColor: this.color(colorIndex + 1),
							width: diameter,
							height: diameter,
							borderRadius: diameter,
							position: 'absolute',
							zIndex: 2,
						}}
					/>
				</TouchableRipple>
			</Modal>
		);
	}
}

// const mapStateToProps = state => {
// 	return {
// 		theme: state.settings.settings.theme,
// 	};
// };

export default ThemeToggler;
// export default connect(mapStateToProps)(ThemeToggler);
