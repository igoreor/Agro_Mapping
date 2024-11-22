<template>
    <div class="cadastro-contato-page">
      <CadastroContato />
    </div>
  </template>
  
  <script>
  import CadastroContato from "@/components/CadastroContato.vue";
  
  export default {
    name: "CadastroContato",
    components: {
      CadastroContato,
    },
  };
  </script>
  
  <style scoped>
  .cadastro-contato-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  </style>
  