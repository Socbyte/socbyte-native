import firebase from '../firebase/Firebase';

/*
 *	Action constants and
 *	Action json data provider functions and
 *  Action functions starts here...
 */
export const LOAD_CHAT_PARTICULAR_GROUP = 'LOAD_CHAT_PARTICULAR_GROUP';
/**
 * function dispatchers
 */
export function loadGroupChats(id, data) {
	// return function (dispatch, getStore) {
	// 	dispatch({ type: LOAD_CHAT_PARTICULAR_GROUP, id: id, messages: data })
	// };
	return { type: LOAD_CHAT_PARTICULAR_GROUP, id: id, messages: data };
}

/*
 *  Redux Store state and
 *  reducers enters here...
 */
const initialState = {
	messages: {},
};

const MessagesReducer = (state = initialState, action) => {
	const { type } = action;

	switch (type) {
		case LOAD_CHAT_PARTICULAR_GROUP:
			const data = {
				...state,
				messages: {
					...state.messages,
					[action.id]: {
						...state.messages[action.id],
						...action.messages,
					},
				},
			};
			// console.log('DATA = ', data);
			return {
				...state,
				messages: {
					...state.messages,
					[action.id]: {
						...state.messages[action.id],
						...action.messages,
					},
				},
			};
	}
	return state;
};

export default MessagesReducer;
