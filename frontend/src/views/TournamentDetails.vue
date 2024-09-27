<template>
    <div class="content">
      <h1>Tournament Details</h1>
      <p>Details for tournament:</p>
      <p>Number of participants: {{ participants.length }}</p>
  
      <div v-if="!joined">
        <button class="btn join-btn" @click="promptAlias">Join Tournament</button>
      </div>
      <div v-else>
        <p>Welcome, {{ alias }}!</p>
        <button class="btn leave-btn" @click="leaveTournament">Leave Tournament</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['id'],
    data() {
      return {
        participants: [], // need backend to display participants
        joined: false,
        alias: '',
      };
    },
    methods: {
      promptAlias() {
        let aliasInput;
        do {
          aliasInput = prompt("Please enter your alias (max 10 characters):");
          if (aliasInput && aliasInput.length > 10) {
            alert("Alias must be 10 characters or less.");
          }
        } while (aliasInput && aliasInput.length > 10);
        
        if (aliasInput) {
          this.alias = aliasInput;
          this.joined = true;
          // backend to send tournament name
        }
      },
      leaveTournament() {
        this.joined = false;
        this.alias = '';
        // backend to leave tournament
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
  