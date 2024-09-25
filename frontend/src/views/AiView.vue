<template>
    <div class="content">
      <GameView/>
      <div class="dropdown">
        <button class="dropbtn" :class="currentDifficulty">
          {{ $t('difficulty') }} : {{ $t(currentDifficulty) }}
        </button>
        <div class="dropdown-content">
          <button @click="setDifficulty('easy')" class="easy">{{ $t('easy') }}</button>
          <button @click="setDifficulty('medium')" class="medium">{{ $t('medium') }}</button>
          <button @click="setDifficulty('hard')" class="hard">{{ $t('hard') }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import GameView from '../views/GameView.vue';
  
  export default {
    components: {
      GameView,
    },
    data() {
      return {
        currentDifficulty: 'medium',
      };
    },
    methods: {
      setDifficulty(level) {
        this.currentDifficulty = level;
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
    font-family: '8bit', sans-serif;
  }
  
  .dropbtn {
    background-color: var(--background-color);
    color: rgb(255, 255, 255);
    font-size: x-large;
    border: none;
    border-bottom: 1px solid grey;
    cursor: pointer;
    font-family: '8bit', sans-serif;
    transition: all 0.2s ease;
    padding-bottom: 15px;
  }
  
  .dropdown {
    position: absolute;
    right: 70px;
    top: 450px;
    font-family: '8bit', sans-serif;
  }
  
  .dropdown-content {
    font-size: 10px;
    padding-top: 10px;
    display: none;
    position: absolute;
    background-color: var(--background-color);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  
  .dropdown-content button {
    background-color: var(--background-color);
    padding: 12px 16px;
    border: none;
    border-bottom: 1px solid grey;
    font-size: 18px;
    text-align: left;
    cursor: pointer;
    width: 100%;
    font-family: '8bit', sans-serif;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  
  .easy {
    color: rgb(15, 126, 0);
  }
  
  .medium {
    color: rgb(233, 132, 0);
  }
  
  .hard {
    color: rgb(168, 0, 0);
  }
  </style>
  