import Paddle from "./paddle.js";
import Rect2 from "../maths/rect2.js";
import Vec2 from "../maths/vec2.js";


export default class PlayerPaddle extends Paddle {
	constructor(boundBox, isLeftSide=true) {
		super();
		this.boundBox = boundBox;

		let x = isLeftSide ? this.padding : this.boundBox.getSize().x - this.padding;
		this.resetPos = new Vec2(
			this.padding,
			this.boundBox.getHalfHeight() - this.halfHeight
		);
		this.pos = this.resetPos.clone();
		this.rect = new Rect2(this.pos, this.size);
	}

	moveUp = (dt) => {
		this.pos.y -= this.speed.y * dt;
	}

	moveDown = (dt) => {
		this.pos.y += this.speed.y * dt;
	}


}
