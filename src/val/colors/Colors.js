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
	DARKPLACEHOLDER: '#757575',
	TEXT: '#efefff',
	DARKTEXT: '#252525',
	MID: '#808080',

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

class DarkLight {
	constructor() {
		// variables...
		this.array = [];

		// methods...
		this.RANDOM_COLOR = () => {
			console.table(this.array);
			return this.array[Math.floor(Math.random() * this.array.length)];
		};

		this.colorIsLight = color => {
			let r, g, b, hsp;
			if (color.match(/^rgb/)) {
				color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
				r = color[1];
				g = color[2];
				b = color[3];
			} else {
				color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
				r = color >> 16;
				g = (color >> 8) & 255;
				b = color & 255;
			}

			hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
			//return true if the givne colro in the argument is light...
			// console.log(hsp, hsp > 127.5);
			return hsp < 127.5;
		};
		this.loadColorArray();
	}

	loadColorArray = () => {
		let arr = [];
		for (let i in COLORS) arr.push(COLORS[i]);
		this.array = arr;
		// console.log(this.array);
	};
}

export const ISDARKCOLOR = new DarkLight();

export default COLORS;
