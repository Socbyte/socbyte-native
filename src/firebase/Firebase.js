import * as Firebase from 'firebase';

// development firebase configs...
// const FirebaseConfig = {
// 	apiKey: 'AIzaSyDHvn6M0Q2m0qGmfnJXIdZKA4CCH9XzPB8',
// 	authDomain: 'telebyte-new.firebaseapp.com',
// 	databaseURL: 'https://telebyte-new-default-rtdb.firebaseio.com',
// 	projectId: 'telebyte-new',
// 	storageBucket: 'telebyte-new.appspot.com',
// 	messagingSenderId: '994660272696',
// 	appId: '1:994660272696:web:dfc9e8ad3b17686b3ab4cd',
// 	measurementId: 'G-G6VM6116PM',
// };

// production firebase configs...
const FirebaseConfig = {
	apiKey: 'AIzaSyDHsOidZTpfq0b-7giPUCIm7SYepsE8eiw',
	authDomain: 'socbyte-production.firebaseapp.com',
	projectId: 'socbyte-production',
	storageBucket: 'socbyte-production.appspot.com',
	messagingSenderId: '277156405205',
	appId: '1:277156405205:web:569ed7ef3dc7653d4ba75c',
	measurementId: 'G-BNLW3FJXFK',
	databaseURL: 'https://socbyte-production-default-rtdb.firebaseio.com/',
};

Firebase.initializeApp(FirebaseConfig);

export default Firebase;
