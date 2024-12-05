<template>
    <div class="produtos-container">
      <h2>Carrinho</h2>
      <div v-if="itensPedido.length" class="produtos-details">
        <p><strong>Itens do Pedido:</strong></p>
        <ul>
          <li v-for="(item, index) in itensPedido" :key="index">
            <p><strong>Produto:</strong> {{ item.produto.nome }}</p>
            <p><strong>Descrição:</strong> {{ item.produto.descricao }}</p>
            <p><strong>Categoria:</strong> {{ item.produto.categoria }}</p>
            <p><strong>Preço:</strong> R$ {{ item.produto.preco.toFixed(2) }}</p>
            <p><strong>Quantidade:</strong> {{ item.quantidade }}</p>
            <button @click="exluir" class="excluir">
            excluir
        </button>
          </li>
        </ul>
        <button @click="completarCompras" class="completar-compras-btn">
            Completar Compras
        </button>
      </div>
      <p v-else-if="erro" class="erro">{{ erro }}</p>
      <p v-else class="erro">Nenhum item de pedido encontrado.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        itensPedido: [],
        erro: null,
      };
    },
    mounted() {
      this.buscarItensPedido();
    },
    methods: {
      async buscarItensPedido() {
        const token = localStorage.getItem('token');
        const usuarioId = localStorage.getItem('usuarioId');
        try {
          const resposta = await axios.get(`http://localhost:8090/itemPedido/usuario/${usuarioId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.itensPedido = resposta.data; // Supondo que o retorno seja uma lista de ItemPedidoResponseDTO
        } catch (erro) {
          this.erro = 'Erro ao carregar itens do pedido. Tente novamente mais tarde.';
        }
      },async completarCompras() {
        const token = localStorage.getItem('token');
        const usuarioId = localStorage.getItem('usuarioId');
        const dataPedido = new Date().toISOString().split('T')[0]; // Formata para AAAA-MM-DD
        const itens = this.itensPedido.map(item => ({
            produtoId: item.produto.id,
            quantidade: item.quantidade,
            idUsuario: item.idUsuario,
        }));
            console.log('Itens com ID inválido:', itens);

            if (idsInvalidos.length > 0) {
                this.erro = 'Um ou mais itens possuem ID inválido. Verifique o carrinho.';
                return;
            }

        const pedidoRequestDTO = {
            dataPedido,
            idUsuario: usuarioId,
            itens,
        };

        try {
            const resposta = await axios.post('http://localhost:8090/pedido', pedidoRequestDTO, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            alert('Pedido realizado com sucesso!');
            this.itensPedido = []; // Limpa os itens do pedido
        } catch (erro) {
            this.erro = 'Erro ao realizar o pedido. Tente novamente mais tarde.';
        }
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

  .completar-compras-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.completar-compras-btn:hover {
  background-color: #218838;
}

.erro {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
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
  