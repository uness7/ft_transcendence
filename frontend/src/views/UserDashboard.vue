<template>
    <div class="content">

        <div class="dashboard">
            <h2>User Statistics</h2>
            <div v-if="loading">
                <p>Loading stats...</p>
            </div>
            <div v-else-if="stats">
                <p><strong>Total Games Played:</strong> {{ stats.total_games_played }}</p>
                <p><strong>Total Wins:</strong> {{ stats.total_wins }}</p>
                <p><strong>Total Losses:</strong> {{ stats.total_losses }}</p>
                <p><strong>Highest Score:</strong> {{ stats.highest_score }}</p>
                <p><strong>Average Score:</strong> {{ stats.average_score.toFixed(2) }}</p>
            </div>
            <div v-else>
                <p>No stats available.</p>
            </div>
        </div>
    </div>
    </template>
  
  <script>
  //import axios from 'axios';
  
  export default {
    data() {
      return {
        stats: null,
        loading: true,
      };
    },
    mounted() {
        // Mock data for testing purpose
    this.stats = {
      total_games_played: 25,
      total_wins: 15,
      total_losses: 10,
      highest_score: 200,
      average_score: 150.5,
    };
    this.loading = false;

    // Uncomment this block when testing with the real API
    /*
      const userId = this.$route.params.userId;  // Assuming userId comes from the route
      axios.get(`/api/stats/${userId}`)
        .then(response => {
          this.stats = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error("Error fetching user stats:", error);
          this.loading = false;
        });
        */
    },
  };
  </script>
  

<style scoped>
    @font-face {
        font-family: '8bit';
        src: url('../assets/font/8bit.ttf') format('truetype');
        }

    .content {
        color: white;
        margin-top: 300px;
        font-family: '8bit',sans-serif;
        display: flex;
        justify-content: center;
    }
  .dashboard {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .dashboard {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.game-history {
  margin-top: 20px;
}

.game-session {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.loading {
  text-align: center;
}

  </style>
  