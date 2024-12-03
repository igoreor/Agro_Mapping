<template>
    <div class="imagem"></div>
    <div class="meus-anuncios-container">
      <h1>Meus Anúncios</h1>
  
      <div v-if="anuncios.length === 0">
        <p>Você ainda não tem anúncios publicados.</p>
      </div>
  
      <div v-else>
        <ul class="anuncios-list">
          <li v-for="anuncio in anuncios" :key="anuncio.id" class="anuncio-item">
            <div class="anuncio-details">
              <h3>{{ anuncio.titulo }}</h3>
              <p>{{ anuncio.descricao }}</p>
            </div>
            <div class="anuncio-actions">
              <button @click="editarAnuncio(anuncio.id)">Editar</button>
              <button @click="excluirAnuncio(anuncio.id)">Excluir</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        anuncios: [], // Lista de anúncios
      };
    },
    created() {
      this.carregarAnuncios();
    },
    methods: {
      carregarAnuncios() {
        // Aqui, você pode fazer uma chamada para a API ou carregar dados fictícios.
        // Por enquanto, vou simular com alguns dados fixos:
        this.anuncios = [
          { id: 1, titulo: "Anúncio 1", descricao: "Descrição do anúncio 1" },
          { id: 2, titulo: "Anúncio 2", descricao: "Descrição do anúncio 2" },
          { id: 3, titulo: "Anúncio 3", descricao: "Descrição do anúncio 3" },
        ];
      },
      editarAnuncio(id) {
        // Redireciona para a página de edição do anúncio
        this.$router.push(`/editarAnuncio/${id}`);
      },
      excluirAnuncio(id) {
        // Simulação de exclusão. Aqui, você faria uma chamada à API para excluir o anúncio.
        this.anuncios = this.anuncios.filter(anuncio => anuncio.id !== id);
        alert('Anúncio excluído com sucesso!');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Imagem de fundo */
  .imagem {
    background-image: url("@/layouts/cadastro.jpeg");
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  
  /* Container principal dos anúncios */
  .meus-anuncios-container {
    background-color: rgba(255, 255, 255, 0.85);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 1200px;
    margin: 50px auto;
  }
  
  /* Estilo da lista de anúncios */
  .anuncios-list {
    list-style-type: none;
    padding: 0;
  }
  
  .anuncio-item {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    margin: 10px 0;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .anuncio-details h3 {
    color: #333;
    font-size: 1.2rem;
  }
  
  .anuncio-details p {
    margin-top: 8px;
    color: #555;
  }
  
  .anuncio-actions button {
    margin-left: 10px;
    padding: 8px 15px;
    background-color: #00b33c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .anuncio-actions button:hover {
    background-color: #007e2b;
  }
  
  /* Estilo para quando não houver anúncios */
  .meus-anuncios-container p {
    font-size: 1.2rem;
    color: #666;
    text-align: center;
  }
  </style>
  