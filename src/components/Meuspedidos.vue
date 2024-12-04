<template>
    <div class="produtos-container">
      <h2>Pedidos do Usuário</h2>
      <div v-if="pedidos.length > 0" class="produtos-details">
        <ul>
          <li v-for="(pedido, pedidoIndex) in pedidos" :key="pedidoIndex">
            <h3>Pedido - {{ pedido.dataPedido }}</h3>
            <ul>
              <li v-for="(item, itemIndex) in pedido.itens" :key="itemIndex">
                <p><strong>Nome:</strong> {{ item.produto.nome }}</p>
                <p><strong>Descrição:</strong> {{ item.produto.descricao }}</p>
                <p><strong>Categoria:</strong> {{ item.produto.categoria }}</p>
                <p><strong>Preço:</strong> R$ {{ item.produto.preco.toFixed(2) }}</p>
                <p><strong>Quantidade:</strong> {{ item.quantidade }}</p>
              </li>
            </ul>
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
        pedidos: [],
        erro: null,
      };
    },
    mounted() {
      this.buscarPedidos();
    },
    methods: {
      async buscarPedidos() {
        const token = localStorage.getItem('token');
        const idUsuario = localStorage.getItem('usuarioId');
        try {
          const resposta = await axios.get(`http://localhost:8090/pedido/usuario/${idUsuario}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.pedidos = resposta.data;
        } catch (erro) {
          this.erro = 'Erro ao carregar pedidos. Tente novamente mais tarde.';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .produtos-container {
    max-width: 800px;
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
  
  h3 {
    font-size: 18px;
    color: #444;
    margin-bottom: 10px;
  }
  
  .produtos-details p {
    font-size: 16px;
    color: #555;
    margin-bottom: 5px;
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
  
  .erro {
    color: red;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }
  </style>
  