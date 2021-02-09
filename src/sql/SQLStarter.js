import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('sbSettings.db');

export const databaseInit = () => {
	const databasePromise = new Promise((resolve, reject) => {
		database.transaction(tx => {
			tx.executeSql(
				'CREATE TABLE IF NOT EXISTS sbSettings (key TEXT NOT NULL, value TEXT NOT NULL);',
				[],
				() => {
					resolve();
				},
				(_query, _err) => {
					const errorData = {
						data: _err,
						error: true,
						status: 400,
					};
					reject(errorData);
				}
			);
		});
	});

	return databasePromise;
};

export const insertDatabase = (_key, _value) => {
	const updatePromise = new Promise((resolve, reject) => {
		database.transaction(tx => {
			tx.executeSql(
				`REPLACE INTO sbSettings (key, value) VALUES (?, ?);`,
				[_key, _value],
				(_query, _data) => {
					resolve(_data);
				},
				(_query, _err) => {
					const errorData = {
						data: _err,
						error: true,
						status: 400,
					};
					reject(errorData);
				}
			);
		});
	});

	return updatePromise;
};

export const updateDatabase = (_key, _value) => {
	const updatePromise = new Promise((resolve, reject) => {
		database.transaction(tx => {
			tx.executeSql(
				`UPDATE sbSettings SET value = ? WHERE key = ?;`,
				[_value, _key],
				(_query, _data) => {
					resolve(_data);
				},
				(_query, _err) => {
					const errorData = {
						data: _err,
						error: true,
						status: 400,
					};
					reject(errorData);
				}
			);
		});
	});

	return updatePromise;
};

export const fetchDatabase = () => {
	const fetchPromise = new Promise((resolve, reject) => {
		database.transaction(tx => {
			tx.executeSql(
				'SELECT * FROM sbSettings',
				[],
				(_query, _data) => {
					resolve(_data);
				},
				(_query, _err) => {
					const errorData = {
						data: _err,
						error: true,
						status: 400,
					};
					reject(errorData);
				}
			);
		});
	});

	return fetchPromise;
};

export const deleteTable = () => {
	const deletePromise = new Promise((resolve, reject) => {
		database.transaction(tx => {
			tx.executeSql(
				`DROP TABLE sbSettings;`,
				[],
				(_query, _data) => {
					resolve(_data);
				},
				(_query, _err) => {
					const errorData = {
						data: _err,
						error: true,
						status: 400,
					};
					reject(errorData);
				}
			);
		});
	});

	return deletePromise;
};
