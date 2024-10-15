<template>
  <div class="content">
    <div class="profile-section">
      <img :src="`${response?.data?.avatar}`" alt="Profile Image" class="profile-img">
      <h1 class="username">{{ response?.data?.username ?? "default" }}</h1>
      <h1>{{ response?.data?.first_name ?? "default" }}</h1>
      <h1>{{ response?.data?.last_name ?? "default" }}</h1>
      <h1>{{ response?.data?.email ?? "default" }}</h1>
    </div>
    <div class="main-section">
      <div class="left-section">
        <div class="stat-grid">
          <div class="stat">
            <h2>{{ $t('games-won') }}</h2>
            <p>{{ response?.data?.games_won ?? 0 }}</p>
          </div>
          <div class="stat">
            <h2>{{ $t('games-lost') }}</h2>
            <p>{{ response?.data?.games_lost ?? 0 }}</p>
          </div>
          <div class="stat">
            <h2>{{ $t('win-rate') }}</h2>
            <p>{{
                isNaN(response?.data?.games_won / (response?.data?.games_won + response?.data?.games_lost))
                    ? 0
                    : (100 * response?.data?.games_won / (response?.data?.games_won + response?.data?.games_lost)).toFixed(2)
              }}%</p>
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
import {computed} from 'vue';
import {useAuthStore} from '@/store/auth';
import axios from "axios"

export default {
  data() {
    return {
      response: null,
    };
  },
  async mounted() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user || {username: 'default', id: ''});
    try {
      this.response = await axios.get(
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

    this.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    const ctx = document.getElementById("gamesChart").getContext("2d");

    const canvas = document.getElementById("gamesChart");
    canvas.height = 500;

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Won", "Lost"],
        datasets: [
          {
            label: "Games",
            data: [this.response.data.games_won, this.response.data.games_lost],
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
