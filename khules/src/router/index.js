import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import ModeView from '../views/ModeView.vue'
import UserView from '../views/UserView.vue'
import GameView from '../views/GameView.vue'
import UserSettings from '../components/UserSettings.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/mode',
    name: 'mode',
    component: ModeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/game',
    name: 'game',
    component: GameView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    meta: {
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/user/settings',
    name: 'settings',
    component: UserSettings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export function isAuthenticated() {
  return true  // <--- Replace with actual authentication logic
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated()) {
      next(); // Allow navigation
    } else {
      next('/login'); // Redirect to login
    }
  } else {
    next(); // Proceed to route
  }
});

export default router
