import Vec2 from "./vec2.js";
import { ctx, canvasWidth, canvasHeight } from "./canvas.js";


export default class Ball {
	#position;
	#radius;
	#color;

	constructor(radius=8, color="white") {
		this.#position = new Vec2(canvasWidth / 2, canvasHeight / 2);
		this.#radius = radius;
		this.#color = color;
		this.startingSpeed = new Vec2(-370, 0);
		this.speed = this.startingSpeed.clone();
	}

	get position() {
		return this.#position;
	}

	get radius() {
		return this.#radius;
	}

	moveToCenter = () => {
		this.#position.x = canvasWidth / 2;
		this.#position.y = canvasHeight / 2;
	}

	render = () => {
		ctx.fillStyle = this.#color;
		ctx.beginPath();
		ctx.arc(this.#position.x, this.#position.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
}
