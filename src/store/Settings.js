/*
 *	Action constants and
 *	Action json data provider functions and
 *  Action functions starts here...
 */
export const LOAD_SETTINGS = 'LOAD_SETTINGS';
export const UPDATE_SETTING = 'UPDATE_SETTING';
/**
 * function dispatchers
 */
export function updateSettings(key, value) {
	return { type: UPDATE_SETTING, key: key, value: value };
}

export function loadSettings(values) {
	return { type: LOAD_SETTINGS, values: values };
}

/*
 *  Redux Store state and
 *  reducers enters here...
 */
const initialState = {
	settings: {},
};

const SettingsReducer = (state = initialState, action) => {
	const { type } = action;

	switch (type) {
		case LOAD_SETTINGS:
			const finalSetting = {};
			const setting = action.values;
			for (let i in setting) finalSetting[setting[i].key] = setting[i].value;

			return {
				...state,
				settings: {
					...state.settings,
					...finalSetting,
				},
			};
		case UPDATE_SETTING:
			const updatedSettings = state.settings;
			updatedSettings[action.key] = action.value;

			return {
				...state,
				settings: {
					...state.settings,
					...updatedSettings,
				},
			};
	}
	return state;
};

export default SettingsReducer;
