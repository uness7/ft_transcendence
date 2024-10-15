<script setup>
  import {useAuthStore} from "@/store/auth";
  import {computed, onMounted, ref} from "vue";
  import axios from "axios";

  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  const friends = ref([]);
  const toAddUser = ref("");
  const myFriendshipReqs = ref([]);
  const reqId = ref("");
  const is_online = ref(false);

  function acceptRequest(request_id) {
    axios
        .post(`https://localhost:8443/api/v1/accept_request/${user.value.id}/${request_id}/`)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {console.error(err)});
  }

  function fetchFriendshipReqs() {
    axios
        .get(`https://localhost:8443/api/v1/friend_requests/${user.value.id}/`)
        .then((res) => {
          myFriendshipReqs.value = res.data.friend_requests;
        })
        .catch((err) => {
          console.error(err);
        });
  }

  function fetchFriends() {
    axios.get(`https://localhost:8443/api/v1/get_friends_list/${user.value.id}/`)
        .then((res) => {
          friends.value = res.data.friends;
        })
        .catch((err) => {
          console.error(err);
        })
  }

  async function getUserByUsername(username) {
    let user = null;
    const res = await axios.get(`https://localhost:8443/api/user/`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const users = res.data;
    user = users.find(entries => entries.username === username);
    return user;
  }

  async function addUser() {
    const to_add_user = await getUserByUsername(toAddUser.value);
    if (!to_add_user) {
      alert("User Not Found");
    } else {
      const user_id = user.value.id;
      const to_add_user_id = to_add_user.id;
      const response = await axios.post(`https://localhost:8443/api/v1/send_request/${user_id}/${to_add_user_id}/`);
      if (response.status === 200) {
        reqId.value = response.data.request_id;
        alert("Friend request was sent!");
      } else {
        alert("Friend Request failed!");
      }
    }
  }

  function getUserStatus() {
    axios
        .get(`https://localhost:8443/api/user/${user.value.id}/`, {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            "Content-Type": "application/json"
          },
        })
        .then((res) => {
          console.log("Response Starts: ", res);
          is_online.value = res.data.is_active;
          console.log(is_online.value);
        })
        .catch((err) => {
          console.error(err);
        });
  }

  async function removeFriend(username) {
    const response = await axios.post(`https://localhost:8443/api/v1/remove_friend/${user.value.id}/${username}/`);
    if (response.status === 200) {
      alert(`${username} was removed!`);
    } else {
      alert("Something went wrong! Try again!");
    }
  }

  onMounted(() => {
    console.log("This view has been mounted");
    fetchFriends();
    fetchFriendshipReqs();
    getUserStatus();
  });



</script>

<template>
  <div class="big-container">

    <div class="container">
      <div class="requests">
        <h2>My Friendship Requests</h2>
        <ul class="list-requests">
          <li v-for="req in myFriendshipReqs" :key="req.request_id">
            A friend request was sent from {{ req.from_user }} with req.id {{ req.request_id }}
            <button @click="acceptRequest(req.request_id)" class="btn-request">Accept Request</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="list-friends">
        <h2>List of Your Friends</h2>
        <ul class="friends-list">
          <li v-for="friend in friends" :key="friend.id">
            This is {{ friend.username }} is your friend
            <p>{{ is_online ? "Online" : "Offline" }}</p>
            <button @click="removeFriend(friend.username)" class="btn-remove">Remove</button>
          </li>
        </ul>
      </div>

      <div class="add-friend">
        <h2>Add Friends By <strong>Username</strong></h2>
        <div class="input-group">
          <label for="username" class="input-label">Enter Username:</label>
          <input
              type="text"
              id="username"
              v-model="toAddUser"
              placeholder="Enter a username"
              class="input-field"
          />
          <button @click="addUser" class="btn-add">Add User</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.big-container {
  padding-top: 200px;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f3f4f6;
  color: #333;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #ecf0f1;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li:nth-child(even) {
  background-color: #e0e4e5;
}

.btn-request, .btn-remove, .btn-add {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-request:hover, .btn-remove:hover, .btn-add:hover {
  background-color: #2980b9;
}

.btn-remove {
  background-color: #e74c3c;
}

.btn-remove:hover {
  background-color: #c0392b;
}

.input-group {
  margin-top: 20px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #34495e;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #3498db;
  outline: none;
}

/* Responsive Design */
@media (max-width: 600px) {
  .container {
    padding: 15px;
  }

  .input-group {
    width: 100%;
  }

  .input-field {
    width: 100%;
  }
}

</style>
