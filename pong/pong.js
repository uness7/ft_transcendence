import { canvas, ctx, canvasWidth, canvasHeight } from "./canvas.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js"
import TextHUD from "./text-hud.js"
import Vec2 from "./vec2.js";


const GameState = {
	Menu: "menu",
	Play: "play",
	Serve: "serve",
}

const timer = (timeToWait) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, timeToWait * 1000);
	});
}

const clamp = (value, min, max) => {
	if (value <= min)
		return min;
	else if (value >= max)
		return max;
	else
		return value;
}

export default class Pong {

	constructor() {
		// game config
		this.timeBeforeGameStarts = 1;
		this.targetFPS = 60;
		this.frameDuration = 1_000 / this.targetFPS;
		this.timeLastFrame = 0;
		this.isLeftServe = false;

		this.state = GameState.Menu;
		this.entities = {
			paddleLeft: new Paddle(15, 100, 20),
			paddleRight: new Paddle(15, 100, 20, "right"),
			ball: new Ball(),
			gameStateText: new TextHUD(
				`Game starts in ${this.timeBeforeGameStarts}...`,
				new Vec2(canvasWidth / 2, 50)),
			leftScoreText: new TextHUD('0', new Vec2(canvasWidth / 4, 50)),
			rightScoreText: new TextHUD('0', new Vec2(3 * canvasWidth / 4, 50)),
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
				// delete this.entities.gameStateText;
				this.state = GameState.Serve;
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
	
		const ball = this.entities.ball;
		const paddleLeft = this.entities.paddleLeft;
		const paddleRight = this.entities.paddleRight;

		if (this.state === GameState.Play) {
			this.entities.gameStateText.text = "Play";
	
			// update positions
			paddleLeft.position.y += paddleLeft.yDirection * dt / 1000;
			paddleLeft.yDirection = 0;

			ball.position.add(ball.speed.newMul(dt / 1000));

			// check round finished
			if (ball.position.x < 0) {
				paddleRight.score++;
				this.entities.rightScoreText.text = paddleRight.score.toString();
				this.state = GameState.Serve;
				this.isLeftServe = true;
			} else if (ball.position.x > canvasWidth) {
				console.log("won");
				paddleLeft.score++;
				this.entities.leftScoreText.text = paddleLeft.score.toString();
				this.state = GameState.Serve;
				this.isLeftServe = false;
			}
			
			// collision with top/bottom
			if (ball.position.y - ball.radius <= 0
			|| ball.position.y + ball.radius >= canvasHeight) {
				ball.speed.y = -ball.speed.y;
			}


			// left paddle collision
			if (ball.position.x - ball.radius >= paddleLeft.position.x
			&& ball.position.x - ball.radius <= paddleLeft.position.x + paddleLeft.width) {
				const paddleDivide = paddleLeft.height / 3;
				if (ball.position.y >= paddleLeft.position.y
				&& ball.position.y <= paddleLeft.position.y + paddleDivide) {
					const ballTmp = new Vec2(-ball.speed.x, -370);
					ball.speed.set(ballTmp);
				} else if (ball.position.y >= paddleLeft.position.y
					&& ball.position.y <= paddleLeft.position.y + paddleDivide * 2) {
						const ballTmp = new Vec2(-ball.speed.x, 0);
						ball.speed.set(ballTmp);
				} else if (ball.position.y >= paddleLeft.position.y
					&& ball.position.y <= paddleLeft.position.y + paddleDivide * 3) {
						const ballTmp = new Vec2(-ball.speed.x, 370);
						ball.speed.set(ballTmp);
				}
			}
			
			// right paddle collision
			if (ball.position.x + ball.radius >= paddleRight.position.x
				&& ball.position.x + ball.radius <= paddleRight.position.x + paddleRight.width
				&& ball.position.y >= paddleRight.position.y
				&& ball.position.y <= paddleRight.position.y + paddleRight.height) {
					ball.speed.mul(-1);
			}

			// naive ai right paddle
			paddleRight.position.y = ball.position.y - paddleRight.height / 2;

			// keep paddles inside the canvas
			paddleRight.position.y = clamp(paddleRight.position.y, 0, canvasHeight - paddleRight.height);
			paddleLeft.position.y = clamp(paddleLeft.position.y, 0, canvasHeight - paddleLeft.height);

		} else if (this.state === GameState.Serve) {
			if (this.isLeftServe) {
				this.entities.gameStateText.text = "Left Serve";
				ball.speed.mul(-1);
			}
			else {
				this.entities.gameStateText.text = "Right Serve";
				ball.speed.set(ball.startingSpeed);
			}
			ball.moveToCenter();
			paddleLeft.position.set(paddleLeft.startPosition);
			paddleRight.position.set(paddleRight.startPosition);
			// timer(2)
			// 	.then(() => {
					this.state = GameState.Play;
				// });
		}


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
		game.entities.paddleLeft.yDirection += -game.entities.paddleLeft.speed;
	} else if (event.key == "s") {
		game.entities.paddleLeft.yDirection -= -game.entities.paddleLeft.speed;
	}

});

window.addEventListener("load", game.load);
