import Vec2 from "./maths/vec2.js";
import { ctx, canvasWidth, canvasHeight } from "./canvas.js";


export default class Ball {
	constructor(radius=8, color="white") {
		this.color = color;
		this.radius = radius;
		this.startSpeed = new Vec2(370, 0);
		this.speed = {...this.startSpeed};
		this.startPosition = new Vec2(canvasWidth / 2, canvasHeight / 2);
		this.position = {...this.startPosition};
	}

	reset = () => {
		this.position.set(this.startPosition);
		this.speed.set(this.startSpeed);
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
}
