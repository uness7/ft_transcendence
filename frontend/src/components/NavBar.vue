<template>
  <div class="sidebar">
    <ul class="nav-list">
      <li class="nav-item"><router-link to="/user/1" id="profile-button">{{ $t('profile') }}</router-link></li>
      <li class="nav-item"><router-link to="/user/settings" id="settings-button">{{ $t('settings') }}</router-link></li>
    </ul>
    <div class="logout-box" @click="logout">
      <button id="logout-button" @click="logout">{{ $t('logout') }}</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';

export default {
  methods: {
    async logout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    }
  }
};

</script>

<style scoped>
@font-face {
  font-family: '8bit';
  src: url('../assets/font/8bit.ttf') format('truetype');
}

.sidebar {
  color: white;
  margin-top: 82px;
  /* <--- ne pas trop changer */
  margin-left: 140px;
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background-color: var(--background-color);
  border-right: solid rgb(70, 70, 70) 1px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nav-list {
  list-style-type: none;
  padding: 100px 0 0 0px;
  margin: 0;
  flex: 1;
}

.nav-item {
  padding: 15px 20px;
  color: white;
  font-size: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: '8bit', sans-serif;
}

.nav-item:hover {
  color: var(--primary-color);
}

.logout-box {
  position: fixed;
  bottom: 50px;
  left: 100;
  padding: 0 10px;
  box-sizing: border-box;
}

#profile-button {
  text-decoration: none;
  color: white;
  transition: all 0.2s ease;
}

#profile-button:hover {
  color: var(--primary-color);
}

#settings-button {
  text-decoration: none;
  color: white;
  transition: all 0.2s ease;
}

#settings-button:hover {
  color: var(--primary-color);
}

#logout-button {
  display: block;
  color: white;
  background-color: rgb(155, 0, 0);
  border: none;
  padding: 15px;
  cursor: pointer;
  text-align: center;
  font-size: 25px;
  width: 100%;
  height: 20px;
  border-radius: 5px;
  text-decoration: none;
  font-family: '8bit', sans-serif;
  transition: background-color 0.2s ease;
}

#logout-button:hover {
  background-color: darkred;
}
</style>
