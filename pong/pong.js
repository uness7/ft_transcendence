import { canvas, ctx } from "./misc/canvas.js";
import Ball from "./entities/ball.js";
import Paddle from "./entities/paddle.js"
import TextHUD from "./entities/text-hud.js"
import Vec2 from "./maths/vec2.js";
import CollisionDetector from "./misc/collision-detector.js";
import defaultConfig from "./game/config.js"
import BoundingBox from "./misc/bounding-box.js";
import Rect2 from "./maths/rect2.js";

// set canvas dimensions
canvas.width = defaultConfig.canvas.width;
canvas.height = defaultConfig.canvas.height;
// disable resize
window.addEventListener("resize", () => {
	canvas.width = defaultConfig.canvas.width;
	canvas.height = defaultConfig.canvas.height;
});

const canvasRect = new Rect2(new Vec2(0, 0), new Vec2(canvas.width, canvas.height));
const gameBox = new BoundingBox(canvasRect);

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
		this.timeLastFrame = 0;
		this.isLeftServe = false;

		this.state = GameState.Menu;
		this.entities = {
			paddleLeft: new Paddle(
				new Vec2(defaultConfig.paddle.width, defaultConfig.paddle.height),
				defaultConfig.paddle.padding,
				true,
				defaultConfig.paddle.color
			),
			paddleRight: new Paddle(
				new Vec2(defaultConfig.paddle.width, defaultConfig.paddle.height),
				defaultConfig.paddle.padding,
				false,
				defaultConfig.paddle.color
			),
			ball: new Ball(
				gameBox.getCenter().clone(),
				defaultConfig.ball.radius,
				new Vec2(defaultConfig.ball.speed, 0),
				defaultConfig.ball.color
			),
			gameStateText: new TextHUD(
				`Game starts in ${defaultConfig.game.timeBeforeGameStarts}...`,
				new Vec2(gameBox.getHalfWidth(), 40)),
			leftScoreText: new TextHUD('0', new Vec2(gameBox.getHalfWidth() / 2, 100)),
			rightScoreText: new TextHUD('0', new Vec2(3 * gameBox.getHalfWidth() / 2, 100)),
		};
		console.log(this.entities.ball);
	}

	render = () => {
		ctx.clearRect(0, 0, gameBox.getSize().x, gameBox.getSize().y);
		Object.values(this.entities).forEach(entity => entity.render());
	}

	#gameStartTimer = () => {
		return new Promise(resolve => {
			let timeToWait = defaultConfig.game.timeBeforeGameStarts;
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
				this.state = GameState.Serve;
				this.gameLoop();
			});
	}

	gameLoop = () => {
		if (!this.timeLastFrame)
			this.timeLastFrame = performance.now();
		const timeNow = performance.now();
		const dt = (timeNow - this.timeLastFrame) / 1000;
		this.timeLastFrame = timeNow;
	
		const ball = this.entities.ball;
		const paddleLeft = this.entities.paddleLeft;
		const paddleRight = this.entities.paddleRight;

		if (this.state === GameState.Menu) {

		} else if (this.state === GameState.Play) {
			this.entities.gameStateText.text = "Play";
	
			// update positions
			paddleLeft.pos.y += paddleLeft.yDirection * dt;
			paddleLeft.yDirection = 0;

			ball.move(dt);

			// collision with left/right
			if (gameBox.isBeyondLeftBound(ball.pos)) {
				paddleRight.score++;
				this.entities.rightScoreText.text = paddleRight.score.toString();
				this.state = GameState.Serve;
				this.isLeftServe = true;
			} else if (gameBox.isBeyondRightBound(ball.pos)) {
				paddleLeft.score++;
				this.entities.leftScoreText.text = paddleLeft.score.toString();
				this.state = GameState.Serve;
				this.isLeftServe = false;
			}

			// collision with top/bottom
			if (gameBox.isBeyondBottomBound(ball.getBottomPoint())
			|| gameBox.isBeyondTopBound(ball.getTopPoint())) {
				ball.inverseYSpeed();
			}


			// left paddle collision
			if (CollisionDetector.pointToRect(ball.pos, paddleLeft.getRect())) {
				ball.inverseXSpeed();
			}
			
			// right paddle collision
			if (CollisionDetector.pointToRect(ball.pos, paddleRight.getRect())) {
				ball.inverseXSpeed();
			}

			// naive ai right paddle
			if (ball.pos.y > paddleRight.pos.y + (paddleRight.height / 2 + 10))
				paddleRight.pos.y += 250 * dt;
			if (ball.pos.y < paddleRight.pos.y + (paddleRight.height / 2 - 10))
				paddleRight.pos.y -= 250 * dt;

			// keep paddles inside the canvas
			paddleRight.pos.y = clamp(paddleRight.pos.y, 0, gameBox.getSize().y - paddleRight.height);
			paddleLeft.pos.y = clamp(paddleLeft.pos.y, 0, gameBox.getSize().y - paddleLeft.height);

		} else if (this.state === GameState.Serve) {
			ball.reset(this.isLeftServe);
			paddleLeft.reset();
			paddleRight.reset();

			if (paddleLeft.score === this.maxScore) {
				this.state = GameState.Menu;
			}
			if (paddleRight.score === this.maxScore) {
				this.state = GameState.Menu;
			}
			if (this.isLeftServe) {
				this.entities.gameStateText.text = "Left Serve";
				ball.speed.mul(-1);
			}
			else {
				this.entities.gameStateText.text = "Right Serve";
				ball.speed.copy(ball.resetSpeed);
			}

			if (this.state === GameState.Serve)
				this.state = GameState.Play;
		}


		this.render();
		requestAnimationFrame(this.gameLoop);
	}
}





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


