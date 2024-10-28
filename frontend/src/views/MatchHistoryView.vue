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

  onMounted(() => {
    console.log("View has been mounted");
    fetchMatchHistories();
  });
</script>

<template>
    <NavBar />
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
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    .container {
        background-color: #000;
        min-height: 100vh;
        padding: 2rem;
        font-family: 'Press Start 2P', cursive;
        color: #00ff00;
        text-shadow: 0 0 5px #00ff00;
        background-image: 
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0,255,0,0.1) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    h1 {
        text-align: center;
        font-size: 2.5rem;
        color: #ff0;
        text-shadow: 
            0 0 10px #ff0,
            0 0 20px #ff0,
            0 0 30px #ff0;
        margin-bottom: 2rem;
        animation: flicker 2s infinite;
    }

    .subtitle {
        text-align: center;
        color: #0ff;
        margin-bottom: 3rem;
        font-size: 1rem;
        text-shadow: 0 0 5px #0ff;
    }

    .match-list {
        max-width: 800px;
        margin: 0 auto;
        list-style: none;
        padding: 0;
    }

    .match-item {
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid #00ff00;
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        position: relative;
        transition: all 0.3s ease;
    }

    .match-item::before {
        content: '>';
        position: absolute;
        left: -25px;
        color: #00ff00;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .match-item:hover {
        transform: translateX(20px);
        background: rgba(0, 255, 0, 0.2);
        box-shadow: 
            0 0 10px #00ff00,
            inset 0 0 10px #00ff00;
    }

    .match-item:hover::before {
        opacity: 1;
    }

    .match-date {
        margin-bottom: 1rem;
        font-size: 0.8rem;
    }

    .match-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        font-size: 0.8rem;
    }

    .match-details p {
        margin: 0;
    }

    strong {
        color: #ff0;
        text-shadow: 0 0 5px #ff0;
    }

    @keyframes flicker {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
    }

    /* Scan line effect */
    .container::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
        );
        pointer-events: none;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #000;
    }

    ::-webkit-scrollbar-thumb {
        background: #00ff00;
        border: 2px solid #000;
    }
</style>
