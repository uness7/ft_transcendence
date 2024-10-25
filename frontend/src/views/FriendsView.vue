
<!-- issues: isonline is not working -->

<script setup>
  import {useAuthStore} from "@/store/auth";
  import {computed, onMounted, ref} from "vue";
  import apiClient from "@/services/apiService";
  import navBar from "@/components/NavBar.vue";

  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  const friends = ref([]);
  const toAddUser = ref("");
  const myFriendshipReqs = ref([]);
  const reqId = ref("");
  const is_online = ref(false);
  const isReq = ref(false);

  function acceptRequest(request_id) {
    apiClient
        .post(`/api/v1/accept_request/${user.value.id}/${request_id}/`)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {console.error(err)});
  }

  function fetchFriendshipReqs() {
    apiClient
        .get(`/api/v1/friend_requests/${user.value.id}/`)
        .then((res) => {
          myFriendshipReqs.value = res.data.friend_requests;
          isReq.value = true;
        })
        .catch((err) => {
          console.error(err);
        });
  }

  function fetchFriends() {
    apiClient.get(`/api/v1/get_friends_list/${user.value.id}/`)
        .then((res) => {
            friends.value = res.data.friends;
        })
        .catch((err) => {
          console.error(err);
        })
  }

  async function getUserByUsername(username) {
    let user = null;
    const res = await apiClient.get(`/api/user/`, {
      headers: {
        Authorization: `Bearer ${authStore.access_token}`,
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
      const response = await apiClient.post(`/api/v1/send_request/${user_id}/${to_add_user_id}/`);
      if (response.status === 200) {
        reqId.value = response.data.request_id;
        alert("Friend request was sent!");
      } else {
        alert("Friend Request failed!");
      }
    }
  }

  function getUserStatus() {
    apiClient
        .get(`/api/user/${user.value.id}/`, {
          headers: {
            Authorization: `Bearer ${authStore.access_token}`,
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
    const response = await apiClient.post(`/api/v1/remove_friend/${user.value.id}/${username}/`);
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
  <nav-bar />
  <div class="container">
    <div class="requests">
        <h2>My Friendship Requests</h2>
        <p class="requests-info">This space shows all pending friendship requests sent to you. 
        Click 'Accept' to add them to your friends list!</p>
        <ul class="list-requests">
          <li v-for="req in myFriendshipReqs" :key="req.request_id">
              A friend request was sent from <span>{{ req.from_user }}</span> of id {{ req.request_id }}
            <button @click="acceptRequest(req.request_id)" class="btn-request">Accept</button>
          </li>
        </ul>
    </div>

    <div class="friends">
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
      <div class="list-friends">
        <h2>List of Your Friends</h2>
        <ul class="friends-list">
          <li v-for="friend in friends" :key="friend.id">
              <div class="friends-list-container">
                {{ friend.username }} 
                <p>{{ is_online ? "Online" : "Offline" }}</p>
                <button @click="removeFriend(friend.username)" class="btn-remove">Remove</button>
              </div>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        font-size: 25px;
        width: auto; 
        height: 90vh;
    }

    .requests {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px 40px;
        width: 60%;
    }

    .friends {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 50px 40px;
        width: 60%;
    }

    .add-friend {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        width: 100%;
        min-height: 200px;
    }

    .list-friends {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        width: 100%;
        min-height: 200px;
    }

    h2 {
        text-decoration: underline;
    }

    .btn-request, .btn-add, .btn-remove {
        font-family: '8bit';
        font-size: 20px;
        background-color: #9b0000;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        margin-left: 10px;
        cursor: pointer;
    }

    .friends-list-container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    ul.friends-list {
        list-style-type: upper-roman;
    }

    span {
        font-style: italic;
    }

    .requests-info {
        text-align: center;
        color: #666;
        margin: 10px 0;
        font-size: 20px;
        max-width: 80%;
    }
</style>
