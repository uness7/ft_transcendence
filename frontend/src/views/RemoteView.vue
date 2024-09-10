<template>
  <div id="content">
    <canvas ref="gameCanvas" width="1200" height="600"></canvas>
    <div v-if="!gameStarted && !gameOver" class="start-button">
      <button @click="startGame">Start</button>
    </div>
    <div v-if="gameOver" class="play-again-button">
      <button @click="resetGame">Play Again</button>
    </div>
    <!-- <ChatVue/> -->
  </div>
</template>


<script>
// import ChatVue from '../components/ChatVue.vue'

export default {
  // components: {
  //   ChatVue
  // },
  data() {
    return {
      ballX: 600, // Centrer la balle pour la nouvelle taille
      ballY: 300,
      ballSpeedX: 8,
      ballSpeedY: 8,
      paddle1Y: 250, // Centrer les palettes pour la nouvelle taille
      paddle2Y: 250,
      paddleSpeed: 4,
      wPressed: false,
      sPressed: false,
      upPressed: false,
      downPressed: false,
      player1Score: 0,
      player2Score: 0,
      winningScore: 2,
      gameOver: false,
      gameStarted: false,
      winnerMessage: '',
      canvasContext: null,
    };
  },
  mounted() {
    this.setupGame();
  },
  methods: {
    setupGame() {
      const canvas = this.$refs.gameCanvas;
      if (canvas) {
        this.canvasContext = canvas.getContext('2d');
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        this.drawEverything();
      }
    },
    startGame() {
      this.gameStarted = true;
      this.gameLoop();
    },
    gameLoop() {
      if (!this.gameOver) {
        this.moveEverything();
        this.drawEverything();
        requestAnimationFrame(this.gameLoop);
      }
    },
    handleKeyDown(e) {
      if (e.key === 'ArrowUp') this.upPressed = true;
      if (e.key === 'ArrowDown') this.downPressed = true;
      if (e.key === 'w') this.wPressed = true;
      if (e.key === 's') this.sPressed = true;
    },
    handleKeyUp(e) {
      if (e.key === 'ArrowUp') this.upPressed = false;
      if (e.key === 'ArrowDown') this.downPressed = false;
      if (e.key === 'w') this.wPressed = false;
      if (e.key === 's') this.sPressed = false;
    },
    drawEverything() {
      if (!this.canvasContext) return;

      const ctx = this.canvasContext;
      const canvas = this.$refs.gameCanvas;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw ball
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.ballX, this.ballY, 10, 0, Math.PI * 2, true);
      ctx.fill();

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, this.paddle1Y, 10, 100);
      ctx.fillRect(canvasWidth - 10, this.paddle2Y, 10, 100);

      // Draw scores
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '60px Arial';

      // Player 1 Score
      ctx.fillStyle = this.gameOver ? (this.player1Score > this.player2Score ? 'green' : 'red') : 'white';
      ctx.fillText(`${this.player1Score}`, canvasWidth / 4, canvasHeight / 2);

      // Player 2 Score
      ctx.fillStyle = this.gameOver ? (this.player2Score > this.player1Score ? 'green' : 'red') : 'white';
      ctx.fillText(`${this.player2Score}`, (canvasWidth / 4) * 3, canvasHeight / 2);

      // Draw Winner Text
      if (this.gameOver) {
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const winnerX = this.player1Score > this.player2Score ? canvasWidth / 4 : (canvasWidth / 4) * 3;
        ctx.fillStyle = 'green';
        ctx.fillText('winner!', winnerX, canvasHeight / 2 + 40);
      }
    },
    moveEverything() {
      if (!this.gameStarted) return;

      this.ballX += this.ballSpeedX;
      this.ballY += this.ballSpeedY;

      const canvasWidth = this.$refs.gameCanvas.width;
      const canvasHeight = this.$refs.gameCanvas.height;

      // Ball collision with top and bottom walls
      if (this.ballY < 0 || this.ballY > canvasHeight) {
        this.ballSpeedY = -this.ballSpeedY;
      }

      // Ball collision with paddles
      if (this.ballX < 10) {
        if (this.ballY > this.paddle1Y && this.ballY < this.paddle1Y + 100) {
          this.ballSpeedX = -this.ballSpeedX;
        } else if (this.ballX < 0) {
          this.player2Score++;
          this.checkGameOver();
          this.ballReset();
        }
      }

      if (this.ballX > canvasWidth - 10) {
        if (this.ballY > this.paddle2Y && this.ballY < this.paddle2Y + 100) {
          this.ballSpeedX = -this.ballSpeedX;
        } else if (this.ballX > canvasWidth) {
          this.player1Score++;
          this.checkGameOver();
          this.ballReset();
        }
      }

      // Paddle movement for player 1
      if (this.wPressed && this.paddle1Y > 0) this.paddle1Y -= this.paddleSpeed;
      if (this.sPressed && this.paddle1Y < canvasHeight - 100) this.paddle1Y += this.paddleSpeed;

      // Paddle movement for player 2
      if (this.upPressed && this.paddle2Y > 0) this.paddle2Y -= this.paddleSpeed;
      if (this.downPressed && this.paddle2Y < canvasHeight - 100) this.paddle2Y += this.paddleSpeed;
    },
    ballReset() {
      this.ballX = 600; // Centrer la balle pour la nouvelle taille
      this.ballY = 300;
      this.ballSpeedX = -this.ballSpeedX;
    },
    checkGameOver() {
      if (this.player1Score === this.winningScore) {
        this.gameOver = true;
        this.winnerMessage = 'Player 1 Wins!';
      } else if (this.player2Score === this.winningScore) {
        this.gameOver = true;
        this.winnerMessage = 'Player 2 Wins!';
      }
    },
    resetGame() {
      this.player1Score = 0;
      this.player2Score = 0;
      this.gameOver = false;
      this.gameStarted = false;
      this.winnerMessage = '';
      this.ballReset();
      this.drawEverything();
    },
  },
};
</script>


<style scoped>
#content {
  margin-top: 200px;
  text-align: center;
  color: white;
  background-color: var(--background-color);
}

canvas {
  border: 2px solid white;
  background-color: var(--background-color);
}

.start-button,
.play-again-button {
  margin-top: 10px;
  color: white;
}

button {
  margin-top: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 70px;
  cursor: pointer;
  font-family: '8bit', sans-serif;
  animation: blink 2s infinite;
}

button:hover {
  animation: none;
  background-color: transparent;
  color: var(--primary-color);
}

.play-again-button {
  position: absolute;
  bottom: 20px; /* Ajustez selon vos besoins */
  left: 50%;
  transform: translateX(-50%);
}

@keyframes blink {
  0%, 49% {
    background-color: var(--background-color);
    color: rgb(255, 255, 255);
  }
  50%, 100% {
    background-color: var(--background-color);
    color: var(--background-color);
  }
}
</style>

