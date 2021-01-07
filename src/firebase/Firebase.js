import * as firebase from 'firebase'

const firebaseConfig = {
	apiKey: 'AIzaSyDHvn6M0Q2m0qGmfnJXIdZKA4CCH9XzPB8',
	authDomain: 'telebyte-new.firebaseapp.com',
	databaseURL: 'https://telebyte-new-default-rtdb.firebaseio.com',
	projectId: 'telebyte-new',
	storageBucket: 'telebyte-new.appspot.com',
	messagingSenderId: '994660272696',
	appId: '1:994660272696:web:dfc9e8ad3b17686b3ab4cd',
	measurementId: 'G-G6VM6116PM',
}

firebase.initializeApp(firebaseConfig)

export default firebase
