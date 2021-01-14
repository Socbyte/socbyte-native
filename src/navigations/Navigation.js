import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import DrawerNavigation from './MainDrawerNavigation';
import AuthStackNavigation from './AuthNavigation';

import firebase from '../firebase/Firebase';
import FullScreenLoading from '../components/customs/FullScreenLoading';

import { loadUserData } from '../store/MainStore';
import { fetchDatabase } from '../sql/SQLStarter';
import { loadSettings } from '../store/Settings';

class MainNavigation extends Component {
	constructor() {
		super();
		this.state = {
			user: '',
			currentUser: firebase.auth().currentUser,
			userData: {},

			showLoading: true,
			loadingType: true,
		};
	}

	loadUser = () => {
		this.setState({ showLoading: true });
		firebase.auth().onAuthStateChanged(fuser => {
			if (fuser) {
				this.setState({
					user: fuser,
					currentUser: firebase.auth().currentUser,
					showLoading: false,
				});

				//here the user argument is useless and not required just in case may required
				//in future new features that why it is here...
				this.props.loadUserData(this.state.user);

				// firebase
				// 	.database()
				// 	.ref('Users')
				// 	.child(firebase.auth().currentUser.displayName)
				// 	.on('value', snapshot => {
				// 		if (snapshot.val()) {
				// 			this.setState({
				// 				user: fuser,
				// 				currentUser: firebase.auth().currentUser,
				// 				userData: snapshot.val(),
				// 				showLoading: false,
				// 			});

				// 			this.props.loadUserData(this.state.userData);
				// 		} else {
				// 			this.setState({ user: null, showLoading: false });

				// 			alert('user data could not be loaded at this moment.');
				// 		}
				// 	});

				// .then(snapshot => {
				// 	if (snapshot.val()) {
				// 		const data = snapshot.val();
				// 		this.setState({
				// 			userData: data,
				// 			showLoading: false,
				// 		});
				// 		this.props.loadUserData(this.state.userData);
				// 	} else {
				// 		this.setState({ user: null });

				// 		alert('user data could not be loaded at this moment.');
				// 		this.setState({ showLoading: false });
				// 	}
				// })
				// .catch(err => {
				// 	console.log('COME TO NAVIGATION');
				// 	console.log(err);
				// 	this.setState({ user: null });

				// 	this.setState({ showLoading: false });
				// 	alert(
				// 		'error occurred while loading user data. servers are busy currently. sorry for the trouble.'
				// 	);
				// });
			} else {
				// not registered
				this.setState({ user: null, showLoading: false });
			}
		});
	};

	// loadSettings = () => {
	// 	this.setState({ showLoading: true });
	// 	return fetchDatabase()
	// 		.then(result => {
	// 			const settings = JSON.parse(JSON.stringify(result.rows._array));
	// 			// console.log('MAIN SETTINGS', settings);
	// 			this.props
	// 				.loadSettings(settings)
	// 				.then(() => {
	// 					this.setState({ showLoading: false });
	// 				})
	// 				.catch(err => {
	// 					this.setState({ showLoading: false });
	// 				});
	// 		})
	// 		.catch(err => {
	// 			console.log('ERROR WHILE FETCHING DATABASE FROM MAIN SECTION');
	// 			console.log(err);
	// 			this.setState({ showLoading: false });
	// 		});
	// };

	componentDidMount() {
		// this.loadSettings().then(res => console.log('DONE'));
		this.loadUser();
	}

	logOutCurrentUser = () => {
		firebase
			.auth()
			.signOut()
			.then(res => {
				this.setState({
					user: '',
				});
			})
			.catch(err => {});
	};

	render() {
		if (this.state.showLoading) {
			return <FullScreenLoading loadingType={this.state.loadingType} />;
		} else if (this.state.user) {
			return <DrawerNavigation />;
		} else if (!this.state.user) {
			return <AuthStackNavigation />;
		}

		// return <FullScreenLoading loadingType={this.state.loadingType} />;
	}
}
const mapStateToProps = state => {
	return {
		user: state.main.user,
		settings: state.settings.settings,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		loadUserData: userData => {
			dispatch(loadUserData(userData));
		},
		loadSettings: settings => {
			dispatch(loadSettings(settings));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
