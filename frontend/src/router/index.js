import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AboutView from '../views/AboutView.vue'
import ModeView from '../views/ModeView.vue'
import UserView from '../views/UserView.vue'
import RemoteView from '../views/RemoteView.vue'
import LocalView from '../views/LocalView.vue'
import UserSettings from '../components/UserSettings.vue'
import TournamentView from '../views/TournamentView.vue'
import NotFound from '../views/NotFound.vue'

<<<<<<< HEAD
const	routes = [
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
		path: '/register',
		name: 'register',
		component: RegisterView,
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
		path: '/local',
		name: 'local',
		component: LocalView,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/remote',
		name: 'remote',
		component: RemoteView,
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
];
=======
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
    path: '/local',
    name: 'local',
    component: LocalView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/remote',
    name: 'remote',
    component: RemoteView,
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
    path: '/tournament',
    name: 'tournament',
    component: TournamentView,
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
>>>>>>> jules

const	router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export function isAuthenticated()
{
	return true;
}

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth))
	{
		if (isAuthenticated())
			next();
		else
			next('/login');
	}
	else
		next();
});

export default router;
