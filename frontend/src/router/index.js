import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AboutView from "../views/AboutView.vue";
import ModeView from "../views/ModeView.vue";
import UserView from "../views/UserView.vue";
import UserSettings from "../components/UserSettings.vue";
import TournamentView from "../views/TournamentView.vue";
import NotFound from "../views/NotFound.vue";
import { useAuthStore } from "@/store/auth";
import CreateTournament from '../views/CreateTournament.vue'
import TournamentDetails from '../views/TournamentDetails.vue'
import TournamentBrackets from '../views/TournamentBracketsView.vue'
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";
import PongLocalView from "../views/PongLocalView.vue";
import PongTournamentView from "../views/PongTournamentView.vue";
import PongAiView from "../views/PongAiView.vue";
import PongMultiplayerView from "../views/PongMultiplayerView.vue";
import EnableOrDisableOTPView from "../views/EnableOrDisableOTPView.vue";
import FriendsView from "@/views/FriendsView.vue";
import MatchHistoryView from "@/views/MatchHistoryView.vue";


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
            requiresAuth: false,
        },
    },
    {
        path: "/user",
        name: "user",
        component: UserView,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/tournament",
        name: "tournament",
        component: TournamentView,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: '/tournament/create',
        name: 'create-tournament',
        component: CreateTournament,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: '/tournament/details/',
        name: 'TournamentDetails',
        component: TournamentDetails,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: '/tournament/brackets/',
        name: 'TournamentBrackets',
        component: TournamentBrackets,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/user/settings",
        name: "settings",
        component: UserSettings,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/privacy",
        name: "privacy-policy",
        component: PrivacyPolicyView,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/pong/local",
        name: "pong-local",
        component: PongLocalView,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/pong/tournament",
        name: "pong-tournament",
        component: PongTournamentView,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/pong/ai",
        name: "pong-ai",
        component: PongAiView,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/pong/multiplayer",
        name: "pong-multiplayer",
        component: PongMultiplayerView,
        meta: {
            requiresAuth: true,
            requiresOTP: true,
        },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
    {
        path: "/two-factor-auth",
        name: "2fa",
        component: EnableOrDisableOTPView,
        meta: {
            requiresAuth: true,
        },
    },
    {
      path: "/add-friends",
      name: "friends",
      component: FriendsView,
      meta: {
          requiresAuth: true,
      },
    },
    {
        path: "/match-history",
        name: "match_history",
        component: MatchHistoryView,
        meta: {
            requiresAuth: true,
            requiresOTP: false,
        },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export function isAuthenticated() {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
}

export const isOTPVerified = () => {
    const authStore = useAuthStore();
    return authStore.isOTPVerified;
}

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    let proceed = true;
    let goToLogin = false;

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!authStore.isAuthenticated) {
            proceed = false;
            goToLogin = true;
        }
    }

    if (to.matched.some((record) => record.meta.requiresOTP)) {
        if (!authStore.isOTPVerified) {
            proceed = false;
            goToLogin = false;
        }
    }

    if (proceed)
        next();
    else {
        if (goToLogin)
            next('/login');
        else
            next('/two-factor-auth');
    }
});

export default router;
