<template>
  <div class="content">
    <div class="user-view">
      <NavBar @navigate="currentView = $event"/>
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
  data() {
    return {
      currentView: 'UserProfile',
    };
  },
};
</script>

<style scoped>

.content {
  color: white;
  margin-top: 80px;
}

.user-view {
  display: flex;
}

.component {
  flex: 1;
  padding: 20px;
}
</style>


