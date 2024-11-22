<template>
    <div>
      <!-- Navbar -->
      <MainNav />
  
      <!-- Header -->
      <MainHeader />
  
      <!-- Seção "Sobre" -->
      <SobreSection />
  
      <!-- Botão para navegação às vendas -->
      <GoToVendas />
  
      <!-- Botão para Logout -->
      <LogoutButton />
    </div>
  </template>
  
  <script>
  import GoToVendas from '@/components/GoToVendas.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import MainNav from '@/components/MainNav.vue';
import SobreSection from '@/components/SobreSection.vue';
  
  export default {
    components: {
      MainNav,
      MainHeader,
      SobreSection,
      GoToVendas,
      LogoutButton,
    },
    created() {
      this.verificarToken();
    },
    methods: {
      verificarToken() {
        const token = localStorage.getItem('token');
        
        // Verifica se o token não existe ou é inválido
        if (!token || !this.tokenValido(token)) {
          this.limparToken();
          alert('Você precisa estar logado para acessar esta página.');
          this.$router.push('/login'); // Redireciona para o login
        }
      },
      
      tokenValido(token) {
        try {
          const decodedToken = this.decodeJWT(token);
          // Validação adicional, se necessário, como verificar a expiração do token
          return decodedToken && decodedToken.exp > Date.now() / 1000; // Verifica se o token não está expirado
        } catch (e) {
          return false;
        }
      },
      
      decodeJWT(token) {
        const base64Url = token.split('.')[1]; // O payload está na segunda parte do JWT
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.parse(jsonPayload); // Retorna o objeto JSON decodificado
      },
  
      limparToken() {
        localStorage.removeItem('token'); // Limpa o token do localStorage
      }
    },
  };
  </script>
  
  <style scoped>
  /* Estilização local do componente */
  div {
    padding: 20px;
  }
  </style>
  