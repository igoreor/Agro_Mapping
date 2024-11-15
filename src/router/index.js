import { createRouter, createWebHistory } from "vue-router";
import home from "../pages/home.vue";
import Login from "../pages/login.vue";
import Registro from "../pages/registro.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        default: home,
      },
      
    },
    {
      path: '/registro',
      name: 'Registro',
      component: Registro,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});

export default router;
