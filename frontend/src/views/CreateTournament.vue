<template>
    <div class="content">
        <h1>Create a Tournament</h1>
        <p>Enter the name of your tournament below:</p>

        <form @submit.prevent="createTournament" class="form-container">
            <input type="text" v-model="tournamentName" placeholder="Tournament Name (10char max)" required
                class="input-field" maxlength="10" />
            <button type="submit" class="btn">Create Tournament</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tournamentName: '',
        };
    },
    methods: {
        createTournament() {
            if (this.tournamentName) {
                const tournament = {
                    name: this.tournamentName,
                    isFinished: false,
                    isMatchPending: false,
                    participants: [],
                };
                if (localStorage.getItem("pongTournament")) {
                    localStorage.removeItem("pongTournament");
                }
                localStorage.setItem("pongTournament", JSON.stringify(tournament));
                this.$router.push('/tournament/details');
            }
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
    margin-bottom: 40px;
    color: #b3b3b3;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input-field {
    width: 300px;
    padding: 10px;
    font-size: 1rem;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.btn {
    padding: 15px 30px;
    font-size: 1rem;
    color: white;
    background-color: rgb(30, 30, 30);
    text-decoration: none;
    transition: background-color 0.3s ease;
    cursor: pointer;
    outline: none;
    border: none;
}

.btn:hover {
    background-color: rgb(30, 30, 30);
}

.btn:active {
    background-color: rgb(30, 30, 30);
}
</style>
