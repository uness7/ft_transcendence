<template>
    <div class="content" v-if="user">
      <h1>Profil de l'utilisateur : {{ user.name }}</h1>
      <p>Email : {{ user.email }}</p>
      <p>Âge : {{ user.age }}</p>
    </div>
    <div v-else-if="loading">
      <p>Chargement...</p>
    </div>
    <div v-else>
      <p>Impossible de charger les données de l'utilisateur.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserView',
    props: ['id'],
    data() {
      return {
        user: null,
        loading: true,
        error: null,
      };
    },
    created() {
      this.fetchUser();
    },
    methods: {
      async fetchUser() {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users/${this.id}`);
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données.');
          }
          this.user = await response.json();
        } catch (error) {
          this.error = error.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>

  <style scoped>

      .content {
        color: white;
        margin-top: 80px;   /* <--- ne pas trop changer */
    }
  </style>
  