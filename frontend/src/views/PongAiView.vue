<template>
	<div class="content">
		<canvas id="game-canvas"></canvas>
	</div>
</template>

<script>
import Ball from "../pong/entities/ball.js";
import PlayerPaddle from "../pong/entities/player-paddle.js"
import AiPaddle from "../pong/entities/ai-paddle.js"
import TextHUD from "../pong/entities/text-hud.js"
import Vec2 from "../pong/maths/vec2.js";
import CollisionDetector from "../pong/misc/collision-detector.js";
import gameConfig from "../pong/game/config.js"
import BoundingBox from "../pong/misc/bounding-box.js";
import Rect2 from "../pong/maths/rect2.js";
// import { togglePlayerImmortal, toggleFasterBall, togglePlayerLargerPaddle, togglePlayerSpeedBuff } from "./config.js"

export default {
	name: 'PongAiView',
	mounted()
	{
		const canvas = document.querySelector("#game-canvas");
		const ctx = canvas.getContext("2d");
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
					playerPaddle: new PlayerPaddle(ctx, gameBox, true),
					aiPaddle: new AiPaddle(ctx, gameBox, false),
					ball: new Ball(
						ctx,
						gameBox.getCenter().clone(),
						gameConfig.ball.radius,
						new Vec2(gameConfig.ball.speed, 0),
						gameConfig.ball.color
					),
					gameStateText: new TextHUD(
						ctx,
						"",
						new Vec2(gameBox.getHalfWidth(), gameConfig.text.yPaddingMain),
						gameConfig.text.fontMain,
						gameConfig.text.color
					),
					leftScoreText: new TextHUD(
						ctx,
						"0",
						new Vec2(gameBox.getHalfWidth() / 2, gameConfig.text.yPaddingScores),
						gameConfig.text.fontScores,
						gameConfig.text.color
					),
					rightScoreText: new TextHUD(
						ctx,
						"0",
						new Vec2(gameBox.getHalfWidth() * 3 / 2, gameConfig.text.yPaddingScores),
						gameConfig.text.fontScores,
						gameConfig.text.color
					),
				};
				// this.timeAccumulator = 0;
				// this.oldBallPos = this.entities.ball.pos.clone();
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
				const playerPaddle = this.entities.playerPaddle;
				const aiPaddle = this.entities.aiPaddle;

				// collision with left bound
				if (gameBox.isBeyondLeftBound(ball.pos)) {
					if (!gameConfig.game.playerImmortal)
						this.rightScore++;
					this.state = GameState.Serve;
					this.isLeftServe = true;
				}

				// collision with right bound
				if (gameBox.isBeyondRightBound(ball.pos)) {
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
				if (CollisionDetector.pointToRect(ball.pos, playerPaddle.rect)
				&& ball.isMovingLeft()) {
					playerPaddle.collideBall(ball);
				}

				// collision with right paddle
				if (CollisionDetector.pointToRect(ball.pos, aiPaddle.rect)
				&& ball.isMovingRight()) {
					aiPaddle.collideBall(ball);
					aiPaddle.changePosition();
				}
			}

			checkGameFinished = () => {
				if (this.leftScore === gameConfig.game.maxScore
					|| this.rightScore === gameConfig.game.maxScore
				) {
					if (this.leftScore === gameConfig.game.maxScore)
						this.entities.gameStateText.text = "PLAYER WINS";
					else
						this.entities.gameStateText.text = "PLAYER LOST";
					this.state = GameState.Wait;
					setTimeout(() => {
						this.state = GameState.Menu;
					}, 3 * 1000);
				}
			}

			checkServeSide = () => {
				const ball = this.entities.ball;
				if (this.state === GameState.Serve) {
					if (this.isLeftServe) {
						this.entities.gameStateText.text = "PLAYER SERVES";
						ball.speed.scale(-1);
					}
					else {
						this.entities.gameStateText.text = "AI SERVES";
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
				const playerPaddle = this.entities.playerPaddle;
				const aiPaddle = this.entities.aiPaddle;

				if (leftToggleMoveUp)
					playerPaddle.moveUp(dt);
				if (leftToggleMoveDown)
					playerPaddle.moveDown(dt);
				playerPaddle.updatePosition();
				// if (this.timeAccumulator >= 1000) {
				// 	this.timeAccumulator = 0;
				// 	this.oldBallPos = ball.position.clone();
				// }
				// aiPaddle.checkMovement(dt, this.oldBallPos, gameConfig.ai.chaseBuffer);
				aiPaddle.checkMovement(dt, ball.pos, gameConfig.ai.chaseBuffer);
				ball.move(dt);
			}

			gameLoop = () => {
				if (!this.timeLastFrame)
					this.timeLastFrame = performance.now();
				const timeNow = performance.now();
				const dt = (timeNow - this.timeLastFrame) / 1000;
				this.timeAccumulator += timeNow - this.timeLastFrame;
				this.timeLastFrame = timeNow;
			
				const ball = this.entities.ball;
				const playerPaddle = this.entities.playerPaddle;
				const aiPaddle = this.entities.aiPaddle;

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
					playerPaddle.reset();
					aiPaddle.reset();
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

		const toggleMoveResetAll = () => {
			leftToggleMoveUp = false;
			leftToggleMoveDown = false;
		}

		document.addEventListener("keydown", event => {
			event.preventDefault();
			if (event.key == "w" && game.state === GameState.Play && !leftToggleMoveUp) {
				leftToggleMoveUp = true;
			}
			if (event.key == "s" && game.state === GameState.Play && !leftToggleMoveDown) {
				leftToggleMoveDown = true;
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
			if (event.key === " " && game.state === GameState.Menu) {
				game.gameStartTimer()
					.then(() => game.state = GameState.Serve);
			}
		});

		// game
		const game = new Pong();
		window.addEventListener("load", game.load);
	},
};
</script>

<style scoped>
#game-canvas {
	display: block;
	background: black;
	margin: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	border: 2px solid white;
}
</style>
