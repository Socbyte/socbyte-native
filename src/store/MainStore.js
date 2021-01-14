import md5 from 'md5';
import firebase from '../firebase/Firebase';

/*
 *	Action constants and
 *	Action json data provider functions and
 *  Action functions starts here...
 */
export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const SET_PROFILE_IMAGE_URL = 'SET_PROFILE_IMAGE_URL';
/**
 * function dispatchers
 */
export function loadUserData(userData) {
	//here the userData argument is useless and not required just in case may required
	//in future new features that why it is here...

	// return { type: LOAD_USER_DATA, userData: userData };

	return function (dispatch, getStore) {
		const currentUser = firebase.auth().currentUser;
		firebase
			.database()
			.ref('Users')
			.child(currentUser.displayName)
			.on('value', snapshot => {
				const emailHash = md5(currentUser.email);

				if (snapshot.val()) {
					dispatch({
						type: LOAD_USER_DATA,
						userData: snapshot.val(),
						profileImg: `https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`,
					});
					// const val = ImageColors.getColors(snapshot.val().coverImg, {
					// 	fallback: '#000000',
					// 	quality: 'low',
					// 	pixelSpacing: 5,
					// }).then(res => {
					// 	console.log(res.average);
					// 	console.log(res.dominant);
					// 	console.log(res.lightVibrant);
					// 	console.log(res.vibrant);
					// 	console.log(res.darkVibrant);
					// });
					// dispatch({

					// })
				} else {
					alert('user data could not be loaded at this moment.');
					dispatch({ type: LOAD_USER_DATA, userData: snapshot.val() });
				}
			});
	};
}

export function setProfileImageURL(profileImg) {
	return function (dispatch, getStore) {
		const emailHash = md5(getStore().main.user.email);
		const GRAVATARENDPOINT = `https://www.gravatar.com/avatar/${emailHash}.jpg?s=200`;
		dispatch({
			type: SET_PROFILE_IMAGE_URL,
			profileImg: profileImg ? profileImg : GRAVATARENDPOINT ? GRAVATARENDPOINT : profileImg,
		});
	};
	// return { type: SET_PROFILE_IMAGE_URL, profileImg: profileImg };
}

/*
 *  Redux Store state and
 *  reducers enters here...
 */
const initialState = {
	user: {},
};

const MainReducer = (state = initialState, action) => {
	const { type } = action;

	switch (type) {
		case LOAD_USER_DATA:
			return {
				...state,
				user: {
					...state.user,
					...action.userData,
					profileImg: action.profileImg,
				},
			};
		case SET_PROFILE_IMAGE_URL:
			return {
				...state,
				user: {
					...state.user,
					profileImg: action.profileImg,
				},
			};
	}
	return state;
};

export default MainReducer;
