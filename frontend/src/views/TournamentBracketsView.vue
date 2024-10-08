<template>
	<div class="content">
        <h1>{{ tournament ? `${tournament.name} Tournament` : "Error: no tournament" }}</h1>
		<h2>Match 1 - {{ tournament?.matches?.[0].playerLeft }} vs {{ tournament?.matches?.[0].playerRight }}</h2>
		<p>{{ tournament?.matches?.[0].state }}</p>
		<div v-if="tournament?.matches?.[0].state === 'pending'">
            <button class="btn join-btn" @click="startMatch">Start Match</button>
		</div>
		<div v-else>
			<p>Winner: {{ tournament?.matches?.[0].winner }}</p>
			<p>Score: {{ tournament?.matches?.[0].playerLeftScore }} vs {{ tournament?.matches?.[0].playerRightScore }}</p>
		</div>

		<h2>Match 2 - {{ tournament?.matches?.[1].playerLeft }} vs {{ tournament?.matches?.[1].playerRight }}</h2>
		<p>{{ tournament?.matches?.[1].state }}</p>
		<div v-if="tournament?.matches?.[0].state === 'finished' && tournament?.matches?.[1].state === 'pending'">
            <button class="btn join-btn" @click="startMatch">Start Match</button>
		</div>
		<div v-if="tournament?.matches?.[1].state === 'finished'">
			<p>Winner: {{ tournament?.matches?.[1].winner }}</p>
			<p>Score: {{ tournament?.matches?.[1].playerLeftScore }} vs {{ tournament?.matches?.[1].playerRightScore }}</p>
		</div>

		<div v-if="tournament?.matches?.[0].state === 'finished' && tournament?.matches?.[1].state === 'finished'">
			<h2>Match 3 - {{ tournament?.matches?.[2].playerLeft }} vs {{ tournament?.matches?.[2].playerRight }}</h2>
			<p>{{ tournament?.matches?.[2].state }}</p>
			<div v-if="tournament?.matches?.[2].state === 'pending'">
				<button class="btn join-btn" @click="startMatch">Start Match</button>
			</div>
			<div v-else>
				<p>Winner: {{ tournament?.matches?.[2].winner }}</p>
				<p>Score: {{ tournament?.matches?.[2].playerLeftScore }} vs {{ tournament?.matches?.[2].playerRightScore }}</p>
				<h1>Congratulations {{tournament?.matches?.[2].winner}} !</h1>
			</div>
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
		startMatch() {
			this.$router.push("/pong-tournament");
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

h2 {
    font-size: 1.7rem;
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

</style>
