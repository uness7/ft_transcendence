import Vec2 from "./maths/vec2.js";
import { canvas, ctx } from "./canvas.js";


export default class Ball {
	constructor(radius, color="white") {
		this.color = color;
		this.radius = radius;
		this.startSpeed = new Vec2(370, 0);
		this.speed = this.startSpeed.clone();
		this.startPosition = new Vec2(canvas.width / 2, canvas.height / 2);
		this.position = this.startPosition.clone();
	}

	reset = () => {
		this.position.copy(this.startPosition);
		this.speed.copy(this.startSpeed);
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
}
