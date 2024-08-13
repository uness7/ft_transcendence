<template>
  <div class="content">
    <div class="user-view">
      <NavBar @navigate="currentView = $event" />
      <div class="component">
        <component :is="currentView" :id="id"></component>
      </div>
    </div>
  </div>
</template>

<script>

import NavBar from '../components/NavBar.vue';
import UserProfile from '../components/UserProfile.vue';
import UserSettings from '../components/UserSettings.vue';

export default {
  name: 'UserView',
  components: {
    NavBar,
    UserProfile,
    UserSettings,
  },
  props: ['id'],
  data() {
    return {
      currentView: 'UserProfile', // Vue par defaut
    };
  },
};
</script>

<style scoped>

  .content {
    color: white;
    margin-top: 80px;   /* <--- ne pas trop changer */
  }
    
  .user-view {
    display: flex;
  }

  .component {
    flex: 1;
    padding: 20px;
  }
</style>
