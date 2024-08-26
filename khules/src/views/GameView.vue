<template>
  <div id="content">
    <ChatVue/>
  </div>
</template>

<script>
import ChatVue from '../components/ChatVue.vue';

export default {
  components: {
    ChatVue
  }
};
</script>

<style scoped>

  .content{
    margin-top: 100px;
  }
</style>
