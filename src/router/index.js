import CadastroContato from "@/components/CadastroContato.vue";
import SearchResults from "@/components/SearchResults.vue";
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
      path: "/registro",
      name: "Registro",
      component: Registro,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/search",
      name: "search-results",
      query: "q",
      component: SearchResults,
    },
    {
      path:"/cadastrocontato",
      name: "CadastroContato",
      component: CadastroContato,
    }
  ],
});

export default router;
