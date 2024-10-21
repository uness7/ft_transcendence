<template>
  <div class="content">
    <canvas id="game-canvas"></canvas>
  </div>
  <div id="button-container">
    <button v-on:click="navigateToTournament()" id="return-button">BACK</button>
  </div>
</template>

<script>
import Ball from "../pong/entities/ball.js";
import PlayerPaddle from "../pong/entities/player-paddle.js";
import TextHUD from "../pong/entities/text-hud.js";
import Vec2 from "../pong/maths/vec2.js";
import CollisionDetector from "../pong/misc/collision-detector.js";
import BoundingBox from "../pong/misc/bounding-box.js";
import Rect2 from "../pong/maths/rect2.js";

export default {
  data() {
    return {
      tournament: null,
      pongConfig: null,
      gameConfig: {
        canvas: {
          width: 1280,
          height: 720,
        },
        paddle: {
          size: {
            x: 15,
            y: 125,
          },
          sizeAi: {
            x: 15,
            y: 125,
          },
          speed: 520,
          speedAi: 520,
          padding: 20,
          color: "white",
        },
        ball: {
          radius: 8,
          color: "white",
          speed: 1000,
        },
        game: {
          maxScore: 3,
          playerIsLeftSide: true,
          timeBeforeGameStarts: 3,
          timeBeforeRoundStarts: 1.25,
          playerImmortal: false,
        },
        text: {
          color: "white",
          fontMain: "48px serif",
          fontScores: "48px serif",
          yPaddingMain: 50,
          yPaddingScores: 100,
        },
        ai: {
          chaseBuffer: 18,
        },
      },
    };
  },
  mounted() {
    this.pongConfigData = localStorage.getItem("pongConfig");
    if (!this.pongConfigData) {
      this.pongConfig = {
        playerSpeed: false,
        playerSize: false,
        playerImmortal: false,
        ballSpeed: false,
        aiSpeed: false,
      };
      localStorage.setItem("pongConfig", JSON.stringify(this.pongConfig));
    } else {
      this.pongConfig = JSON.parse(this.pongConfigData);
    }

    if (this.pongConfig.playerSpeed) this.gameConfig.paddle.speed = 820;
    if (this.pongConfig.playerSize) this.gameConfig.paddle.size.y = 190;
    if (this.pongConfig.ballSpeed) this.gameConfig.ball.speed = 750;
    if (this.pongConfig.playerImmortal)
      this.gameConfig.game.playerImmortal = true;
    this.initGame();
  },
  methods: {
    navigateToTournament() {
      this.$router.push("/tournament/brackets");
    },
    initGame() {
      const canvas = document.querySelector("#game-canvas");
      const ctx = canvas.getContext("2d");

      const returnBtn = document.querySelector("#return-button");

      let tournament;
      const tournamentData = localStorage.getItem("pongTournament");
      if (tournamentData) {
        tournament = JSON.parse(tournamentData);
      }
      const playerLeft =
        tournament?.matches?.[tournament?.nextMatch ?? 0].playerLeft ?? "";
      const playerRight =
        tournament?.matches?.[tournament?.nextMatch ?? 0].playerRight ?? "";

      const GameState = {
        Menu: "menu",
        Wait: "wait",
        Play: "play",
        Serve: "serve",
      };

      const gameConfig = this.gameConfig;

      class Pong {
        constructor() {
          this.timeLastFrame = 0;
          this.isLeftServe = true;
          this.leftScore = 0;
          this.rightScore = 0;
          this.state = GameState.Menu;
          this.entities = {
            playerLeftPaddle: new PlayerPaddle(
              ctx,
              gameConfig.paddle.size,
              gameConfig.paddle.speed,
              gameBox,
              true
            ),
            playerRightPaddle: new PlayerPaddle(
              ctx,
              gameConfig.paddle.size,
              gameConfig.paddle.speed,
              gameBox,
              false
            ),
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
              new Vec2(gameBox.getHalfWidth() / 2, gameBox.getHalfHeight()),
              gameConfig.text.fontScores,
              gameConfig.text.color
            ),
            rightScoreText: new TextHUD(
              ctx,
              "0",
              new Vec2(
                (gameBox.getHalfWidth() * 3) / 2,
                gameBox.getHalfHeight()
              ),
              gameConfig.text.fontScores,
              gameConfig.text.color
            ),
            leftPlayerText: new TextHUD(
              ctx,
              playerLeft,
              new Vec2(130, 50),
              gameConfig.text.fontScores,
              gameConfig.text.color
            ),
            rightPlayerText: new TextHUD(
              ctx,
              playerRight,
              new Vec2(gameBox.getSize().x - 130, 50),
              gameConfig.text.fontScores,
              gameConfig.text.color
            ),
          };
        }

        render = () => {
          ctx.clearRect(0, 0, gameBox.getSize().x, gameBox.getSize().y);
          Object.values(this.entities).forEach((entity) => entity.render());
        };

        gameStartTimer = () => {
          this.state = GameState.Wait;
          return new Promise((resolve) => {
            let timeToWait = gameConfig.game.timeBeforeGameStarts;
            const timer = setInterval(() => {
              this.entities.gameStateText.text = `GAME STARTS IN ${timeToWait}...`;
              this.render();
              timeToWait--;
              if (timeToWait < 0) {
                clearInterval(timer);
                resolve();
              }
            }, 1_000);
          });
        };

        load = () => {
          this.state = GameState.Menu;
          this.gameLoop();
        };

        checkCollisions = () => {
          const ball = this.entities.ball;
          const playerLeftPaddle = this.entities.playerLeftPaddle;
          const playerRightPaddle = this.entities.playerRightPaddle;

          if (gameBox.isBeyondLeftBound(ball.pos)) {
            if (!gameConfig.game.playerImmortal) this.rightScore++;
            this.state = GameState.Serve;
            this.isLeftServe = true;
          }

          if (gameBox.isBeyondRightBound(ball.pos)) {
            if (!gameConfig.game.playerImmortal) this.leftScore++;
            this.state = GameState.Serve;
            this.isLeftServe = false;
          }

          if (
            gameBox.isBeyondBottomBound(ball.getBottomPoint()) &&
            ball.isMovingDown()
          ) {
            ball.inverseYSpeed();
          }

          if (
            gameBox.isBeyondTopBound(ball.getTopPoint()) &&
            ball.isMovingUp()
          ) {
            ball.inverseYSpeed();
          }

          if (
            CollisionDetector.pointToRect(ball.pos, playerLeftPaddle.rect) &&
            ball.isMovingLeft()
          ) {
            playerLeftPaddle.collideBall(ball);
          }

          if (
            CollisionDetector.pointToRect(ball.pos, playerRightPaddle.rect) &&
            ball.isMovingRight()
          ) {
            playerRightPaddle.collideBall(ball);
          }
        };

        checkGameFinished = () => {
          if (
            this.leftScore === gameConfig.game.maxScore ||
            this.rightScore === gameConfig.game.maxScore
          ) {
            this.state = GameState.Wait;
            setTimeout(
              () => (returnBtn.style.visibility = "visible"),
              2 * 1_000
            );

            if (this.leftScore === gameConfig.game.maxScore) {
              this.entities.gameStateText.text = `${playerLeft} WINS`;
              tournament.matches[tournament.nextMatch].winner = playerLeft;
            } else {
              this.entities.gameStateText.text = `${playerRight} WINS`;
              tournament.matches[tournament.nextMatch].winner = playerRight;
            }

            tournament.matches[tournament.nextMatch].playerLeftScore =
              this.leftScore;
            tournament.matches[tournament.nextMatch].playerRightScore =
              this.rightScore;
            tournament.matches[tournament.nextMatch].state = "finished";
            tournament.nextMatch += 1;

            if (tournament.nextMatch === 2) {
              tournament.matches.push({
                playerLeft: tournament.matches[0].winner,
                playerRight: tournament.matches[1].winner,
                playerLeftScore: 0,
                playerRightScore: 0,
                state: "pending",
                winner: null,
              });
            } else if (tournament.nextMatch === 3) tournament.isFinished = true;
            localStorage.setItem("pongTournament", JSON.stringify(tournament));
          }
        };

        checkServeSide = () => {
          const ball = this.entities.ball;
          if (this.state === GameState.Serve) {
            if (this.isLeftServe) {
              this.entities.gameStateText.text = `${playerLeft} SERVES`;
              ball.speed.scale(-1);
            } else {
              this.entities.gameStateText.text = `${playerRight} SERVES`;
              ball.speed.copy(ball.resetSpeed);
            }

            if (this.state === GameState.Serve) {
              this.state = GameState.Wait;
              setTimeout(() => {
                this.state = GameState.Play;
              }, gameConfig.game.timeBeforeRoundStarts * 1000);
            }
          }
        };

        updateEntitiesPosition = (dt) => {
          const playerLeftPaddle = this.entities.playerLeftPaddle;
          const playerRightPaddle = this.entities.playerRightPaddle;

          if (leftToggleMoveUp) playerLeftPaddle.moveUp(dt);
          if (leftToggleMoveDown) playerLeftPaddle.moveDown(dt);
          playerLeftPaddle.updatePosition();
          if (rightToggleMoveUp) playerRightPaddle.moveUp(dt);
          if (rightToggleMoveDown) playerRightPaddle.moveDown(dt);
          playerRightPaddle.updatePosition();
          this.entities.ball.move(dt);
        };

        gameLoop = () => {
          if (!this.timeLastFrame) this.timeLastFrame = performance.now();
          const timeNow = performance.now();
          const dt = (timeNow - this.timeLastFrame) / 1000;
          this.timeLastFrame = timeNow;

          if (this.state === GameState.Menu) {
            this.entities.gameStateText.text = "PRESS SPACE TO START";
            this.leftScore = 0;
            this.rightScore = 0;
          } else if (this.state === GameState.Play) {
            this.entities.gameStateText.text = "";
            this.updateEntitiesPosition(dt);
            this.checkCollisions();
          } else if (this.state === GameState.Serve) {
            this.entities.ball.reset(this.isLeftServe);
            this.entities.playerLeftPaddle.reset();
            this.entities.playerRightPaddle.reset();
            toggleMoveResetAll();
            this.checkGameFinished();
            this.checkServeSide();
          }
          this.entities.rightScoreText.text = this.rightScore.toString();
          this.entities.leftScoreText.text = this.leftScore.toString();
          this.render();
          requestAnimationFrame(this.gameLoop);
        };
      }

      canvas.width = this.gameConfig.canvas.width;
      canvas.height = this.gameConfig.canvas.height;

      window.addEventListener("resize", () => {
        canvas.width = this.gameConfig.canvas.width;
        canvas.height = this.gameConfig.canvas.height;
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
      };

      document.addEventListener("keydown", (event) => {
        event.preventDefault();
        if (
          event.key === "w" &&
          game.state === GameState.Play &&
          !leftToggleMoveUp
        ) {
          leftToggleMoveUp = true;
        }
        if (
          event.key === "s" &&
          game.state === GameState.Play &&
          !leftToggleMoveDown
        ) {
          leftToggleMoveDown = true;
        }
        if (
          event.key === "ArrowUp" &&
          game.state === GameState.Play &&
          !rightToggleMoveUp
        ) {
          rightToggleMoveUp = true;
        }
        if (
          event.key === "ArrowDown" &&
          game.state === GameState.Play &&
          !rightToggleMoveDown
        ) {
          rightToggleMoveDown = true;
        }
      });

      document.addEventListener("keyup", (event) => {
        event.preventDefault();
        if (
          event.key === "w" &&
          game.state === GameState.Play &&
          leftToggleMoveUp
        ) {
          leftToggleMoveUp = false;
        }
        if (
          event.key === "s" &&
          game.state === GameState.Play &&
          leftToggleMoveDown
        ) {
          leftToggleMoveDown = false;
        }
        if (
          event.key === "ArrowUp" &&
          game.state === GameState.Play &&
          rightToggleMoveUp
        ) {
          rightToggleMoveUp = false;
        }
        if (
          event.key === "ArrowDown" &&
          game.state === GameState.Play &&
          rightToggleMoveDown
        ) {
          rightToggleMoveDown = false;
        }
        if (event.key === " ") {
          if (game.state === GameState.Menu) {
            game.gameStartTimer().then(() => {
              game.state = GameState.Serve;
            });
          }
        }
      });

      const game = new Pong();
      game.load();
    },
  },
};
</script>

<style scoped>
#game-canvas {
  display: block;
  background: var(--map-background);
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 2px solid white;
}

#return-button {
  width: 50px;
  height: 50px;
  background-color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  visibility: hidden;
}

#button-container {
  position: fixed;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
