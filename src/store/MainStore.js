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
	return { type: LOAD_USER_DATA, userData: userData };
}

export function setProfileImageURL(profileImg) {
	return { type: SET_PROFILE_IMAGE_URL, profileImg: profileImg };
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
				user: action.userData,
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
