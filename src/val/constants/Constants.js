const SECERT_KEYS = {
	API_KEY: 'a21f503716271dda7cf5cd685b80b1836ea820e2d180b89ed4af31e17c797e44',
};

const messageChatTypes = {
	CMD: 'cmd',
	CHAT: 'chat',
	TEXT: 'text',
	DATE: 'date',
	TIME: 'time',
};

const TrendingSearchQueries = [
	'hindi songs',
	'hindi song',
	'hindi party songs',
	'hindi romantic songs',
	'hindi new song',
	'hindi songs 2020',
	'hindi dance songs',
	'new hits 2020',
	'new hits',
	'new hits 2021',
	'new hits 2020 remix',
	'new hits hip hop 2020',
	'new hits 97.3',
	'new hits 2020 rap',
	'remix',
	'remix 2020',
	'new song 2020',
	'new songs',
	'new songs 2020',
	'new song',
	'new songs 2021',
	'mylie cyrus new song',
	'english songs',
	'english beat',
	'english songs 2020',
	'english love affair 5sos',
	'english music',
	'sasageyo english',
];

const RecommendedSongsList = [
	{
		artist: 'Jay Sean',
		duration: 194000,
		id: 'foEUtbLVBgw',
		image:
			'https://lh3.googleusercontent.com/fCdDJdUl6-q_r7o0Pkb6NbaRnna_YrVbxuI7aA6OaZ0RqAaHBFJ-g-thHZ-DPByXxk9gSWoOvYR5r0tz=w245-h245-l90-rj',
		title: 'Kya Yehi Pyar Hai [Remix]',
		url: 'https://bit.ly/3ce7yvN',
	},
	{
		artist: 'Neha Kakkar',
		duration: 256000,
		id: 'g50MrH6LRx8',
		image:
			'https://lh3.googleusercontent.com/47S1CxeFKdRgHKGT2I9grZFTPUkiZukAbzpO4fxnKXDhYVj_N-TpSfKCFg4cjf7kYzmPPxBRYCkCgX6b=w245-h245-l90-rj',
		title: 'Yaad Piya Ki Aane Lagi',
		url: 'https://bit.ly/36bmjf4',
	},
	{
		artist: 'Guru Randhawa, Vee, Dhvani Bhanushali, ',
		duration: 208000,
		id: 'r480X_yM3zU',
		image:
			'https://lh3.googleusercontent.com/UAHIX7ULqW4HOsoWbRNMBg-pyqmhPoh__MyBlXChBZ8nUlPlhMlNLWQPXcg8kEG9cRiSjOi4MkABy8o=w245-h245-l90-rj',
		title: 'Baby Girl',
		url: 'https://bit.ly/2Yb2mjY',
	},
	{
		artist: 'Arijit Singh',
		duration: 289000,
		id: 'nbwLp_9Pn-c',
		image:
			'https://lh3.googleusercontent.com/1gYyxGSjJ4Rkbu21xa9hDKkWTkjl6eeQtVigbNkNC9fEGhWxkHqCetDdGD5Kf-o71JB0vfKgJO_L7as=w245-h245-l90-rj',
		title: 'Saanson Ko (From "Zid")',
		url: 'https://bit.ly/2MrT40I',
	},
	{
		artist: 'Himesh Reshammiya',
		duration: 317000,
		id: 'WLZkB9O8XNA',
		image:
			'https://lh3.googleusercontent.com/08TIl7ME5ucxGLVO4bOgtf0ZTPoNvKJ9umIMTr7xHl8k4_o1fg7LJr0akrFaEr9JaxE6RGIfcka-tCk=w245-h245-l90-rj',
		title: 'Jhalak Dikhla Ja',
		url: 'https://bit.ly/3sXZh4Y',
	},
	{
		artist: 'Neha Kakkar, Badshah, ',
		duration: 182000,
		id: 'NOcjMo9u_rI',
		image:
			'https://lh3.googleusercontent.com/FNlYD5dElS66siqZMGhq9vLps5cJVBu5G2a3vGREZNnUobQD7KK3Ws8-EjXdyEiImFzIfj2OuMbkHNz7=w245-h245-l90-rj',
		title: 'Garmi (From "Street Dancer 3D") (feat. Varun Dhawan)',
		url: 'https://bit.ly/3c6eGud',
	},
	{
		artist: 'Sumit Goswami',
		duration: 225000,
		id: 'J8xPAONetIU',
		image:
			'https://lh3.googleusercontent.com/7pdku5TGM-COWEeCbWHXJJrkkwNZ6xjf4r1zPzyqQxFaAv_WC8P92wkbbeVKFzKgb0iJHbjhKtNqUGxH=w245-h245-l90-rj',
		title: 'Feelings',
		url: 'https://bit.ly/2NzAS5M',
	},
	{
		artist: 'Arijit Singh',
		duration: 285000,
		id: 'Pm0Ga7R-vrM',
		image:
			'https://lh3.googleusercontent.com/HDzoC7TKz9WrWyeQoSOgqooZkQspGJZvjrJ7-UIU49a6hJpjzExiQ-ApWDx-FCvjqooycKjbYitZyGee=w245-h245-l90-rj',
		title: 'Tujhe Kitna Chahne Lage (From "Kabir Singh")',
		url: 'https://bit.ly/3chTGAy',
	},
	{
		artist: 'Himesh Reshammiya | Sunidhi Chauhan',
		duration: 272000,
		id: 'A7aaxBcmsQE',
		image:
			'https://lh3.googleusercontent.com/nzDCge-O5gvuleyxhi8p9s8hctVJYb39-YPrw1WLa1ZxvxTNZBYPG_X0rOP0tRe9uCl5qk4uQahzT5Y=w245-h245-l90-rj',
		title: 'Ya Ali',
		url: 'https://bit.ly/3phSwcc',
	},
	{
		artist: 'Arijit Singh, Alka Yagnik, ',
		duration: 341000,
		id: 'FOA9iyxsW_A',
		image:
			'https://lh3.googleusercontent.com/AT2wfk1PvKjnHO7BzH2i2NkAvqRy_oZNEq48QGBlLJb51AuguCiR3mzp99X1uFdZezAkoSJ2WGjUU-HXZg=w245-h245-l90-rj',
		title: 'Agar Tum Saath Ho',
		url: 'https://bit.ly/36a6uFB',
	},
	{
		artist: 'Himesh Reshammiya, Sunidhi Chauhan, ',
		duration: 293000,
		id: 'CQJTX8xS9jg',
		image:
			'https://lh3.googleusercontent.com/eDd3MigEFm2IHmNqn5h7zEKx3ezqC3nRd-SW7fyH9ghg2iRwn5q3BIcwQnng46xxNH3yXZx0TcUVpP2W=w245-h245-l90-rj',
		title: 'Aashiqui Mein Teri',
		url: 'https://bit.ly/3ohCEFp',
	},
	{
		artist: 'Neha Kakkar',
		duration: 283000,
		id: 'M4tM-TgNkaY',
		image:
			'https://lh3.googleusercontent.com/dkiMJEVUcXDqUzfpt1ESow7kfmgl_3AbT5L_fLK5PFSV2nFNmz9INJ-JXSMmBfd0-epAHzNI41UA9DpA=w245-h245-l90-rj',
		title: 'Jinke Liye (From "Jaani Ve")',
		url: 'https://bit.ly/3qSLKds',
	},
	{
		artist: 'Agam Kumar Nigam',
		duration: 339000,
		id: '8ocxRuGl34U',
		image:
			'https://lh3.googleusercontent.com/9pxr4PpT72Hik5iRrIbpN4mDXUaAcvrUxjWR-CrSAuGdoPDpx4CR9nWPYHkz3QlPkSeEk9XuhQfae1aWUg=w245-h245-l90-rj',
		title: 'Ae Mere Dil Bata Kya Bura',
		url: 'https://bit.ly/3oeCGgX',
	},
	{
		artist: 'Stebin Ben, Kausar Jamot, ',
		duration: 196000,
		id: '_7QTsRc_RfQ',
		image:
			'https://lh3.googleusercontent.com/_WckbeqZhynbgUz8ZikAMzS_WzTOk5M4w1KVwrsomijQYv9OHfCn7YjJ_u3qtqWwrUIidCOikfiy0Yi_DA=w245-h245-l90-rj',
		title: 'Mera Mehboob',
		url: 'https://bit.ly/36doP4t',
	},
	{
		artist: 'Tony Kakkar',
		duration: 165000,
		id: 'uV6_Jel0Yyo',
		image:
			'https://lh3.googleusercontent.com/yADKK1mHVo-D0bwulbiqmQwmR-hHBN_WpY17_UJ4o-2EQN9lTqisRATSFcAoo3gwiqWfx0s6F8z2yEwW=w245-h245-l90-rj',
		title: 'Chocolate',
		url: 'https://bit.ly/3iKp77Q',
	},
	{
		artist: 'Dhvani Bhanushali',
		duration: 205000,
		id: 'sp-pYNYhDRY',
		image:
			'https://lh3.googleusercontent.com/FO63QWiGr5HqF5Wurg0qe9p17svN8KYH7vx0nEXKUWjYzSWex-vgsybjO4ctbZTPpq9CQLt9RTOX4l8=w245-h245-l90-rj',
		title: 'Leja Re',
		url: 'https://bit.ly/36a6RQv',
	},
	{
		artist: 'Dr. Jay and Musical Orchestra',
		duration: 352000,
		id: 'zd2vtvGaPGs',
		image:
			'https://lh3.googleusercontent.com/ZOFMXXEdWwIF5TivCEFhoramsPac4-RHlK8pVgThGgxZz17soDZptBhy_QhNl8K9N1K6BZ6fBkOSrVg=w245-h245-l90-rj',
		title: 'Happy Anniversary to You in Hindi (feat. Sonu Nigam)',
		url: 'https://bit.ly/3phCkHH',
	},
	{
		artist: 'Anupam Roy',
		duration: 328000,
		id: '9gpMf6zjcQo',
		image:
			'https://lh3.googleusercontent.com/0_R3JXDajs90vEHUOU0JnoCKvS6NoXhw3O5_QZJMk6LAvObMon5FTwHHvtTF3Br00TOAqGbzdOHIUsnj=w245-h245-l90-rj',
		title: 'Teri Meri Baatein',
		url: 'https://bit.ly/3a1w94b',
	},
	{
		artist: 'J. Balvin, Willy William, ',
		duration: 186000,
		id: 'uFuAHzHOGYQ',
		image:
			'https://lh3.googleusercontent.com/go4837lx-jM17uwyGdk3b7ygdlRr44NiUuw-AkYt3_tS1b9PmCkz7hhW4ZNArhIfblYsrxLdXumo1jMO=w245-h245-l90-rj',
		title: 'Mi Gente',
		url: 'https://bit.ly/3pi0wdc',
	},
	{
		artist: 'Jatin-Lalit',
		duration: 415000,
		id: 'MgGMoAHcM18',
		image:
			'https://lh3.googleusercontent.com/7dlEoeNE6aUA7BAcQ15DR8kFtkmOSY3ekLs5zd3Ln52BSQtCIqwWEqVCeH4xwYVqIeDx6mwR0oeA_CwX=w245-h245-l90-rj',
		title: 'Jab Kisiki Taraf Dil',
		url: 'https://bit.ly/3c6zCBn',
	},
];

class Suffler {
	shuffleArray(RecommendedSongsList) {
		for (let i = RecommendedSongsList.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[RecommendedSongsList[i], RecommendedSongsList[j]] = [
				RecommendedSongsList[j],
				RecommendedSongsList[i],
			];
		}
		return RecommendedSongsList;
	}

	provideARandomOrderSearchHintList() {
		for (let i = TrendingSearchQueries.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[TrendingSearchQueries[i], TrendingSearchQueries[j]] = [
				TrendingSearchQueries[j],
				TrendingSearchQueries[i],
			];
		}
		return TrendingSearchQueries;
	}
}

const SufflerList = new Suffler();

export { messageChatTypes as ChatTypes };
export { SECERT_KEYS as KEY };
export { TrendingSearchQueries };
export { RecommendedSongsList, SufflerList };
