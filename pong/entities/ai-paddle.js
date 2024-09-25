import Paddle from "./paddle.js";
import Rect2 from "../maths/rect2.js";
import Vec2 from "../maths/vec2.js";
import gameConfig from "../game/config.js";


export default class AiPaddle extends Paddle {
	constructor(boundBox, isLeftSide=true) {
		super();
		this.size = new Vec2(
			gameConfig.paddle.sizeAi.x,
			gameConfig.paddle.sizeAi.y
		);
		this.halfHeight = this.size.y / 2;
		this.resetSpeed = new Vec2(0, gameConfig.paddle.speedAi);
		this.speed = this.resetSpeed.clone();
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

	checkMovement = (dt, ballPos, chaseBuffer) => {
		if (ballPos.y <= this.pos.y + this.halfHeight - chaseBuffer)
			this.moveUp(dt)
		else if (ballPos.y >= this.pos.y + this.halfHeight + chaseBuffer)
			this.moveDown(dt);
		this.updatePosition();
	}

}
