  <template>
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Meu Carrinho
        </h1>

        <div v-if="loading" class="text-center py-10">
          <svg class="animate-spin h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Carregando itens...</p>
        </div>

        <div v-else-if="erro" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
          <strong class="font-bold">Ocorreu um erro!</strong>
          <span class="block sm:inline">{{ erro }}</span>
        </div>

        <div v-else-if="!itensPedido.length" class="text-center py-16">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-xl font-medium text-gray-900">Seu carrinho está vazio</h3>
          <p class="mt-1 text-gray-500">Comece a adicionar produtos para vê-los aqui.</p>
          <div class="mt-6">
            <router-link to="/search" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Procurar Produtos
            </router-link>
          </div>
        </div>

        <div v-else class="flex flex-col lg:flex-row gap-8">
          <div class="w-full lg:w-2/3">
            <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div v-for="item in itensPedido" :key="item.produto.id" class="flex flex-col sm:flex-row items-center gap-4 border-b pb-4 last:border-b-0">
                <img :src="item.produto.imagem || 'https://via.placeholder.com/150'" :alt="item.produto.nome" class="w-24 h-24 rounded-md object-cover flex-shrink-0">
                <div class="flex-grow text-center sm:text-left">
                  <h3 class="text-lg font-semibold text-gray-800">{{ item.produto.nome }}</h3>
                  <p class="text-sm text-gray-500">{{ item.produto.categoria }}</p>
                  <p class="text-green-600 font-bold mt-1">R$ {{ item.produto.preco.toFixed(2) }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <p class="text-sm text-gray-600">Qtd: <span class="font-bold">{{ item.quantidade }}</span></p>
                  <button @click="removerItem(item.produto.id)" class="text-red-500 hover:text-red-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/3">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 class="text-xl font-semibold border-b pb-4 mb-4">Resumo do Pedido</h2>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Frete (Estimado)</span>
                  <span>R$ 5.00</span>
                </div>
                <div class="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t mt-4">
                  <span>Total</span>
                  <span>R$ {{ (subtotal + 5.00).toFixed(2) }}</span>
                </div>
              </div>
              <button 
                @click="completarCompras"
                :disabled="isSubmitting"
                class="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Processando...' : 'Finalizar Compra' }}</span>
              </button>
              <router-link to="/search" class="block text-center mt-4 text-green-600 hover:underline">
                Continuar Comprando
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // Estado do componente
  const itensPedido = ref([]);
  const erro = ref(null);
  const loading = ref(true);
  const isSubmitting = ref(false);

  // Função para buscar os itens do carrinho na API
  const buscarItensPedido = async () => {
    loading.value = true;
    erro.value = null;
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!token || !usuarioId) {
      erro.value = 'Você precisa estar logado para ver seu carrinho.';
      loading.value = false;
      // Opcional: redirecionar para login
      // router.push('/login'); 
      return;
    }

    try {
      const resposta = await axios.get(`https://agro-mapping.onrender.com/itemPedido/usuario/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      itensPedido.value = resposta.data;
    } catch (err) {
      erro.value = 'Não foi possível carregar os itens do carrinho.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Função para finalizar a compra
  const completarCompras = async () => {
    isSubmitting.value = true;
    erro.value = null;
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');
    const dataPedido = new Date().toISOString().split('T')[0];

    const itens = itensPedido.value.map(item => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
        idUsuario: item.idUsuario,
    }));

    const pedidoRequestDTO = {
        dataPedido,
        idUsuario: usuarioId,
        itens,
    };

    try {
        await axios.post('https://agro-mapping.onrender.com/pedido', pedidoRequestDTO, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert('Pedido realizado com sucesso!');
        itensPedido.value = []; // Limpa o carrinho na interface
        router.push('/meusPedidos'); // Redireciona para a página de pedidos
    } catch (err) {
        erro.value = 'Ocorreu um erro ao finalizar o pedido. Tente novamente.';
        console.error(err);
    } finally {
      isSubmitting.value = false;
    }
  };

  // Função para remover um item (exemplo, precisa de um endpoint na API)
  const removerItem = (produtoId) => {
    // Lógica para remover o item da API e depois da lista `itensPedido`
    console.log(`Remover item com ID: ${produtoId}`);
    alert("Funcionalidade de remover item ainda não implementada no backend.");
    // Exemplo de como seria na interface:
    // itensPedido.value = itensPedido.value.filter(item => item.produto.id !== produtoId);
  };

  // Propriedade computada para calcular o subtotal
  const subtotal = computed(() => {
    return itensPedido.value.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  });

  // Hook `onMounted` para buscar os dados quando o componente for montado
  onMounted(() => {
    buscarItensPedido();
  });
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
  