import Vec2 from "../maths/vec2.js";
import Rect2 from "../maths/rect2.js";
import { ctx } from "../misc/canvas.js";
import { clamp } from "../misc/utils.js";
import gameConfig from "../game/config.js";


export default class Paddle {
	constructor() {
		this.size = new Vec2(
			gameConfig.paddle.size.x,
			gameConfig.paddle.size.y
		);
		this.halfHeight = this.size.y / 2;
		this.color = gameConfig.paddle.color;
		this.padding = gameConfig.paddle.padding;
		this.resetSpeed = new Vec2(0, gameConfig.paddle.speed);
		this.speed = this.resetSpeed.clone();
		this.rect;
		this.resetPos;
		this.pos;
		this.boundBox;
	}

	reset = () => {
		this.pos.copy(this.resetPos);
		this.rect = new Rect2(this.pos, this.size);
	}

	updatePosition = () => {
		this.pos.y = clamp(
			this.pos.y,
			this.boundBox.getPosition().y,
			this.boundBox.getSize().y - this.size.y
		);
		this.rect = new Rect2(this.pos, this.size);
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
}
