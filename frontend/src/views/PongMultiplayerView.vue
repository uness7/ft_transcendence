<template>
  <div class="content">
    <canvas id="game-canvas"></canvas>
    <div class="power-up-buttons">
      <button :class="{ active: pongConfig?.isSpeedBuffActive ?? false }" @click="togglePlayerSpeed">Speed Buff</button>
      <button :class="{ active: pongConfig?.isLargerPaddleActive ?? false }" @click="toggleLargerPaddle">Larger Paddle
      </button>
      <button :class="{ active: pongConfig?.isFasterBallActive ?? false }" @click="toggleFasterBall">Faster Ball
      </button>
      <button :class="{ active: pongConfig?.isImmortalActive ?? false }" @click="togglePlayerImmortal">Immortal</button>
    </div>
  </div>
</template>

<script>
import Ball from "../pong/entities/ball.js";
import PlayerPaddle from "../pong/entities/player-paddle.js"
import TextHUD from "../pong/entities/text-hud.js"
import Vec2 from "../pong/maths/vec2.js";
import CollisionDetector from "../pong/misc/collision-detector.js";
import BoundingBox from "../pong/misc/bounding-box.js";
import Rect2 from "../pong/maths/rect2.js";
import {useAuthStore} from "@/store/auth";
import {computed} from "vue";
import axios from "axios";

export default {
  name: 'PongLocalView',
  data() {
    return {
      pongConfig: null,
      gameConfig: {
        canvas: {
          width: 1280,
          height: 720
        },
        paddle: {
          size: {
            x: 15,
            y: 125
          },
          sizeAi: {
            x: 15,
            y: 125
          },
          speed: 520,
          speedAi: 520,
          padding: 20,
          color: "white"
        },
        ball: {
          radius: 8,
          color: "white",
          speed: 500
        },
        game: {
          maxScore: 3,
          playerIsLeftSide: true,
          timeBeforeGameStarts: 3,
          timeBeforeRoundStarts: 1.25,
          playerImmortal: false
        },
        text: {
          color: "white",
          fontMain: "48px serif",
          fontScores: "48px serif",
          yPaddingMain: 50,
          yPaddingScores: 100
        },
        ai: {
          chaseBuffer: 18
        }
      },
    };
  },
  async mounted() {
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

    if (this.pongConfig.playerSpeed)
      this.gameConfig.paddle.speed = 820;
    if (this.pongConfig.playerSize)
      this.gameConfig.paddle.size.y = 190;
    if (this.pongConfig.ballSpeed)
      this.gameConfig.ball.speed = 750;
    if (this.pongConfig.playerImmortal)
      this.gameConfig.game.playerImmortal = true;

    await this.initGame();
  },
  methods: {
    async initGame() {
      const canvas = document.querySelector("#game-canvas");
      const ctx = canvas.getContext("2d");

      const GameState = {
        Menu: "menu",
        Wait: "wait",
        Play: "play",
        Serve: "serve",
      }

      const authStore = useAuthStore();
      const user = computed(() => authStore.user || {username: 'default', id: ''});
      let response = null;
      try {
        response = await axios.get(
            `http://localhost:8000/api/user/${user.value.id}/`,
            {
              headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
      } catch (e) {
        console.error(e);
      }

      const gameConfig = this.gameConfig;

      class Pong {
        constructor() {
          this.timeLastFrame = 0;
          this.isLeftServe = true;
          this.leftScore = 0;
          this.rightScore = 0;
          this.state = GameState.Menu;
          this.entities = {
            playerLeftPaddle: new PlayerPaddle(ctx, gameConfig.paddle.size, gameConfig.paddle.speed, highHalfBox, true),
            playerRightPaddle: new PlayerPaddle(ctx, gameConfig.paddle.size, gameConfig.paddle.speed, highHalfBox, false),
            playerLeftLowPaddle: new PlayerPaddle(ctx, gameConfig.paddle.size, gameConfig.paddle.speed, lowHalfBox, true),
            playerRightLowPaddle: new PlayerPaddle(ctx, gameConfig.paddle.size, gameConfig.paddle.speed, lowHalfBox, false),
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
              if (timeToWait < 0) {
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
          const playerLeftLowPaddle = this.entities.playerLeftLowPaddle;
          const playerRightLowPaddle = this.entities.playerRightLowPaddle;

          if (gameBox.isBeyondLeftBound(ball.pos)) {
            this.rightScore++;
            this.state = GameState.Serve;
            this.isLeftServe = true;
          }

          if (gameBox.isBeyondRightBound(ball.pos)) {
            this.leftScore++;
            this.state = GameState.Serve;
            this.isLeftServe = false;
          }

          if (gameBox.isBeyondBottomBound(ball.getBottomPoint())
              && ball.isMovingDown()) {
            ball.inverseYSpeed();
          }

          if (gameBox.isBeyondTopBound(ball.getTopPoint())
              && ball.isMovingUp()) {
            ball.inverseYSpeed();
          }

          if (CollisionDetector.pointToRect(ball.pos, playerLeftPaddle.rect)
              && ball.isMovingLeft()) {
            playerLeftPaddle.collideBall(ball);
          }

          if (CollisionDetector.pointToRect(ball.pos, playerRightPaddle.rect)
              && ball.isMovingRight()) {
            playerRightPaddle.collideBall(ball);
          }

          if (CollisionDetector.pointToRect(ball.pos, playerLeftLowPaddle.rect)
              && ball.isMovingLeft()) {
            playerLeftLowPaddle.collideBall(ball);
          }

          if (CollisionDetector.pointToRect(ball.pos, playerRightLowPaddle.rect)
              && ball.isMovingRight()) {
            playerRightLowPaddle.collideBall(ball);
          }
        }

        onGameFinished = async (playerWon) => {
          const updatedData = {
            games_played: response.data.games_played + 1,
            games_won: playerWon ? response.data.games_won + 1 : response.data.games_won,
            games_lost: playerWon ? response.data.games_lost : response.data.games_lost + 1,
          }
          try {
            response = await axios.patch(
                `http://localhost:8000/api/user/${user.value.id}/`,
                {
                  "games_played": updatedData.games_played,
                  "games_lost": updatedData.games_lost,
                  "games_won": updatedData.games_won,
                },
                {
                  headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                    'Content-Type': 'application/json'
                  }
                }
            );
          } catch (e) {
            console.error(e);
          }
        }
        checkGameFinished = () => {
          if (gameConfig.game.playerImmortal)
            return;
          if (this.leftScore === gameConfig.game.maxScore
              || this.rightScore === gameConfig.game.maxScore
          ) {
            if (this.leftScore === gameConfig.game.maxScore) {
              this.entities.gameStateText.text = "LEFT PLAYERS WIN";
              this.onGameFinished(true);
            } else {
              this.entities.gameStateText.text = "RIGHT PLAYERS WIN";
              this.onGameFinished(false);
            }
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
              this.entities.gameStateText.text = "LEFT SERVE";
              ball.speed.scale(-1);
            } else {
              this.entities.gameStateText.text = "RIGHT SERVE";
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
          const playerLeftPaddle = this.entities.playerLeftPaddle;
          const playerRightPaddle = this.entities.playerRightPaddle;
          const playerLeftLowPaddle = this.entities.playerLeftLowPaddle;
          const playerRightLowPaddle = this.entities.playerRightLowPaddle;

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

          if (leftLowToggleMoveUp)
            playerLeftLowPaddle.moveUp(dt);
          if (leftLowToggleMoveDown)
            playerLeftLowPaddle.moveDown(dt);
          playerLeftLowPaddle.updatePosition();

          if (rightLowToggleMoveUp)
            playerRightLowPaddle.moveUp(dt);
          if (rightLowToggleMoveDown)
            playerRightLowPaddle.moveDown(dt);
          playerRightLowPaddle.updatePosition();

          this.entities.ball.move(dt);
        }

        gameLoop = () => {
          if (!this.timeLastFrame)
            this.timeLastFrame = performance.now();
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
            this.entities.playerLeftLowPaddle.reset();
            this.entities.playerRightLowPaddle.reset();
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

      const highRect = new Rect2(
          new Vec2(0, 0),
          new Vec2(canvas.width, gameBox.getHalfHeight())
      );
      const highHalfBox = new BoundingBox(highRect);

      const lowRect = new Rect2(
          new Vec2(0, gameBox.getHalfHeight()),
          new Vec2(canvas.width, gameBox.getHalfHeight())
      );
      const lowHalfBox = new BoundingBox(lowRect);

      let leftToggleMoveUp = false;
      let leftToggleMoveDown = false;
      let rightToggleMoveUp = false;
      let rightToggleMoveDown = false;
      let leftLowToggleMoveUp = false;
      let leftLowToggleMoveDown = false;
      let rightLowToggleMoveUp = false;
      let rightLowToggleMoveDown = false;

      const toggleMoveResetAll = () => {
        leftToggleMoveUp = false;
        leftToggleMoveDown = false;
        rightToggleMoveUp = false;
        rightToggleMoveDown = false;
        leftLowToggleMoveUp = false;
        leftLowToggleMoveDown = false;
        rightLowToggleMoveUp = false;
        rightLowToggleMoveDown = false;
      }

      document.addEventListener("keydown", event => {
        event.preventDefault();
        if (event.key === "w" && game.state === GameState.Play && !leftToggleMoveUp) {
          leftToggleMoveUp = true;
        }
        if (event.key === "s" && game.state === GameState.Play && !leftToggleMoveDown) {
          leftToggleMoveDown = true;
        }
        if (event.key === "u" && game.state === GameState.Play && !leftLowToggleMoveUp) {
          leftLowToggleMoveUp = true;
        }
        if (event.key === "j" && game.state === GameState.Play && !leftLowToggleMoveDown) {
          leftLowToggleMoveDown = true;
        }
        if (event.key === "ArrowUp" && game.state === GameState.Play && !rightToggleMoveUp) {
          rightToggleMoveUp = true;
        }
        if (event.key === "ArrowDown" && game.state === GameState.Play && !rightToggleMoveDown) {
          rightToggleMoveDown = true;
        }
        if (event.key === "PageUp" && game.state === GameState.Play && !rightLowToggleMoveUp) {
          rightLowToggleMoveUp = true;
        }
        if (event.key === "PageDown" && game.state === GameState.Play && !rightLowToggleMoveDown) {
          rightLowToggleMoveDown = true;
        }
      });

      document.addEventListener("keyup", event => {
        event.preventDefault();
        if (event.key === "w" && game.state === GameState.Play && leftToggleMoveUp) {
          leftToggleMoveUp = false;
        }
        if (event.key === "s" && game.state === GameState.Play && leftToggleMoveDown) {
          leftToggleMoveDown = false;
        }
        if (event.key === "u" && game.state === GameState.Play && leftLowToggleMoveUp) {
          leftLowToggleMoveUp = false;
        }
        if (event.key === "j" && game.state === GameState.Play && leftLowToggleMoveDown) {
          leftLowToggleMoveDown = false;
        }
        if (event.key === "ArrowUp" && game.state === GameState.Play && rightToggleMoveUp) {
          rightToggleMoveUp = false;
        }
        if (event.key === "ArrowDown" && game.state === GameState.Play && rightToggleMoveDown) {
          rightToggleMoveDown = false;
        }
        if (event.key === "PageUp" && game.state === GameState.Play && rightLowToggleMoveUp) {
          rightLowToggleMoveUp = false;
        }
        if (event.key === "PageDown" && game.state === GameState.Play && rightLowToggleMoveDown) {
          rightLowToggleMoveDown = false;
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
    }
  }
}
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

</style>

