 <template>
  <div class="content">
    <div v-if="user">
      <div class="profile">
        <img src="../assets/img/pp/okazdar.jpg" alt="Profile Photo" class="profile-photo"/> 
        <div class="profile-info">
          <h1 id="username">{{ user.name }}</h1>
          <!-- <p>{{user.email}}</p>
          <p>{{user.username}}</p> -->
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-label">Games Played:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Wins:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Losses:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Score:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="friends-list">
        <h2>Friends</h2>
         <ul>
          <li v-for="friend in user.friends" :key="friend.id">
            {{ user.id }}
          </li> 
        </ul>
      </div>
        </div>
        <!-- <button @click="updateUserData">Update Profile</button> -->
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
        loading: true,
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
  /* display: flex; */
  color: white;
  margin-top: 80px;   /* <--- ne pas trop changer */
  font-family: '8bit',sans-serif;
  margin-left: 500px;
  font-size: 20px;
}

.profile-header {
  text-align: center;
}
.profile{
  display: flex;
  align-items: center;
}
.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
  margin-right: 30px;
}

.profile-info{
  display: flex;
  flex-direction: column;
}

#username {
  font-size: 80px;
  margin: 0 auto;
}

.profile-stats {
  margin-top: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-label {
  font-weight: bold;
}

.stat-value {
  color: #333;
}

.friends-list {
  margin-top: 20px;
}

.friends-list h2 {
  font-size: 24px;
}

.friends-list ul {
  list-style-type: none;
  padding: 0;
}

.friends-list li {
  padding: 5px 0;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style> 

<!-- <template>
  <div class="content">
    <div v-if="user">
      <div class="profile-header">
        <img :src="user.profilePhoto" alt="Profile Photo" class="profile-photo"/> 
        <h1 id="username">{{ user.name }}</h1>
        <p>{{ user.email }}</p>
        <p>{{ user.id }}</p>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-label">Games Played:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Wins:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Losses:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Score:</span>
          <span class="stat-value">{{ user.id }}</span>
        </div>
      </div>
      <div class="friends-list">
        <h2>Friends</h2>
         <ul>
          <li v-for="friend in user.friends" :key="friend.id">
            {{ user.id }}
          </li> 
        </ul>
      </div>
      <button @click="updateUserData">Update Data</button>
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
      loading: true
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      this.loading = true;
      axios.get(`https://api.example.com/users/${this.id}`)
        .then(response => {
          this.user = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Erreur:', error);
          this.loading = false;
        });
    },
    updateUserData() {
      axios.get(`https://api.example.com/users/${this.id}`)
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
 -->
