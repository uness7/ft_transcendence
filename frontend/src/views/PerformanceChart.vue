<template>
  <div class="content">
    <div class="chart-container">
      <div class="chart">
        <div
            v-for="(game, index) in games"
            :key="index"
            class="data-point"
            :style="getPointStyle(game.score_player1)"
            :title="'Score: ' + game.score_player1 + ' | Date: ' + formatDate(game.date_played)"
        ></div>
      </div>
      <div class="x-axis">
        <span v-for="(game, index) in games" :key="index">{{ formatDate(game.date_played) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    games: {
      type: Array,
      required: true, // Expect games data to be passed from the parent component
    },
  },
  methods: {
    getPointStyle(score) {
      const maxScore = Math.max(...this.games.map((game) => game.score_player1));
      const heightPercentage = (score / maxScore) * 100;
      return {
        bottom: `${heightPercentage}%`,
        left: `${this.games.indexOf(this.games.find((g) => g.score_player1 === score)) * 100 / this.games.length}%`,
      };
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped>

.content {
  color: white;
  margin-top: 200px;
  font-family: '8bit', sans-serif;
  display: flex;
  justify-content: center;
}

.chart-container {
  width: 80%;
  height: 400px;
  position: relative;
  margin: 0 auto;
}

.chart {
  height: 100%;
  width: 100%;
  position: relative;
  border-left: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
}

.data-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #4bc0c0;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.data-point:hover {
  background-color: #36a2eb;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
}

.x-axis span {
  transform: rotate(45deg);
  white-space: nowrap;
  display: inline-block;
}
</style>
  