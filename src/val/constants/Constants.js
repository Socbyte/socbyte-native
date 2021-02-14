const SECERT_KEYS = {
	API_KEY: 'a21f503716271dda7cf5cd685b80b1836ea820e2d180b89ed4af31e17c797e44',
};

const messageChatTypes = {
	CMD: 'cmd',
    CMD2: 'cmd2',
	CHAT: 'chat',
	TEXT: 'text',
	DATE: 'date',
	TIME: 'time',
};

const notificationsType = {
	NEWFOLLOWER: 'newfollower',
};

const TrendingSearchQueries = [
	'hindi songs',
	'hindi song',
	'hindi party songs',
	'hindi romantic songs',
	'hindi new song',
	'hindi songs 2021',
	'hindi dance songs',
	'new hits 2021',
	'new hits',
	'new hits 2021',
	'new hits 2021 remix',
	'new hits hip hop 2021',
	'new hits 97.3',
	'new hits 2021 rap',
	'remix',
	'remix 2021',
	'new song 2021',
	'new songs',
	'new songs 2021',
	'new song',
	'new songs 2021',
	'mylie cyrus new song',
	'english songs',
	'english beat',
	'english songs 2021',
	'english love affair 5sos',
	'english music',
	'sasageyo english',
];

export const TrendingVideoSearchQueries = [
	'podcasts',
	'podcasts true crime',
	'podcasts about life',
	'podcasts to listen to',
	'podcasts joe rogan',
	'podcasts about healthy living',
	'podcasts about self love',
	'stories',
	'stories snowman',
	'stories for kids',
	'stories trapt',
	'stories i forgot',
	'stories brother louie',
	'stories black clover',
	'mashup songs',
	'mashup',
	'mashups',
	'mashup t pain',
	'mashup 2021',
	'mashups that should be songs',
	'top hits 2020',
	'top hits',
	'top hits 2020 playlist',
	'top hits 2021',
	'top hits 2020 clean',
	'top hits 2000',
	'top hits clean',
	'new hits',
	'top podcasts',
	'top podcasts for motivation',
	'joe rogan top podcasts',
	'top podcasts 2020',
	'top podcasts on youtube',
	'top podcasts on spotify',
	'top podcasts to listen to',
	'new hits 2020',
	'new hits 2021',
	'new hits 2020 remix',
	'new hits hip hop 2020',
	'new hits 97.3',
	'new hits 2020 rap',
	'new movies 2020 full movie',
	'new movies',
	'new movies 2020 full movie action',
	'new movies 2020',
	'new movies of songs',
	'new movies songs',
	'new movies 2020 deadpool',
];

const RecommendedSongsList = [
	{
		artist: 'Jay Sean',
		duration: 194000,
		id: 'foEUtbLVBgw',
		artwork:
			'https://lh3.googleusercontent.com/fCdDJdUl6-q_r7o0Pkb6NbaRnna_YrVbxuI7aA6OaZ0RqAaHBFJ-g-thHZ-DPByXxk9gSWoOvYR5r0tz=w245-h245-l90-rj',
		title: 'Kya Yehi Pyar Hai [Remix]',
		url: 'https://bit.ly/3ce7yvN',
	},
	{
		artist: 'Neha Kakkar',
		duration: 256000,
		id: 'g50MrH6LRx8',
		artwork:
			'https://lh3.googleusercontent.com/47S1CxeFKdRgHKGT2I9grZFTPUkiZukAbzpO4fxnKXDhYVj_N-TpSfKCFg4cjf7kYzmPPxBRYCkCgX6b=w245-h245-l90-rj',
		title: 'Yaad Piya Ki Aane Lagi',
		url: 'https://bit.ly/36bmjf4',
	},
	{
		artist: 'Guru Randhawa, Vee, Dhvani Bhanushali, ',
		duration: 208000,
		id: 'r480X_yM3zU',
		artwork:
			'https://lh3.googleusercontent.com/UAHIX7ULqW4HOsoWbRNMBg-pyqmhPoh__MyBlXChBZ8nUlPlhMlNLWQPXcg8kEG9cRiSjOi4MkABy8o=w245-h245-l90-rj',
		title: 'Baby Girl',
		url: 'https://bit.ly/2Yb2mjY',
	},
	{
		artist: 'Arijit Singh',
		duration: 289000,
		id: 'nbwLp_9Pn-c',
		artwork:
			'https://lh3.googleusercontent.com/1gYyxGSjJ4Rkbu21xa9hDKkWTkjl6eeQtVigbNkNC9fEGhWxkHqCetDdGD5Kf-o71JB0vfKgJO_L7as=w245-h245-l90-rj',
		title: 'Saanson Ko (From "Zid")',
		url: 'https://bit.ly/2MrT40I',
	},
	{
		artist: 'Himesh Reshammiya',
		duration: 317000,
		id: 'WLZkB9O8XNA',
		artwork:
			'https://lh3.googleusercontent.com/08TIl7ME5ucxGLVO4bOgtf0ZTPoNvKJ9umIMTr7xHl8k4_o1fg7LJr0akrFaEr9JaxE6RGIfcka-tCk=w245-h245-l90-rj',
		title: 'Jhalak Dikhla Ja',
		url: 'https://bit.ly/3sXZh4Y',
	},
	{
		artist: 'Neha Kakkar, Badshah, ',
		duration: 182000,
		id: 'NOcjMo9u_rI',
		artwork:
			'https://lh3.googleusercontent.com/FNlYD5dElS66siqZMGhq9vLps5cJVBu5G2a3vGREZNnUobQD7KK3Ws8-EjXdyEiImFzIfj2OuMbkHNz7=w245-h245-l90-rj',
		title: 'Garmi (From "Street Dancer 3D") (feat. Varun Dhawan)',
		url: 'https://bit.ly/3c6eGud',
	},
	{
		artist: 'Sumit Goswami',
		duration: 225000,
		id: 'J8xPAONetIU',
		artwork:
			'https://lh3.googleusercontent.com/7pdku5TGM-COWEeCbWHXJJrkkwNZ6xjf4r1zPzyqQxFaAv_WC8P92wkbbeVKFzKgb0iJHbjhKtNqUGxH=w245-h245-l90-rj',
		title: 'Feelings',
		url: 'https://bit.ly/2NzAS5M',
	},
	{
		artist: 'Arijit Singh',
		duration: 285000,
		id: 'Pm0Ga7R-vrM',
		artwork:
			'https://lh3.googleusercontent.com/HDzoC7TKz9WrWyeQoSOgqooZkQspGJZvjrJ7-UIU49a6hJpjzExiQ-ApWDx-FCvjqooycKjbYitZyGee=w245-h245-l90-rj',
		title: 'Tujhe Kitna Chahne Lage (From "Kabir Singh")',
		url: 'https://bit.ly/3chTGAy',
	},
	{
		artist: 'Himesh Reshammiya | Sunidhi Chauhan',
		duration: 272000,
		id: 'A7aaxBcmsQE',
		artwork:
			'https://lh3.googleusercontent.com/nzDCge-O5gvuleyxhi8p9s8hctVJYb39-YPrw1WLa1ZxvxTNZBYPG_X0rOP0tRe9uCl5qk4uQahzT5Y=w245-h245-l90-rj',
		title: 'Ya Ali',
		url: 'https://bit.ly/3phSwcc',
	},
	{
		artist: 'Arijit Singh, Alka Yagnik, ',
		duration: 341000,
		id: 'FOA9iyxsW_A',
		artwork:
			'https://lh3.googleusercontent.com/AT2wfk1PvKjnHO7BzH2i2NkAvqRy_oZNEq48QGBlLJb51AuguCiR3mzp99X1uFdZezAkoSJ2WGjUU-HXZg=w245-h245-l90-rj',
		title: 'Agar Tum Saath Ho',
		url: 'https://bit.ly/36a6uFB',
	},
	{
		artist: 'Himesh Reshammiya, Sunidhi Chauhan, ',
		duration: 293000,
		id: 'CQJTX8xS9jg',
		artwork:
			'https://lh3.googleusercontent.com/eDd3MigEFm2IHmNqn5h7zEKx3ezqC3nRd-SW7fyH9ghg2iRwn5q3BIcwQnng46xxNH3yXZx0TcUVpP2W=w245-h245-l90-rj',
		title: 'Aashiqui Mein Teri',
		url: 'https://bit.ly/3ohCEFp',
	},
	{
		artist: 'Neha Kakkar',
		duration: 283000,
		id: 'M4tM-TgNkaY',
		artwork:
			'https://lh3.googleusercontent.com/dkiMJEVUcXDqUzfpt1ESow7kfmgl_3AbT5L_fLK5PFSV2nFNmz9INJ-JXSMmBfd0-epAHzNI41UA9DpA=w245-h245-l90-rj',
		title: 'Jinke Liye (From "Jaani Ve")',
		url: 'https://bit.ly/3qSLKds',
	},
	{
		artist: 'Agam Kumar Nigam',
		duration: 339000,
		id: '8ocxRuGl34U',
		artwork:
			'https://lh3.googleusercontent.com/9pxr4PpT72Hik5iRrIbpN4mDXUaAcvrUxjWR-CrSAuGdoPDpx4CR9nWPYHkz3QlPkSeEk9XuhQfae1aWUg=w245-h245-l90-rj',
		title: 'Ae Mere Dil Bata Kya Bura',
		url: 'https://bit.ly/3oeCGgX',
	},
	{
		artist: 'Stebin Ben, Kausar Jamot, ',
		duration: 196000,
		id: '_7QTsRc_RfQ',
		artwork:
			'https://lh3.googleusercontent.com/_WckbeqZhynbgUz8ZikAMzS_WzTOk5M4w1KVwrsomijQYv9OHfCn7YjJ_u3qtqWwrUIidCOikfiy0Yi_DA=w245-h245-l90-rj',
		title: 'Mera Mehboob',
		url:
			'https://r6---sn-ci5gup-g2ge.googlevideo.com/videoplayback?expire=1611943045&ei=JPgTYPCePIe43LUPrO-1kAw&ip=27.62.175.212&id=o-AHvyyKulRZZV1X4GBWMYprUgDvyKCRkAoDScZVBbcor-&itag=251&source=youtube&requiressl=yes&mh=ux&mm=31%2C29&mn=sn-ci5gup-g2ge%2Csn-ci5gup-cvhk&ms=au%2Crdu&mv=m&mvi=6&pcm2cms=yes&pl=22&gcr=in&initcwndbps=266250&vprv=1&mime=audio%2Fwebm&ns=81ejrlvHxxiBXDedlbyLC3IF&gir=yes&clen=3477611&dur=194.841&lmt=1603532559269680&mt=1611921182&fvip=6&keepalive=yes&c=WEB&txp=5531432&n=-CLTmOOy6Bhv0-MEW&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgWWI-ik7ZsYLpOuvw5kL-0LEgzNdEy9eVl8U6baEbz-ECIQDU-KYbQHtQKf0oOk-18gwn2vAEyf5sEgxNmcqekidVmw%3D%3D&ratebypass=yes&sig=AOq0QJ8wRQIgJOkVLgY8GlCpVkpq_63sF66AuLVHs7FgBFL54ZYdiksCIQCOP-uQgLTbFRt_yJofcfqi9mhicPmmCO9ix6DMIVS9aQ%3D%3D',
	},
	{
		artist: 'Tony Kakkar',
		duration: 165000,
		id: 'uV6_Jel0Yyo',
		artwork:
			'https://lh3.googleusercontent.com/yADKK1mHVo-D0bwulbiqmQwmR-hHBN_WpY17_UJ4o-2EQN9lTqisRATSFcAoo3gwiqWfx0s6F8z2yEwW=w245-h245-l90-rj',
		title: 'Chocolate',
		url: 'https://bit.ly/3iKp77Q',
	},
	{
		artist: 'Dhvani Bhanushali',
		duration: 205000,
		id: 'sp-pYNYhDRY',
		artwork:
			'https://lh3.googleusercontent.com/FO63QWiGr5HqF5Wurg0qe9p17svN8KYH7vx0nEXKUWjYzSWex-vgsybjO4ctbZTPpq9CQLt9RTOX4l8=w245-h245-l90-rj',
		title: 'Leja Re',
		url: 'https://bit.ly/36a6RQv',
	},
	{
		artist: 'Dr. Jay and Musical Orchestra',
		duration: 352000,
		id: 'zd2vtvGaPGs',
		artwork:
			'https://lh3.googleusercontent.com/ZOFMXXEdWwIF5TivCEFhoramsPac4-RHlK8pVgThGgxZz17soDZptBhy_QhNl8K9N1K6BZ6fBkOSrVg=w245-h245-l90-rj',
		title: 'Happy Anniversary to You in Hindi (feat. Sonu Nigam)',
		url:
			'https://r3---sn-ci5gup-g2ge.googlevideo.com/videoplayback?expire=1611943046&ei=JvgTYLXoCo-I4t4PxoG3mAg&ip=27.62.175.212&id=o-ANKmaQ9qFypdIvjThnyka2u2G7pRQ6X4jlROu_qrgy52&itag=251&source=youtube&requiressl=yes&mh=LO&mm=31%2C29&mn=sn-ci5gup-g2ge%2Csn-ci5gup-cvh6&ms=au%2Crdu&mv=m&mvi=3&pl=22&gcr=in&initcwndbps=266250&vprv=1&mime=audio%2Fwebm&ns=NakmaAojF5MTcogsQau1juEF&gir=yes&clen=5917548&dur=352.061&lmt=1588778987481548&mt=1611921182&fvip=7&keepalive=yes&c=WEB&txp=5531432&n=O7Km_RF-httCT4on4&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgZNGv4CeOGnIfwBzQz0BB4igGhRnyv_MyVyun7xdQNsYCIQC-72X9mPSlR6ZHn7UF6Dky8nI5KHTCJ1qL_66YRUwAog%3D%3D&ratebypass=yes&sig=AOq0QJ8wRgIhAPKjWHednwGDvnH1_ebYhOE_KZd9j3F79iDmMlVRJnFKAiEAnIphx5jZYqY7M_Fh9L-nl3kcP_1gbraX_3247dVflEY%3D',
	},
	{
		artist: 'Anupam Roy',
		duration: 328000,
		id: '9gpMf6zjcQo',
		artwork:
			'https://lh3.googleusercontent.com/0_R3JXDajs90vEHUOU0JnoCKvS6NoXhw3O5_QZJMk6LAvObMon5FTwHHvtTF3Br00TOAqGbzdOHIUsnj=w245-h245-l90-rj',
		title: 'Teri Meri Baatein',
		url: 'https://bit.ly/3a1w94b',
	},
	{
		artist: 'J. Balvin, Willy William, ',
		duration: 186000,
		id: 'uFuAHzHOGYQ',
		artwork:
			'https://lh3.googleusercontent.com/go4837lx-jM17uwyGdk3b7ygdlRr44NiUuw-AkYt3_tS1b9PmCkz7hhW4ZNArhIfblYsrxLdXumo1jMO=w245-h245-l90-rj',
		title: 'Mi Gente',
		url: 'https://bit.ly/3pi0wdc',
	},
	{
		artist: 'Jatin-Lalit',
		duration: 415000,
		id: 'MgGMoAHcM18',
		artwork:
			'https://lh3.googleusercontent.com/7dlEoeNE6aUA7BAcQ15DR8kFtkmOSY3ekLs5zd3Ln52BSQtCIqwWEqVCeH4xwYVqIeDx6mwR0oeA_CwX=w245-h245-l90-rj',
		title: 'Jab Kisiki Taraf Dil',
		url:
			'https://r4---sn-ci5gup-g2ge.googlevideo.com/videoplayback?expire=1611943047&ei=J_gTYJC6Bp2a3LUPmoe82Ac&ip=27.62.175.212&id=o-AP1A4NdAG6lVEJkyIL952KM4I7jgTVuR9RAWhoMfFNCh&itag=251&source=youtube&requiressl=yes&mh=ZE&mm=31%2C29&mn=sn-ci5gup-g2ge%2Csn-ci5gup-cvhk&ms=au%2Crdu&mv=m&mvi=4&pl=22&gcr=in&initcwndbps=266250&vprv=1&mime=audio%2Fwebm&ns=lH6XtnUoBdJsqT8AaDv93l8F&gir=yes&clen=7341119&dur=414.581&lmt=1589101719131818&mt=1611921182&fvip=4&keepalive=yes&c=WEB&txp=5511222&n=AMZhObpUouyMm_lUx&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAIKwxvSqvnU2xOZxIBem9LEU1i722_MDi9C9g6eGTkoxAiEAw_EGEQsZLHCYVt8b4-yXc22jBTWiBmrY9RNVjivfc84%3D&ratebypass=yes&sig=AOq0QJ8wRQIgNVfvXEHe64RGTWwYYrQvFQLv_B5dw1yIf-MzlRtjw5MCIQCqFRjGvwHpu9txhUtICyHIEYy9BeESiMGv5mTGttqdOw%3D%3D',
	},
];

class Suffler {
	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	provideARandomOrderSearchHintList() {
		return this.shuffleArray(TrendingSearchQueries);
	}

	provideARandomOrderSearchHintListForVideos() {
		return this.shuffleArray(TrendingVideoSearchQueries);
	}
}

const SufflerList = new Suffler();

export { messageChatTypes as ChatTypes, notificationsType as NotificationTypes };
export { SECERT_KEYS as KEY };
export { TrendingSearchQueries };
export { SufflerList };
