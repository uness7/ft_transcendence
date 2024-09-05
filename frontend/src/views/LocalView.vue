<template>
    <div id="content">
      <canvas ref="gameCanvas" width="1200" height="600"></canvas>
      <div v-if="!gameStarted && !gameOver" class="start-button">
        <button @click="startGame">Start</button>
      </div>
      <div v-if="gameOver" class="play-again-button">
        <button @click="resetGame">Play Again</button>
      </div>
    </div>
</template>
  
  
<script>
export default {
  data() {
    return {
      ballX: 600,
      ballY: 300,
      ballSpeedX: 8,
      ballSpeedY: 8,
      paddle1Y: 250,
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
      countdown: 0,
      countdownActive: false,

      // Nouveau état pour l'animation d'explosion
      explosionActive: false,
      explosionX: 0,
      explosionY: 0,
      explosionRadius: 0,
      explosionMaxRadius: 100,
      explosionFade: 1
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
      ctx.fillStyle = this.gameOver ? (this.player1Score > this.player2Score ? '#49a078' : '#e71d36') : 'white';
      ctx.fillText(`${this.player1Score}`, canvasWidth / 4, canvasHeight / 2);

      // Player 2 Score
      ctx.fillStyle = this.gameOver ? (this.player2Score > this.player1Score ? '#49a078' : '#e71d36') : 'white';
      ctx.fillText(`${this.player2Score}`, (canvasWidth / 4) * 3, canvasHeight / 2);

      // Draw Winner Text
      if (this.gameOver) {
        this.countdownActive = false;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const winnerX = this.player1Score > this.player2Score ? canvasWidth / 4 : (canvasWidth / 4) * 3;
        ctx.fillStyle = '#49a078';
        ctx.fillText('winner!', winnerX, canvasHeight / 2 + 40);
      }

      // Draw Countdown
      if (this.countdownActive) {
        ctx.font = '50px 8bit';
        ctx.fillStyle = 'grey';
        ctx.fillText(this.countdown, canvasWidth / 2, canvasHeight / 2);
      }

      // Draw explosion effect
      if (this.explosionActive) {
        this.drawExplosion(ctx);
      }
    },
    drawExplosion(ctx) {
      // Dessiner l'animation de l'explosion
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        this.explosionX, this.explosionY, 0,
        this.explosionX, this.explosionY, this.explosionRadius
      );
      gradient.addColorStop(0, `rgba(0, 255, 255, ${this.explosionFade})`);
      gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);

      ctx.fillStyle = gradient;
      ctx.arc(this.explosionX, this.explosionY, this.explosionRadius, 0, Math.PI * 2);
      ctx.fill();

      // Mise à jour de l'état de l'animation
      this.explosionRadius += 5;
      this.explosionFade -= 0.05;

      // Si l'explosion atteint sa taille maximale, on l'arrête
      if (this.explosionRadius >= this.explosionMaxRadius) {
        this.explosionActive = false;
      }
    },
    triggerExplosion(x, y) {
      // Activer l'animation d'explosion
      this.explosionActive = true;
      this.explosionX = x;
      this.explosionY = y;
      this.explosionRadius = 0;
      this.explosionFade = 1;
    },
    moveEverything() {
      if (!this.gameStarted || this.countdownActive) return;

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
          this.triggerExplosion(0, this.ballY); // Explosion à gauche
          this.checkGameOver();
          this.startCountdown();
        }
      }

      if (this.ballX > canvasWidth - 10) {
        if (this.ballY > this.paddle2Y && this.ballY < this.paddle2Y + 100) {
          this.ballSpeedX = -this.ballSpeedX;
        } else if (this.ballX > canvasWidth) {
          this.player1Score++;
          this.triggerExplosion(canvasWidth, this.ballY); // Explosion à droite
          this.checkGameOver();
          this.startCountdown();
        }
      }

      // Paddle movement for player 1
      if (this.wPressed && this.paddle1Y > 0) this.paddle1Y -= this.paddleSpeed;
      if (this.sPressed && this.paddle1Y < canvasHeight - 100) this.paddle1Y += this.paddleSpeed;

      // Paddle movement for player 2
      if (this.upPressed && this.paddle2Y > 0) this.paddle2Y -= this.paddleSpeed;
      if (this.downPressed && this.paddle2Y < canvasHeight - 100) this.paddle2Y += this.paddleSpeed;
    },
    startCountdown() {
      this.countdownActive = true;
      this.countdown = 3;

      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.countdownActive = false;
          this.ballReset();
        }
      }, 1000);
    },
    ballReset() {
      this.ballX = 600;
      this.ballY = 300;
      this.ballSpeedX = -this.ballSpeedX;
      this.drawEverything();
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
    }
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
  
  