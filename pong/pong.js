import { canvas, ctx, canvasWidth, canvasHeight } from "./canvas.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js"
import TextHUD from "./text-hud.js"
import Vec2 from "./vec2.js";


const GameState = {
	Menu: "menu",
	Play: "play"
}

export default class Pong {

	constructor() {
		// game config
		this.timeBeforeGameStarts = 1;
		this.targetFPS = 60;
		this.frameDuration = 1_000 / this.targetFPS;
		this.timeLastFrame = 0;

		this.state = GameState.Menu;
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
				this.state = GameState.Play;
				this.gameLoop();
			});
	}

	gameLoop = () => {
		// process inputs -> update -> render
		if (!this.timeLastFrame)
			this.timeLastFrame = performance.now();
		const timeNow = performance.now();
		const dt = timeNow - this.timeLastFrame;
		this.timeLastFrame = timeNow;
	
		this.entities.ball.position.x += 400 * dt / 1000;
		this.render();
		requestAnimationFrame(this.gameLoop);
	}
}

// set canvas dimensions
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);



const game = new Pong();

document.addEventListener("keydown", event => {
	// w: 		  player left  - move up
	// s: 		  player left  - move down
	if (event.key == "w") {
		game.entities.paddleLeft.position.y -= 10;
	} else if (event.key == "s") {
		paddleLeft.position.y += 5;
	}

});

window.addEventListener("load", game.load);
