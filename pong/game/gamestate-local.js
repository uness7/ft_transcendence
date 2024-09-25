import { canvas, ctx } from "../misc/canvas.js";
import Ball from "../entities/ball.js";
import PlayerPaddle from "../entities/player-paddle.js"
import TextHUD from "../entities/text-hud.js"
import Vec2 from "../maths/vec2.js";
import CollisionDetector from "../misc/collision-detector.js";
import defaultConfig from "./config.js"
import BoundingBox from "../misc/bounding-box.js";
import Rect2 from "../maths/rect2.js";


////////////////////////////////////////////////////////////////////////////////

const GameState = {
	Menu: "menu",
	Wait: "wait",
	Play: "play",
	Serve: "serve",
}

class Pong {

	constructor() {
		this.timeLastFrame = 0;
		this.isLeftServe = true;
		this.leftScore = 0;
		this.rightScore = 0;
		this.state = GameState.Menu;
		this.entities = {
			paddleLeft: new PlayerPaddle(gameBox, true),
			paddleRight: new PlayerPaddle(gameBox, false),
			ball: new Ball(
				gameBox.getCenter().clone(),
				defaultConfig.ball.radius,
				new Vec2(defaultConfig.ball.speed, 0),
				defaultConfig.ball.color
			),
			gameStateText: new TextHUD(
				"",
				new Vec2(gameBox.getHalfWidth(), defaultConfig.text.yPaddingMain),
				defaultConfig.text.fontMain,
				defaultConfig.text.color
			),
			leftScoreText: new TextHUD(
				"0",
				new Vec2(gameBox.getHalfWidth() / 2, defaultConfig.text.yPaddingScores),
				defaultConfig.text.fontScores,
				defaultConfig.text.color
			),
			rightScoreText: new TextHUD(
				"0",
				new Vec2(gameBox.getHalfWidth() * 3 / 2, defaultConfig.text.yPaddingScores),
				defaultConfig.text.fontScores,
				defaultConfig.text.color
			),
		};
	}

	render = () => {
		ctx.clearRect(0, 0, gameBox.getSize().x, gameBox.getSize().y);
		Object.values(this.entities).forEach(entity => entity.render());
	}

	gameStartTimer = () => {
		this.state = GameState.Wait;
		return new Promise(resolve => {
			let timeToWait = defaultConfig.game.timeBeforeGameStarts;
			const timer = setInterval(() => {
				this.entities.gameStateText.text = `GAME STARTS IN ${timeToWait}...`;
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
		this.state = GameState.Menu;
		this.gameLoop();
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
			this.entities.gameStateText.text = "PRESS SPACE TO START";
		} else if (this.state === GameState.Play) {
			this.entities.gameStateText.text = "";
	
			// update left paddle position
			if (leftToggleMoveUp)
				paddleLeft.moveUp(dt);
			if (leftToggleMoveDown)
				paddleLeft.moveDown(dt);
			paddleLeft.updatePosition();
		
			// update right paddle position
			if (rightToggleMoveUp)
				paddleRight.moveUp(dt);
			if (rightToggleMoveDown)
				paddleRight.moveDown(dt);
			paddleRight.updatePosition();
			ball.move(dt);

			// collision with left/right
			if (gameBox.isBeyondLeftBound(ball.pos)) {
				this.rightScore++;
				this.entities.rightScoreText.text = this.rightScore.toString();
				this.state = GameState.Serve;
				this.isLeftServe = true;
			} else if (gameBox.isBeyondRightBound(ball.pos)) {
				this.leftScore++;
				this.entities.leftScoreText.text = this.leftScore.toString();
				this.state = GameState.Serve;
				this.isLeftServe = false;
			}

			// collision with top/bottom
			if (gameBox.isBeyondBottomBound(ball.getBottomPoint())
			|| gameBox.isBeyondTopBound(ball.getTopPoint())) {
				ball.inverseYSpeed();
			}

			// paddles collision
			if (CollisionDetector.pointToRect(ball.pos, paddleLeft.rect)
			|| CollisionDetector.pointToRect(ball.pos, paddleRight.rect)) {
				ball.inverseXSpeed();
			}

		} else if (this.state === GameState.Serve) {
			ball.reset(this.isLeftServe);
			paddleLeft.reset();
			paddleRight.reset();
			toggleMoveResetAll();

			if (this.leftScore === defaultConfig.game.maxScore) {
				this.state = GameState.Menu;
			}
			if (this.rightScore === defaultConfig.game.maxScore) {
				this.state = GameState.Menu;
			}

			if (this.isLeftServe) {
				this.entities.gameStateText.text = "LEFT PLAYER SERVES";
				ball.speed.mul(-1);
			}
			else {
				this.entities.gameStateText.text = "RIGHT PLAYER SERVES";
				ball.speed.copy(ball.resetSpeed);
			}

			if (this.state === GameState.Serve) {
				this.state = GameState.Wait;
				setTimeout(() => {
					this.state = GameState.Play;
				}, defaultConfig.game.timeBeforeRoundStarts * 1000);
			}
		}

		this.render();
		requestAnimationFrame(this.gameLoop);
	}
}

////////////////////////////////////////////////////////////////////////////////

// set canvas dimensions
canvas.width = defaultConfig.canvas.width;
canvas.height = defaultConfig.canvas.height;
// disable resize
window.addEventListener("resize", () => {
	canvas.width = defaultConfig.canvas.width;
	canvas.height = defaultConfig.canvas.height;
});

const canvasRect = new Rect2(
	new Vec2(0, 0),
	new Vec2(canvas.width, canvas.height)
);
const gameBox = new BoundingBox(canvasRect);

let leftToggleMoveUp = false;
let leftToggleMoveDown = false;
let rightToggleMoveUp = false;
let rightToggleMoveDown = false;

const toggleMoveResetAll = () => {
	leftToggleMoveUp = false;
	leftToggleMoveDown = false;
	rightToggleMoveUp = false;
	rightToggleMoveDown = false;
}

document.addEventListener("keydown", event => {
	event.preventDefault();
	if (event.key == "w" && game.state === GameState.Play && !leftToggleMoveUp) {
		leftToggleMoveUp = true;
	}
	if (event.key == "s" && game.state === GameState.Play && !leftToggleMoveDown) {
		leftToggleMoveDown = true;
	}
	if (event.key == "ArrowUp" && game.state === GameState.Play && !rightToggleMoveUp) {
		rightToggleMoveUp = true;
	}
	if (event.key == "ArrowDown" && game.state === GameState.Play && !rightToggleMoveDown) {
		rightToggleMoveDown = true;
	}
});

document.addEventListener("keyup", event => {
	event.preventDefault();
	if (event.key === "w" && game.state === GameState.Play &&  leftToggleMoveUp) {
		leftToggleMoveUp = false;
	}
	if (event.key === "s" && game.state === GameState.Play &&leftToggleMoveDown) {
		leftToggleMoveDown = false;
	}
	if (event.key === "ArrowUp" && game.state === GameState.Play &&rightToggleMoveUp) {
		rightToggleMoveUp = false;
	}
	if (event.key === "ArrowDown" && game.state === GameState.Play && rightToggleMoveDown) {
		rightToggleMoveDown = false;
	}
	if (event.key === " " && game.state === GameState.Menu) {
		game.gameStartTimer()
			.then(() => game.state = GameState.Serve);
	}
});

const game = new Pong();

window.addEventListener("load", game.load);
