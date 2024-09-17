<template>
	<div class="top-bar">
		<header id="top-bar-content">
			<router-link to="/" id="logo-text">ft_transcendence</router-link>
			<router-link to="/about" id="about-button">{{ $t('about') }}</router-link>
			<router-link v-if="!isLoggedIn" to="/login" id="login-button">{{ $t('login') }}</router-link>
			<div v-else class="dropdown">
				<button class="dropbtn">{{ user.username }} ▼</button>
				<div class="dropdown-content">
					<router-link to="/profile">{{ $t('profile') }}</router-link>
					<a href="#" @click.prevent="logout">{{ $t('logout') }}</a>
				</div>
			</div>
		</header>
	</div>
	<router-view />
</template>


<!-- Javascript Code -->
<script>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

export default {
	setup() {
		const authStore = useAuthStore();
		const router = useRouter();
		const isLoggedIn = computed(() => authStore.isAuthenticated);
		console.log("is logged in ? ", isLoggedIn)
		const user = computed(() => authStore.user || { username: '', id: '' });
		const logout = async () => {
			await authStore.logout();
			router.push('/login');
		};
		return {
			isLoggedIn,
			user,
			logout,
		};
	},
};
</script>

<style scoped>
/*  ##### GLOBAL  ##### */

@font-face {
	font-family: '8bit';
	src: url('./assets/font/8bit.ttf') format('truetype');
}

:global(body) {
	background-color: var(--background-color);
}

/*  ##### HEADER  ##### */

.top-bar {
	width: 100%;
	background-color: var(--background-color);
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	border-bottom: 1px solid rgb(70, 70, 70);
}

#top-bar-content {
	margin-top: 20px;
	font-family: '8bit', sans-serif;
	color: white;
	margin-bottom: 20px;
}

#logo-text {
	font-family: '8bit', sans-serif;
	font-size: 40px;
	text-decoration: none;
	background-color: rgb(25, 25, 25);
	color: var(--primary-color);
	height: 100%;
	padding-left: 20px;
	padding-right: 20px;
	padding-top: 30px;
	padding-bottom: 29px;
	box-sizing: border-box;
	border-bottom: 1px solid rgb(70, 70, 70);
	border-right: 1px solid rgb(70, 70, 70);
}

#language-flag {
	width: 3%;
	position: absolute;
	right: 350px;
	cursor: pointer;
	transition: transform 0.3s ease;
}

#language-flag:hover {
	transform: scale(1.1);
}

#about-button {
	background-color: rgb(10, 10, 10);
	border: none;
	text-decoration: none;
	color: rgb(255, 255, 255);
	font-size: xx-large;
	position: absolute;
	right: 200px;
	font-family: '8bit', sans-serif;
	transition: all 0.2s ease;
}

#about-button:hover {
	transform: scale(1.05);
	color: var(--primary-color);
}

#login-button {
	margin-right: 10px;
	background-color: rgb(10, 10, 10);
	border: none;
	text-decoration: none;
	color: rgb(255, 255, 255);
	font-size: xx-large;
	position: absolute;
	right: 50px;
	font-family: '8bit', sans-serif;
	transition: all 0.2s ease;
}

#login-button:hover {
	transform: scale(1.05);
	color: var(--primary-color);
}

#logout-button {
	background-color: darkred;
}

#logout-button:hover {
	background-color: rgb(200, 0, 0);
}

.dropbtn {
	background-color: var(--background-color);
	color: rgb(255, 255, 255);
	font-size: xx-large;
	border: none;
	cursor: pointer;
	font-family: '8bit', sans-serif;
	transition: all 0.2s ease;
	padding-bottom: 15px;
}

.dropbtn:hover {
	color: var(--primary-color);
}

.dropdown {
  position: absolute;
  right: 150px; /* Adjusted from 50px to 150px to move it left */
  top: 20px;
  font-family: '8bit', sans-serif;
}

/* Adjust the dropdown content position */
.dropdown-content {
  font-size: 20px;
  padding-top: 10px;
  display: none;
  position: absolute;
  background-color: var(--background-color);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: auto;
  left: 0;
}

.dropdown-content a {
	color: rgb(255, 255, 255);
	padding: 12px 16px;
	text-decoration: none;
	display: block;
}

.dropdown-content a:hover {
	background-color: rgb(20, 20, 20);
	color: white;
}

.dropdown:hover .dropdown-content {
	display: block;
}

.dropdown:hover .dropbtn {
	background-color: var(--background-color);
	color: var(--primary-color);
}

</style>