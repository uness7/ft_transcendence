import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import ModeView from '../views/ModeView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/*    exemple de router guard : empeche le changement de page si la personne est pas login  */

function isAuthenticated() 
{
  return true  //  <--- verifier avec l'api
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) 
  {
    if (isAuthenticated()) 
    {
      next()
      return
    }
    next('/login')
  }
  next()
})


export default router
