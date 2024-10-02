<template>
    <div class="content">
      <div class="header">
        <p id="error">{{ $t('error') }}</p>
        <h1 id="q">404</h1>
      </div>
      <p id="w">{{ $t('error-text') }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  
  <style scoped>
  .content {
    color: white;
    background-color: var(--background-color);
    margin-top: 350px; /* <--- ne pas trop changer */
    font-family: '8bit', sans-serif;
    text-align: center;
  }
  
  .header {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }
  
  #error {
    font-size: 150px;
    margin: 0;
  }
  
  #q {
    font-size: 200px;
    color: var(--primary-color);
    margin: 0 0 0 10px;
  }
  
  #w {
    font-size: 50px;
    margin-top: 10px;
  }
  </style>
  