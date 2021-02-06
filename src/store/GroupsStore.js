import firebase from '../firebase/Firebase';
import { RESET } from './MainStore';

/*
 *	Action constants and
 *	Action json data provider functions and
 *  Action functions starts here...
 */
export const LOAD_GROUPS_DATA = 'LOAD_GROUPS_DATA';
export const LOAD_LAST_MESSAGE = 'LOAD_LAST_MESSAGE';
/**
 * function dispatchers
 */
export function loadGroupsData(groupsList) {
	return function (dispatch, getStore) {
		// console.log(groupsList);
		for (let i in groupsList) {
			firebase
				.database()
				.ref('Groups')
				.child(groupsList[i].id)
				.on('value', snap => {
					dispatch({
						type: LOAD_GROUPS_DATA,
						id: groupsList[i].id,
						groupData: snap.val(),
					});
				});
		}
	};
}

export function loadGroupsLastMessage(groupsList) {
	return function (dispatch, getStore) {
		// console.log(groupsList);
		for (let i in groupsList) {
			firebase
				.database()
				.ref('Messages')
				.child(groupsList[i].id)
				.limitToLast(1)
				.on('value', snap => {
					dispatch({
						type: LOAD_LAST_MESSAGE,
						id: groupsList[i].id,
						groupData: snap.val(),
					});
				});
		}
	};
}

/*
 *  Redux Store state and
 *  reducers enters here...
 */
const initialState = {
	group: {},
};

const GroupsReducer = (state = initialState, action) => {
	const { type } = action;

	switch (type) {
		case LOAD_GROUPS_DATA:
			return {
				...state,
				group: {
					...state.group,
					[action.id]: action.groupData,
				},
			};
		case LOAD_LAST_MESSAGE:
			return {
				...state,
				group: {
					...state.group,
					[action.id]: {
						...state.group[action.id],
						lastMsg: action.groupData,
					},
				},
			};
		case RESET:
			return {
				group: {},
			};
	}
	return state;
};

export default GroupsReducer;
