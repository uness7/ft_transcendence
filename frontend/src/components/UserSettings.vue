<template>
    <NavBar />
    <div class="container">
        <form @submit.prevent="updateAvatar">
            <div class="avatar-container">
                <img :src="avatar" id="avatar" alt="avatar" />
                <label for="input-avatar" class="label-file-upload">
                    <input id="input-avatar" type="file" @change="handleFileUpload" />
                    Avatar
                </label>
            </div>
        </form>
        <form @submit.prevent="onSubmitForm" class="form-data">
            <div class="form">
                <label>First Name</label>
                <input type="text" v-model="first_name" />
            </div>
            <div class="form">
                <label>Last Name</label>
                <input type="text" v-model="last_name" />
            </div>
            <div class="form">
                <label>Email</label>
                <input type="text" v-model="email" />
            </div>
            <div class="submit-btn">
                <input id="submit-btn" type="submit" value="Submit">
            </div>
        </form>

        <form @submit.prevent="updatePassword" class="form-password">
            <div class="form">
                <label>Password</label>
                <input type="password" v-model="password" />
            </div>
            <div class="submit-btn">
                <input id="submit-btn" type="submit" value="update password">
            </div>
        </form>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue';
    import NavBar from '../components/NavBar.vue';
    import {useAuthStore} from "@/store/auth.js";
    import {apiClient} from "@/services/apiService.js";

    const   authStore = useAuthStore();

    const   first_name = ref("");
    const   last_name = ref("");
    const   email = ref("");
    const   password = ref("");
    const   avatar = ref("");

    function updateAvatar() {
        console.log("update avatar"); 
    }

    function updatePassword() {
        try {
            if (!password.value.isEmpty())
            {
                apiClient.patch(
                    `/api/v1/update_password/${authStore.user.id}/${password.value}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authStore.access_token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                ); 
           }
           else {
                console.log("no password was entered");
           }
        } catch (error) {
           console.log(error); 
        }
    }

    function onSubmitForm() {
        try {
            apiClient.patch(
                `/api/user/${authStore.user.id}`,
                {
                    first_name: first_name.value,
                    last_name: last_name.value,
                    email: email.value
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${authStore.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            ); 
        } catch (error) {
            console.log(error);
        }
    }

    onMounted(() => {
        first_name.value = authStore.user.first_name;
        last_name.value = authStore.user.last_name;
        email.value = authStore.user.email;
        avatar.value = authStore.user.avatar;
        console.log(avatar.value);
    })
</script>

<style>
	.container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
		color: white;
		margin-top: 80px;
		margin-left: 350px;
		font-family: '8bit', sans-serif;
        width: auto;
        height: 100vh;
	}
    
    .form-data, 
    .form-password,
    .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50%;
        width: 70%;
        margin-left: 50px;
        margin-right: 50px;
        padding-left: 50px;
        padding-right: 50px;
    }

    .form {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        width: 70%;
        font-size: 30px;
        padding: 10px 20px;
    }

    #submit-btn {
        font-size: 20px;
        padding: 10px 15px;
        margin: 5px 10px;
    }

    input[type=text], input[type=password] {
        width: 90%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
    }

    .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: none;
        padding: 20px;
        background-color: #0A0A0A;
        transition: border-color 0.3s;
        width: 70%;
    }

    #avatar {
        width: 100px;  
        height: 100px;
        border-radius: 50%; 
        object-fit: cover; 
        margin-bottom: 15px;
    }

    .label-file-upload {
        display: inline-block;
        background-color: #8B0000;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        text-align: center;
        transition: background-color 0.3s;
    }

    input[type="file"] {
        display: none;
    }


</style>
