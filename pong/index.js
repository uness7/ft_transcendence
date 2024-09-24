const canvas = document.querySelector("#game-canvas")
const ctx = canvas.getContext("2d");

// global
const aspectRatio = 16 / 9;
const canvasWidth = 1280;
const canvasHeight = canvasWidth / aspectRatio;

// set canvas dimensions
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);


class Vec2 {
	// TODO?: set fields to private, implement accessors
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
}

class Paddle {
	#position;
	#width;
	#height;
	#color;

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
		this.#position = new Vec2(x, (canvasHeight / 2) - (this.#height / 2));
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

	render(ctx) {
		ctx.fillStyle = this.#color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

paddleLeft = new Paddle(15, 100, 20);
paddleRight = new Paddle(15, 100, 20, "right");

document.addEventListener("keydown", event => {
	// w: 		  player left  - move up
	// s: 		  player left  - move down
	if (event.key == "w") {
		paddleLeft.position.y -= 5;
	} else if (event.key == "s") {
		paddleLeft.position.y += 5;
	}

});

const render = () => {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	paddleLeft.render(ctx);
	paddleRight.render(ctx);
}

const mainLoop = () => {
	render();
	requestAnimationFrame(mainLoop);
}


window.addEventListener("load", mainLoop);
