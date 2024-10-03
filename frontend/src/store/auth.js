import { defineStore } from "pinia";
import axios from "axios";
import { encryptToken, decryptToken, generateKey } from './encryptAPI';

const key = await generateKey();

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        user: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        getUser: (state) => state.user,
    },
    actions: {
        async initTokens() {
            const key = await generateKey();
            this.accessToken = await decryptToken(localStorage.getItem("accessToken"), key) || null;
            this.refreshToken = await decryptToken(localStorage.getItem("refreshToken"), key) || null;
        },
        async setTokens(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            // setting the encrypted tokens        
            const encryptedAccessToken = await encryptToken(accessToken, key);
            const encryptedRefreshToken = await encryptToken(refreshToken, key);
            localStorage.setItem("accessToken", encryptedAccessToken);
            localStorage.setItem("refreshToken", encryptedRefreshToken);

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
        async apiBlacklistToken() {
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/authentication/logout/",
                    {
                        refresh: this.refreshToken, // This is the payload
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );                
                if (response.status != 204) {
                    throw new Error('Failed to blacklist the token');
                }
                else
                    console.log("Logged out successfully!");
            } catch (error) {
                throw new Error(error);
            }
        },
        async logout() {
            await this.apiBlacklistToken();
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
