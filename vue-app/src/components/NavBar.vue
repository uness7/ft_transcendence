<template>
    <div class="sidebar">
      <ul class="nav-list">
        <li class="nav-item" @click="navigate('UserProfile')">{{ $t('profile') }}</li>
        <li class="nav-item" @click="navigate('UserSettings')">{{ $t('settings') }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
    methods: {
      navigate(view) {
        this.$emit('navigate', view);
      },
    },
  };
  </script>
  
  <style scoped>
  .sidebar {
    color: white;
    margin-top: 80px;   /* <--- ne pas trop changer */
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    background-color: rgb(10,10,10);
    padding: 20px 0;
  }
  
  .nav-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    padding: 15px 20px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .nav-item:hover{
    color: var(--primary-color);
  }
  
  </style>
  