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
import BoundingBox from "../pong/misc/bounding-box.js";
import Rect2 from "../pong/maths/rect2.js";
import {useAuthStore} from "@/store/auth";
import {computed} from "vue";
import axios from "axios";

export default {
  name: 'PongAiView',
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
    if (this.pongConfig.aiSpeed)
      this.gameConfig.paddle.speedAi = 820;
    await this.initGame();
  },
  methods: {
    async initGame() {
      const canvas = document.querySelector("#game-canvas");
      const ctx = canvas.getContext("2d");

      const authStore = useAuthStore();
      const user = computed(() => authStore.user || {username: 'default', id: ''});
      let response = null;
      try {
        response = await axios.get(
            `https://localhost:8443/api/user/${user.value.id}/`,
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
      const username = response.data.username;
      const gameConfig = this.gameConfig;

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
            playerPaddle: new PlayerPaddle(ctx, gameConfig.paddle.size, gameConfig.paddle.speed, gameBox, true),
            aiPaddle: new AiPaddle(ctx, gameConfig.paddle.sizeAi, gameConfig.paddle.speedAi, gameBox, false),
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
          this.timeAccumulator = 0;
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
          const playerPaddle = this.entities.playerPaddle;
          const aiPaddle = this.entities.aiPaddle;

          // collision with left bound
          if (gameBox.isBeyondLeftBound(ball.pos)) {
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
        updateMatchHistory = async (playerWon) => {
          try {
            await axios.post(
                `https://localhost:8443/api/v1/user/match_history/${user.value.id}/`,
                {
                  user: username,
                  final_score: playerWon,
                  mode: "AI",
                }
            );
          } catch (e) {
            console.error(e);
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
                `https://localhost:8443/api/user/${user.value.id}/`,
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
          await this.updateMatchHistory(playerWon);
        }
        checkGameFinished = () => {
          if (gameConfig.game.playerImmortal && this.leftScore < gameConfig.game.maxScore)
            return;
          if (this.leftScore === gameConfig.game.maxScore
              || this.rightScore === gameConfig.game.maxScore
          ) {
            if (this.leftScore === gameConfig.game.maxScore) {
              this.entities.gameStateText.text = `${username.toUpperCase()} WINS`;
              this.onGameFinished(true);
            } else {
              this.entities.gameStateText.text = "PLAYER LOST";
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
              this.entities.gameStateText.text = `${username.toUpperCase()} SERVES`;
              ball.speed.scale(-1);
            } else {
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
          if (this.timeAccumulator >= 1000) {
            this.timeAccumulator = 0;
            aiPaddle.predictImpact(ball.pos, ball.speed);
          }
          aiPaddle.checkMovement(dt, aiPaddle.impactPos, gameConfig.ai.chaseBuffer);
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

      // player movement events
      let leftToggleMoveUp = false;
      let leftToggleMoveDown = false;

      const toggleMoveResetAll = () => {
        leftToggleMoveUp = false;
        leftToggleMoveDown = false;
      }

      document.addEventListener("keydown", event => {
        event.preventDefault();
        if (event.key === "w" && game.state === GameState.Play && !leftToggleMoveUp) {
          leftToggleMoveUp = true;
        }
        if (event.key === "s" && game.state === GameState.Play && !leftToggleMoveDown) {
          leftToggleMoveDown = true;
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
        if (event.key === " " && game.state === GameState.Menu) {
          game.gameStartTimer()
              .then(() => game.state = GameState.Serve);
        }
      });

      // game
      const game = new Pong();
      game.load();
    },
  }
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
</style>
