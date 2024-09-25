import { canvas, ctx } from "../misc/canvas.js";
import Ball from "../entities/ball.js";
import PlayerPaddle from "../entities/player-paddle.js"
import TextHUD from "../entities/text-hud.js"
import Vec2 from "../maths/vec2.js";
import CollisionDetector from "../misc/collision-detector.js";
import gameConfig from "./config.js"
import { togglePlayerImmortal, toggleFasterBall, togglePlayerLargerPaddle, togglePlayerSpeedBuff } from "./config.js"
import BoundingBox from "../misc/bounding-box.js";
import Rect2 from "../maths/rect2.js";


////////////////////////////////////////////////////////////////////////////////

// togglePlayerImmortal();
// toggleFasterBall();
// togglePlayerLargerPaddle();
// togglePlayerSpeedBuff();

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
			playerLeftPaddle: new PlayerPaddle(gameBox, true),
			playerRightPaddle: new PlayerPaddle(gameBox, false),
			ball: new Ball(
				gameBox.getCenter().clone(),
				gameConfig.ball.radius,
				new Vec2(gameConfig.ball.speed, 0),
				gameConfig.ball.color
			),
			gameStateText: new TextHUD(
				"",
				new Vec2(gameBox.getHalfWidth(), gameConfig.text.yPaddingMain),
				gameConfig.text.fontMain,
				gameConfig.text.color
			),
			leftScoreText: new TextHUD(
				"0",
				new Vec2(gameBox.getHalfWidth() / 2, gameConfig.text.yPaddingScores),
				gameConfig.text.fontScores,
				gameConfig.text.color
			),
			rightScoreText: new TextHUD(
				"0",
				new Vec2(gameBox.getHalfWidth() * 3 / 2, gameConfig.text.yPaddingScores),
				gameConfig.text.fontScores,
				gameConfig.text.color
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
			let timeToWait = gameConfig.game.timeBeforeGameStarts;
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

	checkCollisions = () => {
		const ball = this.entities.ball;
		const playerLeftPaddle = this.entities.playerLeftPaddle;
		const playerRightPaddle = this.entities.playerRightPaddle;

		// collision with left bound
		if (gameBox.isBeyondLeftBound(ball.pos)) {
			if (!gameConfig.game.playerImmortal)
				this.rightScore++;
			this.state = GameState.Serve;
			this.isLeftServe = true;
		}

		// collision with right bound
		if (gameBox.isBeyondRightBound(ball.pos)) {
			if (!gameConfig.game.playerImmortal)
				this.leftScore++;
			this.state = GameState.Serve;
			this.isLeftServe = false;
		}

		// collision with bottom bound
		if (gameBox.isBeyondBottomBound(ball.getBottomPoint())
		&& ball.isMovingDown()) {
			ball.inverseYSpeed();
		}

		// collision with top bound
		if (gameBox.isBeyondTopBound(ball.getTopPoint())
		&& ball.isMovingUp()) {
			ball.inverseYSpeed();
		}

		// collision with left paddle
		if (CollisionDetector.pointToRect(ball.pos, playerLeftPaddle.rect)
		&& ball.isMovingLeft()) {
			playerLeftPaddle.collideBall(ball);
		}

		// collision with right paddle
		if (CollisionDetector.pointToRect(ball.pos, playerRightPaddle.rect)
		&& ball.isMovingRight()) {
			playerRightPaddle.collideBall(ball);
		}
	}

	checkGameFinished = () => {
		if (this.leftScore === gameConfig.game.maxScore
			|| this.rightScore === gameConfig.game.maxScore
		) {
			if (this.leftScore === gameConfig.game.maxScore)
				this.entities.gameStateText.text = "LEFT WINS";
			else
				this.entities.gameStateText.text = "RIGHT WINS";
			this.state = GameState.Wait;
			setTimeout(() => {
				this.state = GameState.Menu;
			}, gameConfig.game.timeBeforeGameStarts * 1000);
		}
	}

	checkServeSide = () => {
		const ball = this.entities.ball;
		if (this.state === GameState.Serve) {
			if (this.isLeftServe) {
				this.entities.gameStateText.text = "LEFT SERVES";
				ball.speed.scale(-1);
			}
			else {
				this.entities.gameStateText.text = "RIGHT SERVES";
				ball.speed.copy(ball.resetSpeed);
			}

			if (this.state === GameState.Serve) {
				this.state = GameState.Wait;
				setTimeout(() => {
					this.state = GameState.Play;
				}, gameConfig.game.timeBeforeRoundStarts * 1000);
			}
		}
	}

	updateEntitiesPosition = (dt) => {
		const ball = this.entities.ball;
		const playerLeftPaddle = this.entities.playerLeftPaddle;
		const playerRightPaddle = this.entities.playerRightPaddle;

		if (leftToggleMoveUp)
			playerLeftPaddle.moveUp(dt);
		if (leftToggleMoveDown)
			playerLeftPaddle.moveDown(dt);
		playerLeftPaddle.updatePosition();
		if (rightToggleMoveUp)
			playerRightPaddle.moveUp(dt);
		if (rightToggleMoveDown)
			playerRightPaddle.moveDown(dt);
		playerRightPaddle.updatePosition();
		ball.move(dt);
	}

	gameLoop = () => {
		if (!this.timeLastFrame)
			this.timeLastFrame = performance.now();
		const timeNow = performance.now();
		const dt = (timeNow - this.timeLastFrame) / 1000;
		this.timeLastFrame = timeNow;
	
		const ball = this.entities.ball;
		const playerLeftPaddle = this.entities.playerLeftPaddle;
		const playerRightPaddle = this.entities.playerRightPaddle;

		if (this.state === GameState.Menu) {			// STATE MENU
			this.entities.gameStateText.text = "PRESS SPACE TO START";
			this.leftScore = 0;
			this.rightScore = 0;
		} else if (this.state === GameState.Play) {		// STATE PLAY
			this.entities.gameStateText.text = "";
			this.updateEntitiesPosition(dt);
			this.checkCollisions();
		} else if (this.state === GameState.Serve) {	// STATE SERVE
			ball.reset(this.isLeftServe);
			playerLeftPaddle.reset();
			playerRightPaddle.reset();
			toggleMoveResetAll();
			this.checkGameFinished();
			this.checkServeSide();
		}
		this.entities.rightScoreText.text = this.rightScore.toString();
		this.entities.leftScoreText.text = this.leftScore.toString();
		this.render();
		requestAnimationFrame(this.gameLoop);
	}
}

////////////////////////////////////////////////////////////////////////////////

// canvas
canvas.width = gameConfig.canvas.width;
canvas.height = gameConfig.canvas.height;

window.addEventListener("resize", () => {
	canvas.width = gameConfig.canvas.width;
	canvas.height = gameConfig.canvas.height;
});

const canvasRect = new Rect2(
	new Vec2(0, 0),
	new Vec2(canvas.width, canvas.height)
);
const gameBox = new BoundingBox(canvasRect);

// player movement events
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

// game
const game = new Pong();
window.addEventListener("load", game.load);
