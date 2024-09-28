<template>
    <div class="content">
      <h1>Tournament Page</h1>
      <p>Welcome to the tournament page. Please choose an action below:</p>
  
      <div class="button-container">
        <router-link to="/create-tournament" class="btn">
          Create Tournament
        </router-link>
        <router-link to="/tournament-details" class="btn">
          Continue Tournament
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TournamentPage',
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
    font-family: '8bit',sans-serif;
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
  
  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .btn {
    display: inline-block;
    padding: 15px 30px;
    font-size: 1rem;
    color: white;
    background-color: rgb(20,20,20);
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: rgb(30,30,30);
  }
  
  .btn:active {
    background-color: rgb(30,30,30);
  }
  </style>
  