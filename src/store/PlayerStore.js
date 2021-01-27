/*
 *	Action constants and
 *	Action json data provider functions and
 *  Action functions starts here...
 */
export const SET_PLAYING_STATE = 'SET_PLAYING_STATE';
export const SET_PLAYER_DETAIL = 'SET_PLAYER_DETAIL';
export const ADD_PLAYER_DETAIL = 'ADD_PLAYER_DETAIL';
export const ADD_RECOMMENDED_SONGS = 'ADD_RECOMMENDED_SONGS';

/**
 * function dispatchers
 */
export function setPlayerState(value) {
	return { type: SET_PLAYING_STATE, data: value };
}

export function setPlayerDetails(value) {
	return { type: SET_PLAYER_DETAIL, data: value };
}

export function addToList(id, url, data) {
	return { type: ADD_PLAYER_DETAIL, id, url, data };
}

export function addRecommendedSongs(data) {
	return { type: ADD_RECOMMENDED_SONGS, recommended: data };
}

/*
 *  Redux Store state and
 *  reducers enters here...
 */
const initialState = {
	player: {
		id: '',
	},
	meta: {
		playing: true,
	},
	songList: {},
	recommended: [],
};

const PlayerReducer = (state = initialState, action) => {
	const { type } = action;

	switch (type) {
		case SET_PLAYING_STATE:
			return {
				...state,
				meta: {
					playing: action.data,
				},
			};
		case SET_PLAYER_DETAIL:
			return {
				...state,
				player: {
					...state.player,
					...action.data,
				},
			};
		case ADD_PLAYER_DETAIL:
			return {
				...state,
				songList: {
					...state.songList,
					[action.id]: {
						...state.songList[action.id],
						...action.data,
						url: action.url,
					},
				},
			};
		case ADD_RECOMMENDED_SONGS:
			return {
				...state,
				recommended: {
					...action.recommended,
				},
			};
	}
	return state;
};

export default PlayerReducer;
