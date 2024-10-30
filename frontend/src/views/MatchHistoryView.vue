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
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    onMounted(() => {
        fetchMatchHistories();
    });

</script>

<template>
    <NavBar />
    <div class="container">
        <h1>Match History</h1>
        <p class="subtitle">Matches Details</p>
        <table class="match-list">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Result</th>
                    <th>Mode</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="match in matchHistory" :key="match.id">
                    <td>{{ formatDate(match.date) }}</td>
                    <td>
                        <span :class="match.final_score ? 'status-won' : 'status-lost'">
                            {{ match.final_score ? $t('won') : $t('lost') }}
                        </span>
                    </td>
                    <td>{{ match.mode }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    .container {
        color: white;
        width: 590px;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto; /* Center the container */
    }

    h1 {
        text-align: center;
        font-size: 2em; /* Slightly smaller heading */
        margin-bottom: 10px;
    }

    .subtitle {
        text-align: center;
        color: white; /* Darker grey for subtlety */
        margin-bottom: 20px;
    }

    .match-list {
        width: 100%;
        border-collapse: collapse; /* Combine borders */
    }

    .match-list th,
    .match-list td {
        padding: 10px; /* Basic padding */
        text-align: left;
        border: 1px solid #ccc; /* Light border */
    }

    .match-list th {
        background-color: #909090; /* Light grey for headers */
    }

    .match-list tr:nth-child(even) {
        background-color: #909090; /* Light background for even rows */
    }

    .status-won {
        color: green; /* Color for won status */
        font-weight: bold; /* Bold text */
    }

    .status-lost {
        color: red; /* Color for lost status */
        font-weight: bold; /* Bold text */
    }

</style>
