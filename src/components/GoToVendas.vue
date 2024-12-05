<template>
    <button class="advertise-button" @click="goToVendas">Anuncie seus produtos aqui</button>
  </template>
 
  <script>
  export default {
    methods: {
      goToVendas() {
        const user = this.getCurrentUser(); 
 
        if (user && user.roles.includes('SELLER')) {
          this.$router.push('/vendas');
        } else {
          this.$router.push('/cadastroContato');
        }
      },
        getCurrentUser() {
            const user = localStorage.getItem('user');
   
            if (user) {
            return JSON.parse(user);
            }
   
            return null;
        },
    },
  };
  </script>
