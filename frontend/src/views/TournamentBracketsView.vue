<template>
	<div class="content">
		
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

</style>
