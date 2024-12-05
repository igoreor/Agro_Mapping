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

          <!-- Botões para excluir ou diminuir quantidade -->
          <button @click="diminuirQuantidade(item)" :disabled="item.quantidade <= 1">Diminuir</button>
          <button @click="deletarItem(item.id)">Excluir</button>
        </li>
      </ul>
      <button @click="completarCompras" class="completar-compras-btn">
        Completar Compras
      </button>
    </div>
    <p v-else-if="erro" class="erro">{{ erro }}</p>
    <p v-else class="erro">Nenhum item de pedido encontrado.</p>
  </div>

  <!-- Exibição de mensagens de erro e sucesso -->
  <p v-if="erro" class="erro">{{ erro }}</p>
  <p v-if="sucesso" class="sucesso">{{ sucesso }}</p>
  <p v-else class="erro">Nenhum item de pedido encontrado.</p>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      itensPedido: [],
      erro: null,
      sucesso: null,  // Novo campo para feedback de sucesso
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
    },

    async completarCompras() {
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId');
      const dataPedido = new Date().toISOString().split('T')[0]; // Formata para AAAA-MM-DD

      // Verificar se todos os itens têm ID válido
      const itensInvalidos = this.itensPedido.filter(item => !item.produto.id || !item.quantidade || item.quantidade <= 0);
      
      if (itensInvalidos.length > 0) {
        this.erro = 'Um ou mais itens possuem dados inválidos. Verifique o carrinho.';
        return;
      }

      const itens = this.itensPedido.map(item => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      }));

      const pedidoRequestDTO = {
        dataPedido,
        idUsuario: usuarioId,
        itens,
      };

      try {
        // Criar o pedido no backend
        const resposta = await axios.post('http://localhost:8090/pedido', pedidoRequestDTO, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Atualizar quantidade no backend (opcional, mas pode ser útil dependendo da lógica)
        for (let item of this.itensPedido) {
          await axios.put(`http://localhost:8090/itemPedido/${item.id}`, {
            quantidade: item.quantidade - 1, // Atualiza a quantidade no estoque
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // Feedback de sucesso para o usuário
        this.sucesso = 'Compra realizada com sucesso!';
        this.itensPedido = []; // Limpar o carrinho
      } catch (erro) {
        // Log de erro para depuração
        console.error(erro.response || erro.message || erro);
        this.erro = 'Erro ao realizar o pedido. Tente novamente mais tarde.';
      }
    },

    async deletarItem(itemId) {
      const token = localStorage.getItem('token');
      try {
        // Enviar solicitação para excluir item do pedido
        await axios.delete(`http://localhost:8090/itemPedido/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Atualizar a lista de itens após a exclusão
        this.itensPedido = this.itensPedido.filter(item => item.id !== itemId);
        this.sucesso = 'Item excluído com sucesso!';
      } catch (erro) {
        this.erro = 'Erro ao excluir item. Tente novamente mais tarde.';
        console.error(erro);
      }
    },

    async diminuirQuantidade(item) {
      const token = localStorage.getItem('token');
      console.log(item.id)
      if (item && item.quantidade > 1) {
        try {
          // Decrementar a quantidade localmente
          item.quantidade -= 1;

          // Enviar atualização para o backend
          await axios.put(`http://localhost:8090/itemPedido/${item.id}`, {
            quantidade: item.quantidade,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.sucesso = 'Quantidade atualizada com sucesso!';
        } catch (erro) {
          this.erro = 'Erro ao atualizar quantidade. Tente novamente mais tarde.';
          console.error(erro);
        }
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

.sucesso {
  color: green;
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

button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c82333;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
