import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes,
})

// Guard de navegação para proteger rotas
router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem('usuario')
  const isAuthenticated = !!usuario

  // Bloqueia acesso a rotas protegidas se não estiver autenticado
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    return next('/login')
  }

  // Se autenticado, não deixa acessar o login
  if (to.path === '/login' && isAuthenticated) {
    return next('/dashboard')
  }

  // Se não autenticado e vai na raiz, manda pro login
  if (to.path === '/' && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router