<template>
  <div class="produtos-container">
    <h2>Perfil</h2>
    <div v-if="usuario" class="produtos-details">
      <p><strong>Produtos:</strong></p>
      <ul>
        <li v-for="(produto, index) in listarProdutos()" :key="index">
          <p><strong>Nome:</strong> {{ produto.nome }}</p>
          <p><strong>Descrição:</strong> {{ produto.descricao }}</p>
          <p><strong>Categoria:</strong> {{ produto.categoria }}</p>
          <p><strong>Preço:</strong> R$ {{ produto.preco.toFixed(2) }}</p>
          <p><strong>Quantidade Disponível:</strong> {{ produto.quantidade }}</p>
        </li>
      </ul>
    </div>
    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuario: null,
      erro: null,
    };
  },
  mounted() {
    this.buscarPerfil();
  },
  methods: {
    async buscarPerfil() {
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId');
      try {
        const resposta = await axios.get(`http://localhost:8090/usuario/${usuarioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.usuario = resposta.data;
      } catch (erro) {
        this.erro = 'Erro ao carregar perfil. Tente novamente mais tarde.';
      }
    },
    listarProdutos() {
      if (this.usuario && Array.isArray(this.usuario.produtos)) {
        return this.usuario.produtos.map(produto => ({
          nome: produto.nome,
          descricao: produto.descricao,
          categoria: produto.categoria,
          preco: produto.preco,
          quantidade: produto.estoque?.quantidadeDisponivel || 'Indisponível',
        }));
      }
      return [];
    },
  },
};
</script>

<style scoped>
.produtos-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.produtos-details p {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

ul {
  padding-left: 20px;
  list-style-type: none;
}

li {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

li p {
  margin: 5px 0;
}

.strong {
  font-weight: bold;
}

.erro {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
