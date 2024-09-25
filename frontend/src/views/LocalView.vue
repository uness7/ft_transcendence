<template>
  <div class="content">
    <GameView/>
  </div>
</template>

<script>
import GameView from './GameView.vue';

export default{
  components:{
    GameView
  }
}
</script>

<style scoped>

.content {
  color: white;
  margin-top: 200px;
}

</style>
  