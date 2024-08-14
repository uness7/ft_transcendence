<template>
  <div class="sidebar">
    <ul class="nav-list">
      <li class="nav-item" @click="navigate('UserProfile')">{{ $t('profile') }}</li>
      <li class="nav-item" @click="navigate('UserSettings')">{{ $t('settings') }}</li>
    </ul>
    <div class="logout-box" @click="logout">
      <router-link to="/" id="logout-button">{{ $t('logout') }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  methods: {
    navigate(view) {
      this.$emit('navigate', view);
    },
    logout() {
      // Ajoutez ici la logique pour la déconnexion si nécessaire
      // Exemple : appel API et redirection
    }
  },
};
</script>

<style scoped>
@font-face {
  font-family: '8bit';
  src: url('../assets/font/8bit.ttf') format('truetype');
}

.sidebar {
  color: white;
  margin-top: 100px;   /* <--- ne pas trop changer */
  margin-left: 100px;
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100vh;
  background-color: var(--background-color);
  padding: 20px 0;
  border-right: solid rgb(25, 25, 25) 1px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nav-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-item {
  padding: 15px 20px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
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
