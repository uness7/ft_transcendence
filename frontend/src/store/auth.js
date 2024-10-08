import { defineStore } from "pinia";
import axios from "axios";
import { encryptToken, decryptToken, generateKey } from './encryptAPI';

const key = await generateKey();

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        user: null,
        user_id: '',
        isOTPVerified: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        getUser: (state) => state.user,
        getUserId: (state) => state.user_id,
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
                this.setUser(response.data.user);
                this.user_id = response.data.user.user_id;
                this.isOTPVerified = response.data.user.is_otp_verified;

                await this.fetchUser(response.data.user.id);
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
                        refresh: this.refreshToken,
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
                    console.error("Logged out successfully!");
            } catch (error) {
                throw new Error(error);
            }
        },
        async logout() {
            await this.apiBlacklistToken();
            this.clearTokens();
            this.setUser(null);
        },
        async getRefreshToken() {
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
        async fetchUser(user_id) {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/user/${user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.accessToken}`,
                        },
                    }
                );
                this.setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const newToken = await this.getRefreshToken();
                    if (newToken) {
                        return this.fetchUser();
                    }
                }
                console.error("Fetch user failed:", error);
            }
        },
    },
    persist: true,
});
