import { KEY, SufflerList } from '../constants/Constants';

class Query {
	musicQuery(query, setData, callback) {
		return new Promise((resolve, reject) => {
			fetch(
				`https://socbyte-backend.herokuapp.com/msc/?query=${query}&key=${KEY.API_KEY}`
			)
				.then((res) => res.json())
				.then((res) => {
					const data = SufflerList.shuffleArray(res);
					setData(data);
					resolve(data);
					callback();
					return res;
				})
				.catch((err) => {
					// console.log('---.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB', err);
					callback();
					reject(err);
				});
		});
	}

	videoQuery(query, setData, callback) {
		return new Promise((resolve, reject) => {
			fetch(
				`https://socbyte-backend.herokuapp.com/video/?query=${query}&key=${KEY.API_KEY}`
			)
				.then((res) => res.json())
				.then((res) => {
					const data = SufflerList.shuffleArray(res);
					setData(data);
					resolve(data);
					callback();
					return res;
				})
				.catch((err) => {
					// console.log('000.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB', err);
					callback();
					reject(err);
				});
		});
	}

	searchHintQuery(query, setData, callback) {
		return new Promise((resolve, reject) => {
			fetch(
				`https://socbyte-backend.herokuapp.com/searchq/?query=${query}&key=${KEY.API_KEY}`
			)
				.then((res) => res.json())
				.then((res) => {
					const data = SufflerList.shuffleArray(res);
					setData(data);
					resolve(data);
					callback();
					return res;
				})
				.catch((err) => {
					// console.log('123.ERROR LOADING MUSIC DATA IN MUSIC HOME TAB', err);
					callback();
					reject(err);
				});
		});
	}
}

const SongQuery = new Query();

export default SongQuery;
