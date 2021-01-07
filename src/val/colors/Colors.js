const COLORS = {
	PRIMARY: '#0F60B6',
	SECONDARY: '#3D5A80',
	ACCENT: '#EE6C4D',

	BEFORELIGHT: '#eaeaea',
	DARKFORLIGHT: '#909090',
	BEFOREDARKFORLIGHT: '#5e5e5e',

	DARKPRIMARY: '#151515',
	DARKSECONDARY: '#262626',
	DARKGLOW: '#333333',
	NEXTTODARK: '#181818',
	SOMEWHATDARKALPHA: 'rgba(0, 0, 0, 0.55)',

	PLACEHOLDER: '#bfbfbf',
	TEXT: '#efefff',

	PINK: '#EF476F',
	YELLOW: '#FFD166',
	GREEN: '#06D6A0',
	BLUE: '#118AB2',
	RED: '#ef4040',
	ORANGE: '#EE6C4D',
	CYAN: '#E0FBFC',
	WHITE: '#ffffff',
	BLACK: '#000000',
	GREY: '#afafaf',

	LIGHT_BLUE: '#98C1D9',
	DARK_BLUE: '#3D5A80',
	CADET_BLUE: '#293241',

	TRANSPARENT: 'transparent' || '#0000',
};

export const RANDOM_COLOR = () => {
	let array = [];
	for (let i in COLOR) array.push(COLOR[i]);
	console.table(array);
	return array[Math.floor(Math.random() * array.length)];
};

export default COLORS;
