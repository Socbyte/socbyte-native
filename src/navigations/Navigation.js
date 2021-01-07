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
			currentUser: firebase.auth().currentUser,
			user: '',
			userData: {},
			showLoading: false,
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
				});
				firebase
					.database()
					.ref('Users')
					.child(this.state.currentUser.displayName)
					.once('value')
					.then(snapshot => {
						if (snapshot.val()) {
							const data = snapshot.val();
							this.setState({
								userData: data,
								showLoading: false,
							});
							this.props.loadUserData(this.state.userData);
						} else {
							this.setState({ user: null });

							alert('user data could not be loaded at this moment.');
							this.setState({ showLoading: false });
						}
					})
					.catch(err => {
						console.log('COME TO NAVIGATION');
						console.log(err);
						this.setState({ user: null });

						this.setState({ showLoading: false });
						alert('error occurred while loading user data please refresh the page.');
					});
			} else {
				this.setState({ user: null });
				// not registered
				this.setState({ showLoading: false });
				// if (isLogout === "logout") {
				// 	window.location.reload();
				// }
			}
		});
	};

	loadSettings = () => {
		fetchDatabase()
			.then(result => {
				const settings = JSON.parse(JSON.stringify(result.rows._array));
				console.log('MAIN SETTINGS', this.props.settings);
				this.props.loadSettings(settings);
			})
			.catch(err => {
				console.log('ERROR WHILE FETCHING DATABASE FROM MAIN SECTION');
				console.log(err.data);
			});
	};

	componentDidMount() {
		this.loadUser();
		this.loadSettings();
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
		} else {
			return <AuthStackNavigation />;
		}
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
