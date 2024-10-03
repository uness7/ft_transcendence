<template>
  <div class="content">
    <div class="profile-section">
      <img :src="profileImageUrl" alt="Profile Image" class="profile-img">
      <h1 class="username">{{ username }}</h1>
    </div>
    <div class="main-section">
      <div class="left-section">
        <div class="stat-grid">
          <div class="stat">
            <h2>{{ $t('games-won') }}</h2>
            <p>{{ gamesWon }}</p>
          </div>
          <div class="stat">
            <h2>{{ $t('games-lost') }}</h2>
            <p>{{ gamesLost }}</p>
          </div>
          <div class="stat">
            <h2>{{ $t('win-rate') }}</h2>
            <p>{{ winRate }}%</p>
          </div>
          <div class="stat">
            <h2>{{ $t('tournaments-won') }}</h2>
            <p>{{ tournamentsWon }}</p>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="right-section">
        <canvas id="gamesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      username: "Player 1",
      profileImageUrl: require('../assets/img/pp/okazdar.jpg'),
      gamesWon: 20,
      gamesLost: 15,
      winRate: 57,
      tournamentsWon: 3,
      primaryColor: '',
    };
  },
  mounted() {
    this.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    const ctx = document.getElementById("gamesChart").getContext("2d");

    const canvas = document.getElementById("gamesChart");
    canvas.height = 500;

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Gagnees", "Perdues"],
        datasets: [
          {
            label: "Parties",
            data: [this.gamesWon, this.gamesLost],
            backgroundColor: [this.primaryColor, "#222"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 20,
              color: '#FFFFFF',
            },
          },
        },
        layout: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
        maintainAspectRatio: false,
      },
    });
  }
};
</script>

<style scoped>
.content {
  color: rgb(255, 255, 255);
  margin-left: 400px;
  background-color: var(--background-color);
  font-family: '8bit', sans-serif;
}

.profile-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-bottom: 80px;
}

.profile-img {
  border-radius: 10%;
  width: 10%;
  margin-top: -40px;
  border: 2px solid white;
}

.username {
  font-size: 4rem;
  margin-top: 0px;
}

.main-section {
  display: flex;
  justify-content: space-between;
}

.left-section {
  width: 45%;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.stat {
  text-align: center;
  background-color: rgb(15, 15, 15);
  padding: 30px;
  border: 1px solid rgb(50, 50, 50);
  border-radius: 8px;
  font-size: 1.2rem;
}

.divider {
  width: 2px;
  background-color: grey;
}

.right-section {
  width: 45%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

canvas {
  width: 100%;
  max-width: 350px;
}
</style>
