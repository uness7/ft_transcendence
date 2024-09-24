import { canvas, ctx, canvasWidth, canvasHeight } from "./canvas.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js"
import TextHUD from "./text-hud.js"


export default class Pong {

	constructor() {
		this.timeBeforeGameStarts = 3;

		this.entities = {
			paddleLeft: new Paddle(15, 100, 20),
			paddleRight: new Paddle(15, 100, 20, "right"),
			ball: new Ball(),
			gameStateText: new TextHUD(
				`Game starts in ${this.timeBeforeGameStarts}...`, 50)
		};

	}

	render = () => {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		Object.values(this.entities).forEach(entity => entity.render());
	}

	#gameStartTimer = () => {
		return new Promise(resolve => {
			let timeToWait = this.timeBeforeGameStarts;
			const timer = setInterval(() => {
				this.entities.gameStateText.text = `Game starts in ${timeToWait}...`;
				this.render();
				timeToWait--;
				if (timeToWait < 0)
				{
					clearInterval(timer);
					resolve();
				}
			}, 1_000);
		});
	}

	load = () => {
		this.#gameStartTimer()
			.then(() => {
				delete this.entities.gameStateText;
				this.render();
			});
	}

}

// set canvas dimensions
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);

document.addEventListener("keydown", event => {
	// w: 		  player left  - move up
	// s: 		  player left  - move down
	if (event.key == "w") {
		paddleLeft.position.y -= 5;
	} else if (event.key == "s") {
		paddleLeft.position.y += 5;
	}

});

const game = new Pong();

window.addEventListener("load", game.load);
