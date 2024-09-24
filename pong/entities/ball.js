import Vec2 from "../maths/vec2.js";
import { canvas, ctx } from "./canvas.js";


export default class Ball {
	constructor(radius, speed, color) {
		this.color = color;
		this.radius = radius;
		this.resetSpeed = speed;
		this.speed = this.resetSpeed.clone();
		this.resetPos = new Vec2(canvas.width / 2, canvas.height / 2);
		this.pos = this.resetPos.clone();
	}

	reset = (leftServe) => {
		this.pos.copy(this.resetPos);
		if (leftServe)
			this.speed.copy(this.resetSpeed);
		else
			this.speed.copy(Vec2.rMul(this.resetSpeed, -1));
	}

	move = (dt) => {
		this.pos = Vec2.rAdd(this.pos, Vec2.rMul(this.speed, dt));
	}

	inverseXSpeed = () => {
		this.speed.x = -this.speed.x;
	}

	inverseYSpeed = () => {
		this.speed.y = -this.speed.y;
	}

	getTopPoint = () => {
		return this.pos - this.radius;
	}

	getBottomPoint = () => {
		return this.pos + this.radius;
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
}
