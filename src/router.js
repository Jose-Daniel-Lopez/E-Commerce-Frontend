import { createRouter, createWebHistory } from 'vue-router'
import UsersList from './components/UsersList.vue'

const routes = [
  { path: '/users', component: UsersList }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
