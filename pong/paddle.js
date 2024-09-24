import Vec2 from "./maths/vec2.js";
import Rect2 from "./maths/rect2.js";
import { ctx, canvasWidth, canvasHeight } from "./canvas.js";


export default class Paddle {
	constructor(size, padding, isLeftSide=true, color="white") {
		this.size = size;
		this.color = color;

		let x = 0;
		if (isLeftSide)
			x = padding;
		else
			x = canvasWidth - padding - this.size.x;
		this.startPosition = new Vec2(x, (canvasHeight / 2) - (this.size.y / 2));
		this.position = {...this.startPosition};

		// TODO: remove/refac
		this.speed = 600;
		this.yDirection = 0;
		this.score = 0;
	}

	reset = () => {
		this.position.copy(this.startPosition);
	}

	getRect = () => {
		return new Rect2({...this.position}, {...this.position});
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}
