<template>
  <div class="content">
    <router-link to="/mode" id="play-button">{{ $t('play') }}</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 92px);
    background-color: rgb(10, 10, 10);
    margin-top: 84px;
  }

  #play-button {
    font-size: 200px;
    background-color: rgb(10, 10, 10);
    border: none;
    text-decoration: none;
    color: white;
    font-family: '8bit', sans-serif;
    animation: blink 2s infinite;
  }

  #play-button:hover {
    animation: none;
    background-color: rgb(10, 10, 10);
    color: rgb(255, 89, 0);
  }

  @keyframes blink {
    0%, 49% {
        background-color: rgb(10, 10, 10);
        color: rgb(255, 255, 255);
    }
    50%, 100% {
        background-color: rgb(10, 10, 10);
        color: rgb(10, 10, 10);
    }
  }
</style>
