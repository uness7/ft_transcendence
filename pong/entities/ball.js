import Vec2 from "../maths/vec2.js";
import { ctx } from "../misc/canvas.js";


export default class Ball {
	constructor(position, radius, speed, color) {
		this.color = color;
		this.radius = radius;
		this.resetSpeed = speed;
		this.speed = this.resetSpeed.clone();
		this.resetPos = position;
		this.pos = this.resetPos.clone();
	}

	reset = (leftServe) => {
		this.pos.copy(this.resetPos);
		if (leftServe)
			this.speed.copy(this.resetSpeed);
		else
			this.speed.copy(Vec2.rScale(this.resetSpeed, -1));
	}

	move = (dt) => {
		this.pos.add(Vec2.rScale(this.speed, dt));
	}

	inverseXSpeed = () => {
		this.speed.x = -this.speed.x;
	}

	inverseYSpeed = () => {
		this.speed.y = -this.speed.y;
	}

	getTopPoint = () => {
		return new Vec2(this.pos.x, this.pos.y - this.radius);
	}

	getBottomPoint = () => {
		return new Vec2(this.pos.x, this.pos.y + this.radius);
	}

	isMovingLeft = () => {
		return this.speed.x <= 0;
	}

	isMovingRight = () => {
		return this.speed.x >= 0;
	}

	isMovingUp = () => {
		return this.speed.y <= 0;
	}

	isMovingDown = () => {
		return this.speed.y >= 0;
	}

	changeMagnitude = (k) => {
		this.speed.scale(k);
	}

	changeRotationAndDirection = (angle) =>{
		this.inverseXSpeed();
		const rotation = Vec2.rRotate(this.resetSpeed, angle);
		rotation.y *= -1;
		const orientation = this.isMovingRight() ? 1 : -1;
		rotation.x *= orientation;
		this.speed = rotation;
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
}
