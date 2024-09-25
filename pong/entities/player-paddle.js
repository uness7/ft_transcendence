import Paddle from "./paddle.js";
import Rect2 from "../maths/rect2.js";
import Vec2 from "../maths/vec2.js";


export default class PlayerPaddle extends Paddle {
	constructor(boundBox, isLeftSide=true) {
		super();
		this.boundBox = boundBox;

		const x = isLeftSide
			? this.padding
			: boundBox.getSize().x - this.padding - this.size.x;
		this.resetPos = new Vec2(
			x,
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
