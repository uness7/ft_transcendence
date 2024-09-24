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

class Ball {
	#position;
	#radius;
	#color;

	constructor(radius=10, color="white") {
		this.#position = new Vec2(canvasWidth / 2, canvasHeight / 2);
		this.#radius = radius;
		this.#color = color;
	}

	get position() {
		return this.#position;
	}

	get radius() {
		return this.#radius;
	}

	moveToCenter() {
		this.#position.setCoordinates(canvasWidth / 2, canvasHeight / 2);
	}

	render(ctx) {
		ctx.fillStyle = this.#color;
		ctx.arc(this.#position.x, this.#position.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

class TextHUD {
	#color;
	#font;
	#text;
	#position

	constructor(text, yPadding, font="48px serif", color="white") {
		this.#color = color;
		this.#font = font;
		this.#position = new Vec2();
		this.#position.y = yPadding;
		this.text = text;
	}

	set text(newText) {
		this.#text = newText.str;
		this.#position.x = canvasWidth / 2 - newText.width / 2;
	}

	render(ctx) {
		ctx.font = this.#font;
		ctx.textAlign = "center";
		ctx.fillStyle = this.#color;
		ctx.fillText(this.#text, this.#position.x, this.#position.y);
	}
}


const paddleLeft = new Paddle(15, 100, 20);
const paddleRight = new Paddle(15, 100, 20, "right");
const ball = new Ball();
const mainText = new TextHUD({str: "Hello", width: ctx.measureText("Hello").width}, 50);
const gameEntities = [paddleLeft, paddleRight, ball, mainText];

document.addEventListener("keydown", event => {
	// w: 		  player left  - move up
	// s: 		  player left  - move down
	if (event.key == "w") {
		paddleLeft.position.y -= 5;
	} else if (event.key == "s") {
		paddleLeft.position.y += 5;
	}

});

// const GameState = {
// 	Menu: "menu",
// 	Serve: "serve",
// 	Play: "play"
// }
// let isPlayerServe = true;
// let currentGameState = GameState.Menu;

const render = entities => {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	entities.forEach(entity => {
		if (entity.render) {
			entity.render(ctx);
		}
	});
}

const mainLoop = () => {
	render(gameEntities);
	requestAnimationFrame(mainLoop);
}


window.addEventListener("load", mainLoop);
