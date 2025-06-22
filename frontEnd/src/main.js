import Vue from 'vue'
import App from './App'

import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/NotificationPlugin'

import MaterialDashboard from './material-dashboard'

import Chartist from 'chartist'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import router from './routes'

Vue.prototype.$Chartist = Chartist

Vue.use(MaterialDashboard)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)

new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
  data: {
    Chartist: Chartist,
  },
})
