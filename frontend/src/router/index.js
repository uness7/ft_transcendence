import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AboutView from "../views/AboutView.vue";
import ModeView from "../views/ModeView.vue";
import UserView from "../views/UserView.vue";
// import RemoteView from "../views/RemoteView.vue";
// import LocalView from "../views/LocalView.vue";
import UserSettings from "../components/UserSettings.vue";
import TournamentView from "../views/TournamentView.vue";
import NotFound from "../views/NotFound.vue";
import { useAuthStore } from "@/store/auth";
import CreateTournament from '../views/CreateTournament.vue'
import ListTournaments from '../views/ListTournaments.vue'
import TournamentDetails from '../views/TournamentDetails.vue'
// import AiView from '../views/AiView.vue'
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";
import PongLocalView from "../views/PongLocalView.vue";
import PongAiView from "../views/PongAiView.vue";
import TwoFacView from "../views/TwoFacView.vue";


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
        path: "/2fa",
        name: "2fa",
        component: TwoFacView,
        meta: {
            requiresAuth: true,
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
    // {
    //     path: '/ai',
    //     name: 'ai',
    //     component: AiView,
    //     meta: {
    //       requiresAuth: false,
    //     },
    // },
    // {
    //     path: "/local",
    //     name: "local",
    //     component: LocalView,
    //     meta: {
    //         requiresAuth: false,
    //     },
    // },
    // {
    //     path: "/remote",
    //     name: "remote",
    //     component: RemoteView,
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },
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
        path: '/create-tournament',
        name: 'create-tournament',
        component: CreateTournament,
        meta: {
          requiresAuth: true,
        },
    },
    {
        path: '/list-tournament',
        name: 'list-tournament',
        component: ListTournaments,
        meta: {
          requiresAuth: true,
        },
    },
    {
        path: '/tournament-details/:id',
        name: 'TournamentDetails',
        component: TournamentDetails,
        props: true,
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
            requiresAuth: false,
        },
    },
    {
        path: "/pong/ai",
        name: "pong-ai",
        component: PongAiView,
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
