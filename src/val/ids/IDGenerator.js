/**
 * @author: Sobhan Bera
 * @class
 */
class ID {
	/**
	 * @constructor
	 */
	constructor(length = 3) {
		this.length = length;
		this.salpha = 'abcdefghijklmnopqrstuvwxyz';
		this.lalpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		this.nums = '0123456789';
		this.unite = this.salpha + this.lalpha + this.nums;
	}

	/**
	 * @method for providing a unique id everytime based on the timestamp of current time
	 * @returns id
	 */
	generate() {
		const timestamp = new Date().getTime().toString();
		let id = '';
		for (let i = 0; i < this.length - 1; ++i)
			id += this.unite.charAt(Math.floor(Math.random() * this.unite.length));
		id += timestamp + this.unite.charAt(Math.floor(Math.random() * this.unite.length));
		return { id, timestamp };
	}
}

const IDGenerator = new ID(5);

export default IDGenerator;
