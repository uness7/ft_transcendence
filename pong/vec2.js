export default class Vec2 {
	// TODO?: set fields to private, implement accessors
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}

	add = (v) => {
		this.x += v.x;
		this.y += v.y;
	}

	// scalaire
	mul = (k) => {
		this.x *= k;
		this.y *= k;
	}

	newMul = (k) => {
		return new Vec2(this.x * k, this.y * k);
	}

	clone = () => {
		return new Vec2(this.x, this.y);
	}
}
