<template>
    <button class="advertise-button" @click="goToVendas">Anuncie seus produtos aqui</button>
  </template>
 
  <script>
  export default {
    methods: {
      goToVendas() {
        // Simula a verificação de roles (exemplo com dados fictícios)
        const user = this.getCurrentUser(); // Método para buscar o usuário logado
 
        if (user && user.roles.includes('SELLER')) {
          // Redireciona para a página de vendas
          this.$router.push('/vendas');
        } else {
          // Redireciona para a página de cadastro de contato
          this.$router.push('/cadastroContato');
        }
      },
        getCurrentUser() {
            // Recupera o usuário logado do localStorage
            const user = localStorage.getItem('user');
   
            if (user) {
            return JSON.parse(user);
            }
   
            return null;
        },
    },
  };
  </script>
