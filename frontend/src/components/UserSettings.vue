<template>
    <NavBar />
    <div class="container">
          <form @submit.prevent="updateAvatar" class="avatar-container">
            <img :src="avatarPreview || avatar" id="avatar" alt="avatar" />
            <label for="input-avatar" class="label-file-upload">
                <input 
                    id="input-avatar" 
                    type="file" 
                    @change="handleFileUpload"
                    accept="image/*"
                />
                Change Avatar
            </label>
            <button 
                v-if="hasNewAvatar" 
                type="submit" 
                class="submit-btn"
            >
            Upload Avatar
            </button>
        </form>
        <form @submit.prevent="onSubmitForm" class="form-data">
            <div class="form">
                <label>First Name</label>
                <input 
                    type="text" 
                    v-model="formData.first_name" 
                    @input="trackChanges('first_name')"
                />
            </div>
            <div class="form">
                <label>Last Name</label>
                <input 
                    type="text" 
                    v-model="formData.last_name" 
                    @input="trackChanges('last_name')"
                />
            </div>
            <div class="form">
                <label>Email</label>
                <input 
                    type="email" 
                    v-model="formData.email" 
                    @input="trackChanges('email')"
                />
            </div>
            <div class="submit-btn">
                <input 
                    class="submit-btn" 
                    type="submit" 
                    value="Submit"
                    :disabled="!hasChanges"
                />
            </div>
        </form>

        <form @submit.prevent="updatePassword" class="form-password">
            <div class="form">
                <label>Password</label>
                <input type="password" v-model="password" />
            </div>
            <div class="submit-btn">
                <input class="submit-btn" type="submit" value="Update password">
            </div>
        </form>
    </div>
</template>

<script setup>
    import {ref, onMounted, reactive, computed} from 'vue';
    import NavBar from '../components/NavBar.vue';
    import {useAuthStore} from "@/store/auth.js";
    import apiClient from "@/services/apiService";
    import { useToast } from "vue-toastification";


    const   toast = useToast();

    const   authStore = useAuthStore();
    const   password = ref("");
    const   avatar = ref("");
    const   avatarPreview = ref(null);
    const   selectedFile = ref(null);
    const   hasNewAvatar = ref(false);

    const   hasChanges = computed(() => {
        return Object.values(modifiedFields).some(modified => modified);
    });

    function trackChanges(field) {
        modifiedFields[field] = formData[field] !== originalData[field];
    }

    function getModifiedFields() {
        const formDataToSend = new FormData();
        Object.keys(modifiedFields).forEach(field => {
            if (modifiedFields[field]) {
                formDataToSend.append(field, formData[field]);
            }
        });
        return formDataToSend;
    }

    const   formData = reactive({
        first_name: "",
        last_name: "",
        email: ""
    });

    const   originalData = reactive({
        first_name: "",
        last_name: "",
        email: ""
    });

    const   modifiedFields = reactive({
        first_name:false, 
        last_name:false, 
        email:false 
    });
    
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        selectedFile.value = file;
        avatarPreview.value = URL.createObjectURL(file);
        hasNewAvatar.value = true;
    }

     async function updateAvatar() {
        try {
            if (!selectedFile.value) return;
            const formData = new FormData();
            formData.append('avatar', selectedFile.value);
            const response = await apiClient.patch(
                `/api/user/${authStore.user.id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authStore.access_token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (response.data) {
                avatar.value = response.data.avatar;
                authStore.user.avatar = response.data.avatar;
                hasNewAvatar.value = false;
                URL.revokeObjectURL(avatarPreview.value);
                avatarPreview.value = null;
                toast.success("Avatar updated successfully!");
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast.error("Failed to update avatar");
        }
    }

    async function updatePassword() {
        try {
            if (password.value !== "")
            {
                const   response = await apiClient.patch(
                    `/api/v1/update_password/${authStore.user.id}/${password.value}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${authStore.access_token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                ); 
                if (response.data) {
                    password.value = "";
                    toast.success("Password updated successfully!");
                }
           } else {
                console.log("no password was entered");
                toast.error("No Password was entered!");
           }
        } catch (error) {
           console.log(error); 
           toast.error(error);
        }
    }

    async function onSubmitForm() {
        try {
            if (!hasChanges.value)
                return ;

            const   formDataToSend = getModifiedFields();
            const   response = await apiClient.patch(
                `/api/user/${authStore.user.id}/`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${authStore.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            ); 
            if (response.data)
            {
                authStore.user = { ...authStore.user, ...response.data };
                Object.keys(response.data).forEach(key => {
                    if (Object.hasOwn(originalData, key)) {
                        originalData[key] = response.data[key];
                    }
                });
                Object.keys(modifiedFields).forEach(key => {
                    modifiedFields[key] = false;
                });
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Profile was not updated, something went wrong!");
        }
    }

    onMounted(() => {
        formData.first_name = authStore.user.first_name;
        formData.last_name = authStore.user.last_name;
        formData.email = authStore.user.email;

        originalData.first_name = authStore.user.first_name;
        originalData.last_name = authStore.user.last_name;
        originalData.email = authStore.user.email;
        
        avatar.value = authStore.user.avatar;
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

    .submit-btn {
        font-family: '8bit';
        font-size: 20px;
        padding: 5px 15px;
        margin: 2px 10px;
        background-color:  #8B0000;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }

    input[type=text], input[type=password], input[type=email] {
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
