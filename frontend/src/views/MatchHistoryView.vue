<script setup>
  import {useAuthStore} from "@/store/auth";
  import {computed, onMounted, ref} from "vue";
  import NavBar from "@/components/NavBar.vue";
  import apiClient from "@/services/apiService";
  

  const authStore = useAuthStore();
  const user = computed(() => authStore.user || { username: 'default', id: '' });

  const matchHistory = ref([]);
  const message = ref("");

  const URL_MATCH_HISTORY = `/api/v1/user/match_history/${user.value.id}`;

  function fetchMatchHistories() {
    apiClient
        .get(URL_MATCH_HISTORY)
        .then((res) => {
          message.value = res.data.message;
          matchHistory.value = res.data.match_history;
        })
        .catch((err) => {
          console.error(err)
        });
  }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

  onMounted(() => {
    console.log("View has been mounted");
    fetchMatchHistories();
  });
</script>

<template>
    <NavBar />
    <div class="container">
        <h1>Match History</h1>
         <p class="requests-info">This space shows the history of your games! A list of matches you played!</p>
        <ul class="match-list">
          <li v-for="match in matchHistory" :key="match.id" class="match-item">
            <div class="match-date"><strong>Played at: </strong> {{ formatDate(match.date)}}</div>
            <div class="match-details">
              <p><strong>Final Score:</strong> {{ match.final_score ? "WON" : "LOST"}}</p>
              <p><strong>Mode:</strong> {{ match.mode }}</p>
            </div>
          </li>
        </ul>
    </div>
</template>

<style scoped>
    .requests-info {
        text-align: center;
        color: #666;
        margin: 10px 0;
        font-size: 20px;
        max-width: 80%;
    }
</style>
