import CadastroContato from "@/components/CadastroContato.vue";
import Pesquisa from "@/pages/Pesquisa.vue";
import { createRouter, createWebHistory } from "vue-router";
import home from "../pages/home.vue";
import Login from "../pages/login.vue";
import Registro from "../pages/registro.vue";
import Feiras from "@/pages/Feiras.vue";
import CadastroProdutos from "@/pages/CadastroProdutos.vue";
import CadastroEstoque from "@/pages/CadastroEstoque.vue";
import MeuPerfil from "@/pages/MeuPerfil.vue";
import MeusAnuncios from "@/pages/MeusAnuncios.vue";
import MeusPedidos from "@/pages/MeusPedidos.vue";
import Carrinhos from "@/pages/Carrinhos.vue";


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
      name: "Pesquisa",
      component: Pesquisa,
    },
    {
      path:"/cadastrocontato",
      name: "CadastroContato",
      component: CadastroContato,
    },
    {
      path:"/cadastroProdutos",
      name: "cadastroProdutos",
      component: CadastroProdutos,
    },
    {
      path: "/feiras",
      name: "Feiras",
      component: Feiras,
    },
    {
      path: "/estoque",
      name: "Estoque",
      component: CadastroEstoque,
    },
    {
      path: "/meuPerfil",
      name: "MeuPerfil",
      component: MeuPerfil,
    },
    {
      path: "/meusPedidos",
      name: "MeusPedidos",
      component: MeusPedidos,
    },
    {
      path: "/carrinho",
      name: "Carrinhos",
      component: Carrinhos
    },
    {
      path: "/meusAnuncios",
      name: "MeusAnuncios",
      component: MeusAnuncios,
    }
  ],
});

export default router;
