<template>
    <NavBar />
    <div class="container">
        <form @click.prevent="onSubmitForm" class="form-data">
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
            <div class="form">
                <label>Password</label>
                <input type="text" v-model="password" />
            </div>
            <div class="submit-btn">
                <input type="submit" value="Submit">
            </div>
        </form>
        <form class="form-avatar">
        </form>
    </div>
</template>

<script setup>
    import {ref, onMounted, onUpdated} from 'vue';
    import NavBar from '../components/NavBar.vue';

    const   first_name = ref("");
    const   last_name = ref("");
    const   email = ref("");
    const   password = ref("");


    function onSubmitForm() {
        console.log("submitedd");
    }

    // run whenver there is change in the dom 
    onUpdated(() => {
        console.log("update view has been updated");
    });

    onMounted(() => {
        console.log("update view has been mounted");
    })
</script>

<style>
	.container {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
		color: white;
        background-color: green;
		margin-top: 80px;
		margin-left: 350px;
		font-family: '8bit', sans-serif;
        width: auto;
        height: 90vh;
	}
    
    .form-data {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        height: 50%;
        margin-left: 50px;
        margin-right: 50px;
        padding-left: 50px;
        padding-right: 50px;
        background-color: red;
    }

    .form-avatar {
    }

    .form {
    }
</style>
