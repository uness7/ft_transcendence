<template>
  <div class="sidebar">
    <ul class="nav-list">
      <li class="nav-item">
        <router-link to="/user" id="profile-button">{{ $t('profile') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/account-settings" id="settings-button">{{ $t('account-settings') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/appearance-settings" id="settings-button">{{ $t('appearance-settings') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/game-settings" id="settings-button">{{ $t('game-settings') }}</router-link>
      </li>
    </ul>
    <div class="logout-box" @click="logout">
      <button id="logout-button" @click="deleteUser">{{ $t('delete') }}</button>
      <button id="logout-button" @click="logout">{{ $t('logout') }}</button>
      <button id="logout-button" @click="anonymize" v-if="!is_anonymous">{{ $t('anonymize-user') }}</button>
    </div>
  </div>
</template>

<script>
import {useAuthStore} from '@/store/auth';
import {computed} from "vue";
import axios from 'axios';


export default {
  data() {
    return {
      is_anonymous: false,
      response: null,
    }
  },
  async mounted() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user || {username: 'default', id: ''});
    try {
      this.response = await axios.get(
          `https://localhost:8443/api/user/${user.value.id}/`,
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
      );
      this.is_anonymous = this.response.data.is_anonymous;
    } catch (e) {
      console.error(e);
    }
  },
  methods: {

    async anonymize() {
      const authStore = useAuthStore();
      const user = computed(() => authStore.user || {username: 'default', id: ''});
      const user_id = user.value.id;
      try {
        const response = await axios.patch(`https://localhost:8443/api/v1/anonymize_user/${user_id}/`,
            {
              headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/json',
              }
            });
        if (response.status === 201) {
          alert(`Your new anonymized email: ${response.data.data_update.email}`);
        } else {
          console.error("something went wrong during anonymization");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser() {
      const authStore = useAuthStore();
      const user = computed(() => authStore.user || {username: 'default', id: ''});
      const user_id = user.value.id;
      const response = await axios.delete(`https://localhost:8443/api/user/${user_id}/`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        console.log("User got deleted");
      } else {
        console.log("something went wrong");
      }
    },
    async logout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    },
    navigate(view) {
      this.$emit('navigate', view);
    },
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
  padding: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  text-align: center;
  font-size: 20px;
  width: 210px;
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
