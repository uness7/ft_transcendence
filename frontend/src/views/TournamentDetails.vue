<template>
    <div class="content">
        <h1>{{ tournament ? `${tournament.name} Tournament` : "Error: no tournament" }}</h1>
        <p>Details for tournament:</p>
        <p>Number of participants: {{ tournament?.participants?.length ?? 0 }}</p>
        <p id="player-1">{{ tournament?.participants?.[0] }}</p>
        <p id="player-2">{{ tournament?.participants?.[1] }}</p>
        <p id="player-3">{{ tournament?.participants?.[2] }}</p>
        <p id="player-4">{{ tournament?.participants?.[3] }}</p>
        <div v-if="!isTournamentFull()">
            <button class="btn join-btn" @click="join">Join Tournament</button>
        </div>
        <div v-else>
            <button class="btn join-btn" @click="startTournament">Start Tournament</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tournament: null,
        };
    },
    mounted() {
        const tournamentData = localStorage.getItem("pongTournament");
        if (tournamentData) {
            this.tournament = JSON.parse(tournamentData);
        }
    },
    methods: {
        isTournamentFull() {
            return this.tournament?.participants?.length === 4 ?? false;
        },

        updateStoredTournament() {
            localStorage.setItem("pongTournament", JSON.stringify(this.tournament));
        },

        join() {
            let aliasInput;

            do {
                aliasInput = prompt("Please enter your alias (max 10 characters):");
                if (aliasInput && aliasInput.length > 10) {
                    alert("Alias must be 10 characters or less.");
                }
            } while (aliasInput && aliasInput.length > 10);

            if (aliasInput) {
                if (!this.tournament.participants)
                this.tournament.participants = [];
                this.tournament.participants.push(aliasInput);
                this.updateStoredTournament();
            }
        },

        startTournament() {
            this.$router.push("/tournament/brackets")
        },
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
    background-color: var(--background-color);
    margin-top: 200px;
    text-align: center;
    padding: 20px;
    font-family: '8bit', sans-serif;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #f0f0f0;
}

p {
    font-size: 1.2rem;
    color: #b3b3b3;
}

.btn {
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.join-btn {
    background-color: #28a745;
}

.join-btn:hover {
    background-color: #218838;
}

.leave-btn {
    background-color: #dc3545;
}

.leave-btn:hover {
    background-color: #c82333;
}
</style>
