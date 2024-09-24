<template>
    <div class="content">
      <h1>All Tournaments</h1>
      <p>Select a tournament to view details or join:</p>
      
      <router-link to="/create-tournament" class="btn create-btn">Create Tournament</router-link>
  
      <div class="tournament-container">
        <router-link 
          v-for="tournament in tournaments" 
          :key="tournament.id" 
          :to="{ name: 'TournamentDetails', params: { id: tournament.id } }" 
          class="tournament-card"
        >
          <div class="tournament-card-content">
            {{ tournament.name }}
          </div>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tournaments: [
          { id: 1, name: 'youness tournament' },
          { id: 2, name: 'ouissem tournament' },
          { id: 3, name: 'navid tournament' },
          { id: 4, name: 'lionel tournament' },
          { id: 5, name: 'jules tournament' },
        ],
      };
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
  
  .create-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: rgb(30, 30, 30);
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .tournament-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tournament-card {
    display: block;
    width: 30%;
    padding: 20px;
    margin-bottom: 20px;
    background-color: rgb(20,20,20);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: left;
    text-decoration: none;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .tournament-card:hover {
    background-color: rgb(30,30,30);
    transform: scale(1.01); 
  }
  
  .tournament-card-content {
    font-size: 1.5rem;
    color: var(--primary-color);
  }
  
  .tournament-card-content:hover {
    color: var(--primary-color);
  }
  
  </style>
  