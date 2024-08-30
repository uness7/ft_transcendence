<template>
  <div class="content">
    <div v-if="user">
      <h1 id="username">{{ user.name }}</h1>
      <p>{{user.email}}</p>
      <p>{{user.id}}</p>
    </div>
    <div v-else-if="loading">
      <p>Chargement...</p>
    </div>
    <div v-else>
      <p>Impossible de charger les données de l'utilisateur.</p>
    </div>
  </div>
  </template>
    
  <script>
    import axios from 'axios';
  
    export default {
    name: 'UserProfile',
    props: ['id'],
    data() {
      return {
        user: null,
      };
    },
    mounted() {
      this.fetchUser();
    },
    methods: {
        fetchUser() {
        axios.get(`https://jsonplaceholder.typicode.com/users/${this.id}`)
            .then(response => {
            this.user = response.data;
            })
            .catch(error => {
            console.error('Erreur:', error);
            });
        }
    }
  };
  </script>
  
<style scoped>

  @font-face {
      font-family: '8bit';
      src: url('../assets/font/8bit.ttf') format('truetype');
}

  .content {
  
    color: white;
    margin-top: 80px;   /* <--- ne pas trop changer */
    font-family: '8bit',sans-serif;
    margin-left: 200px;
    font-size: 20px;
  }


  #username{
    font-size: 80px;
    right: 100px
  }
  
</style>