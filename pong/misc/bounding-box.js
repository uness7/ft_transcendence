import Vec2 from "../maths/vec2.js";


export default class BoundingBox {
	constructor(rect) {
		this.box = rect;
		this.topBound = rect.position.y;
		this.bottomBound = this.topBound + rect.size.y;
		this.leftBound = rect.position.x;
		this.rightBound = this.leftBound + rect.size.x;
	}

	getSize = () => {
		return this.box.size;
	}

	getPosition = () => {
		return this.box.position;
	}

	getHalfWidth = () => {
		return this.getSize().x / 2;
	}

	getHalfHeight = () => {
		return this.getSize().y / 2;
	}

	getCenter = () => {
		return new Vec2(this.getHalfWidth(), this.getHalfHeight());
	}

	isBeyondTopBound = (position) => {
		return position.y <= this.topBound;
	}

	isBeyondBottomBound = (position) => {
		return position.y >= this.bottomBound;
	}

	isBeyondLeftBound = (position) => {
		return position.x <= this.leftBound;
	}

	isBeyondRightBound = (position) => {
		return position.x >= this.rightBound;
	}
}
