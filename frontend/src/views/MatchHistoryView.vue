<script setup>
  import {useAuthStore} from "@/store/auth";
  import {computed, onMounted, ref} from "vue";
  import axios from "axios";

  const authStore = useAuthStore();
  const user = computed(() => authStore.user || { username: 'default', id: '' });

  const matchHistory = ref([]);
  const message = ref("");

  const URL_MATCH_HISTORY = `http://localhost:8000/api/v1/user/match_history/${user.value.id}`;

  function fetchMatchHistories() {
    axios
        .get(URL_MATCH_HISTORY)
        .then((res) => {
          message.value = res.data.message;
          matchHistory.value = res.data.match_history;
        })
        .catch((err) => {
          console.error(err)
        });
  }

  onMounted(() => {
    console.log("View has been mounted");
    fetchMatchHistories();
  });
</script>

<template>
  <div class="container">
    <h1>Match History</h1>
    <p class="subtitle">Matches Details</p>
    <ul class="match-list">
      <li v-for="match in matchHistory" :key="match.id" class="match-item">
        <div class="match-date"><strong>Played at: </strong> {{ match.date }}</div>
        <div class="match-details">
          <p><strong>Final Score:</strong> {{ match.final_score }}</p>
          <p><strong>Mode:</strong> {{ match.mode }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Styling the container */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 100px;
  padding-bottom: 40px;
  padding-right: 40px;
  padding-left: 40px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #2c3e50;
  font-family: 'Arial', sans-serif;
}

/* Styling the header */
h1 {
  text-align: center;
  font-size: 32px;
  color: #3498db;
  margin-bottom: 20px;
}

/* Styling the subtitle */
.subtitle {
  text-align: center;
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 30px;
}

/* Styling the match list */
.match-list {
  list-style: none;
  padding: 0;
}

.match-item {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

/* Hover effect */
.match-item:hover {
  transform: translateY(-5px);
}

.match-date {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.match-details {
  font-size: 16px;
  color: #7f8c8d;
}

.match-details p {
  margin: 5px 0;
}

strong {
  color: #2c3e50;
}
</style>
