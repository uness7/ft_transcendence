import { defineStore } from 'pinia'
import {ref} from "vue";
import axios from "axios";
import apiClient from "@/services/apiService";
import router from "@/router/index.js";

export const useAuthStore = defineStore(
    'auth',
    () => {
        const   access_token = ref('');
        const   refresh_token = ref('');
        const   user = ref({});
        const   isLoggedIn = ref(false);
        const   is_otp_verified = ref(false);
        const   user_id = ref("");

        function initTokens() {
            access_token.value = localStorage.getItem('access');
            refresh_token.value = localStorage.getItem('refresh');
        }

        function    setAccessToken(token) {
            access_token.value = token;
            localStorage.setItem('access', access_token.value);
        }

        function    setRefreshToken(token) {
            if (token) {
                refresh_token.value = token;
                localStorage.setItem('refresh', refresh_token.value);
            }
        }

        function clearTokens() {
            access_token.value = null;
            refresh_token.value = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        }

        async function apiBlacklistToken() {
            try {
                await apiClient.post(
                    "/api/authentication/logout/",
                    {
                        refresh: refresh_token.value,
                    },                
                    {
                        headers: {
                            Authorization: `Bearer ${access_token.value}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (error) {
                throw new Error(error);
            }
        }

        async function login(credentials) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/authentication/login/",
                    credentials
                );
                isLoggedIn.value = true;
                setAccessToken(response.data.access);
                setRefreshToken(response.data.refresh);
                user_id.value = response.data.user.id;
                fetchUser(user_id.value);
                return true;
            } catch (error) {
                console.error("Login failed:", error);
                return false;
            }
        }

        async function register(userData) {
            try {
                await axios.post(
                    "http://localhost:8000/api/authentication/register/",
                    userData
                );
                return true;
            } catch (error) {
                console.error("Registration failed:", error);
                return false;
            }
        }

        async function setOffOTP() {
            try {
                await apiClient.patch(
                    `/api/user/${user_id.value}/`,
                    {
                        is_otp_verified: false,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${access_token.value}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (error) {
                throw new Error(error);
            }
        }

        async function logout() {            
            await apiBlacklistToken();
            clearTokens();
            isLoggedIn.value = false;
            is_otp_verified.value = false;
            await setOffOTP();
            user.value = {};
            user_id.value = "";
            await router.push("/login");
            console.log("You are logged out successfully boy. ");
        }

        async function fetchUser(user_id) {
            try {
                const response = await apiClient.get(
                    `/api/user/${user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token.value}}`,
                        },
                    }
                );
                user.value = response.data;
            } catch (error) {               
                console.error("Fetch user failed:", error);
            }
        }

        return {
            access_token,
            refresh_token,
            user,
            initTokens,
            setAccessToken,
            setRefreshToken,
            login,
            register,
            logout,
            is_otp_verified,
            isLoggedIn,
            user_id,
        };
    },
    {
        persist: true,
    }
);