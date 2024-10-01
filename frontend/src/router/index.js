import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AboutView from "../views/AboutView.vue";
import ModeView from "../views/ModeView.vue";
import UserView from "../views/UserView.vue";
import RemoteView from "../views/RemoteView.vue";
import LocalView from "../views/LocalView.vue";
import UserSettings from "../components/UserSettings.vue";
import TournamentView from "../views/TournamentView.vue";
import NotFound from "../views/NotFound.vue";
import { useAuthStore } from "@/store/auth";
import EnableOrDisableOTPView from "../views/EnableOrDisableOTPView.vue";
import OTPSetupView from "@/views/OTPSetupView.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: "/about",
		name: "about",
		component: AboutView,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: "/login",
		name: "login",
		component: LoginView,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: "/register",
		name: "register",
		component: RegisterView,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: "/mode",
		name: "mode",
		component: ModeView,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/local",
		name: "local",
		component: LocalView,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/remote",
		name: "remote",
		component: RemoteView,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/user/:id",
		name: "user",
		component: UserView,
		meta: {
			requiresAuth: true,
		},
		props: true,
	},
	{
		path: "/tournament",
		name: "tournament",
		component: TournamentView,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/user/settings",
		name: "settings",
		component: UserSettings,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/two-factor-auth",
		name: "2FA",
		component: EnableOrDisableOTPView,  
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: "/two-factor-auth/setup",
		name: "2FASetup",
		component: OTPSetupView,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export function isAuthenticated() {
	return !!localStorage.getItem("accessToken");
}

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!authStore.isAuthenticated) {
			next("/login");
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
