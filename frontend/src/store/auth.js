import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: localStorage.getItem("accessToken") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        user: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        getUser: (state) => state.user,
    },
    actions: {
        setTokens(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        },
        clearTokens() {
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
        setUser(user) {
            this.user = user;          
        },
        async login(credentials) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/authentication/login/",
                    credentials
                );
                this.setTokens(response.data.access, response.data.refresh);
                await this.fetchUser();
                return true;
            } catch (error) {
                console.error("Login failed:", error);
                return false;
            }
        },
        async register(userData) {
            try {
                await axios.post(
                    "http://localhost:8000/api/authentication/register/",
                    userData
                );
                return await this.login({
                    username: userData.username,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    password: userData.password,
                });
            } catch (error) {
                console.error("Registration failed:", error);
                return false;
            }
        },
        async logout() {
            this.clearTokens();
            this.setUser(null);
        },
        async refreshToken() {
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/authentication/refresh/",
                    {
                        refresh: this.refreshToken,
                    }
                );
                this.setTokens(response.data.access, this.refreshToken);
                return response.data.access;
            } catch (error) {
                console.error("Token refresh failed:", error);
                this.clearTokens();
                return null;
            }
        },
        async fetchUser() {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/user/",
                    {
                        headers: {
                            Authorization: `Bearer ${this.accessToken}`,
                        },
                    }
                );
                this.setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const newToken = await this.refreshToken();
                    if (newToken) {
                        return this.fetchUser();
                    }
                }
                console.error("Fetch user failed:", error);
            }
        },
    },
});
