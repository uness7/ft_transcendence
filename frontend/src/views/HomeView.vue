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
  background-color: var(--background-color);
  margin-top: 84px;
}

#play-button {
  font-size: 200px;
  background-color: var(--background-color);
  border: none;
  text-decoration: none;
  color: white;
  font-family: '8bit', sans-serif;
  animation: blink 2s infinite;
}

#play-button:hover {
  animation: none;
  background-color: var(--background-color);
  color: var(--primary-color);
}

@keyframes blink {
  0%, 49% {
    background-color: var(--background-color);
    color: rgb(255, 255, 255);
  }
  50%, 100% {
    background-color: var(--background-color);
    color: var(--background-color);
  }
}
</style>
