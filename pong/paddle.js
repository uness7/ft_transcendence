import Vec2 from "./vec2.js";
import { ctx, canvasWidth, canvasHeight } from "./canvas.js";


// Paddle -> Player ? Or player instantiates a paddle
export default class Paddle {
	#position;
	#width;
	#height;
	#color;

	// TODO: change right/left to (bool)isLeftSide
	constructor(width, height, padding, side="left", color="white") {
		this.#width = width; 
		this.#height = height;
		this.#color = color;
		let x = 0;
		if (side === "left")
			x = padding;
		else if (side === "right")
			x = canvasWidth - padding - this.#width;
		else
		throw new Error(`Invalid argument: side must be 'left' or 'right'`);
		this.startPosition = new Vec2(x, (canvasHeight / 2) - (this.#height / 2));
		this.#position = this.startPosition.clone();
		this.speed = 600;
		this.yDirection = 0;
		this.score = 0;
	}

	get position() {
		return this.#position;
	}

	get width() {
		return this.#width;
	}

	get height() {
		return  this.#height;
	}

	reset = () => {
		this.position.set(this.startPosition);
	}

	render = () => {
		ctx.fillStyle = this.#color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}
