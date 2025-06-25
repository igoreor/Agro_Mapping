<template>
  <div class="carrinho-page">
    <div class="container">
      <h1 class="carrinho-titulo">
        Meu Carrinho
      </h1>

      <div v-if="loading" class="feedback-container">
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Carregando itens...</p>
      </div>

      <div v-else-if="erro" class="feedback-container erro-box" role="alert">
        <strong>Ocorreu um erro!</strong>
        <span>{{ erro }}</span>
      </div>

      <div v-else-if="!itensPedido.length" class="feedback-container">
        <svg class="carrinho-vazio-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3>Seu carrinho está vazio</h3>
        <p>Comece a adicionar produtos para vê-los aqui.</p>
        <div class="mt-6">
          <router-link to="/search" class="btn btn-primary">
            Procurar Produtos
          </router-link>
        </div>
      </div>

      <div v-else class="carrinho-layout">
        <div class="itens-lista">
          <div class="card">
            <div v-for="item in itensPedido" :key="item.produto.id" class="item-pedido">
              <img :src="item.produto.imagem || 'https://via.placeholder.com/150'" :alt="item.produto.nome" class="item-imagem">
              <div class="item-detalhes">
                <h3>{{ item.produto.nome }}</h3>
                <p class="item-categoria">{{ item.produto.categoria }}</p>
                <p class="item-preco">R$ {{ item.produto.preco.toFixed(2) }}</p>
              </div>
              <div class="item-acoes">
                <p>Qtd: <strong>{{ item.quantidade }}</strong></p>
                <button @click="removerItem(item.produto.id)" class="btn-remover">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="resumo-pedido">
          <div class="card sticky-card">
            <h2>Resumo do Pedido</h2>
            <div class="resumo-linhas">
              <div class="resumo-linha">
                <span>Subtotal</span>
                <span>R$ {{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="resumo-linha">
                <span>Frete (Estimado)</span>
                <span>R$ 5.00</span>
              </div>
              <div class="resumo-linha total">
                <strong>Total</strong>
                <strong>R$ {{ (subtotal + 5.00).toFixed(2) }}</strong>
              </div>
            </div>
            <button 
              @click="completarCompras"
              :disabled="isSubmitting"
              class="btn btn-primary btn-finalizar">
              <svg v-if="isSubmitting" class="spinner-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Processando...' : 'Finalizar Compra' }}</span>
            </button>
            <router-link to="/search" class="link-continuar">
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

// Estado do componente (lógica idêntica à versão com Tailwind)
const itensPedido = ref([]);
const erro = ref(null);
const loading = ref(true);
const isSubmitting = ref(false);

const buscarItensPedido = async () => {
  loading.value = true;
  erro.value = null;
  const token = localStorage.getItem('token');
  const usuarioId = localStorage.getItem('usuarioId');

  if (!token || !usuarioId) {
    erro.value = 'Você precisa estar logado para ver seu carrinho.';
    loading.value = false;
    return;
  }

  try {
    const resposta = await axios.get(`https://agro-mapping.onrender.com/itemPedido/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    itensPedido.value = resposta.data;
  } catch (err) {
    erro.value = 'Não foi possível carregar os itens do carrinho.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

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
          headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pedido realizado com sucesso!');
      itensPedido.value = [];
      router.push('/meusPedidos');
  } catch (err) {
      erro.value = 'Ocorreu um erro ao finalizar o pedido. Tente novamente.';
      console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const removerItem = (produtoId) => {
  console.log(`Remover item com ID: ${produtoId}`);
  alert("Funcionalidade de remover item ainda não implementada no backend.");
};

const subtotal = computed(() => {
  return itensPedido.value.reduce((total, item) => {
    return total + (item.produto.preco * item.quantidade);
  }, 0);
});

onMounted(() => {
  buscarItensPedido();
});
</script>

<style scoped>
/* Estilos Gerais */
.carrinho-page {
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2rem 0;
  font-family: sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.carrinho-titulo {
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

/* Layout do Carrinho */
.carrinho-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.itens-lista {
  width: 100%;
}

.resumo-pedido {
  width: 100%;
}

.sticky-card {
  position: sticky;
  top: 2rem;
}

/* Itens do Pedido */
.item-pedido {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.item-pedido:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-imagem {
  width: 6rem;
  height: 6rem;
  border-radius: 0.375rem;
  object-fit: cover;
  flex-shrink: 0;
}

.item-detalhes {
  flex-grow: 1;
  text-align: center;
}
.item-detalhes h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}
.item-categoria {
  font-size: 0.875rem;
  color: #6b7280;
}
.item-preco {
  color: #059669;
  font-weight: bold;
  margin-top: 0.25rem;
}

.item-acoes {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Resumo do Pedido */
.resumo-pedido h2 {
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.resumo-linhas {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resumo-linha {
  display: flex;
  justify-content: space-between;
}
.resumo-linha.total {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

/* Botões e Links */
.btn {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #10b981;
  color: white;
}

.btn-primary:hover {
  background-color: #059669;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-finalizar {
  width: 100%;
  margin-top: 1.5rem;
  font-size: 1.125rem;
}

.btn-remover {
  background: none;
  border: none;
  cursor: pointer;
  color: #ef4444;
}
.btn-remover:hover {
  color: #dc2626;
}

.link-continuar {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #059669;
  text-decoration: none;
}
.link-continuar:hover {
  text-decoration: underline;
}

/* Feedback e Estados Vazios */
.feedback-container {
  text-align: center;
  padding: 4rem 1rem;
}
.feedback-container h3 {
  margin-top: 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: #111827;
}
.feedback-container p {
  margin-top: 0.25rem;
  color: #6b7280;
}
.erro-box {
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.5rem;
}
.carrinho-vazio-icon {
  margin: 0 auto;
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
}

/* Spinners */
.spinner {
  animation: spin 1s linear infinite;
  height: 2rem;
  width: 2rem;
  color: #10b981;
  margin: 0 auto;
}
.spinner-btn {
  animation: spin 1s linear infinite;
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.75rem;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Media Queries para Responsividade */
@media (min-width: 640px) {
  .item-pedido {
    flex-direction: row;
    text-align: left;
  }
  .item-detalhes {
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .carrinho-layout {
    flex-direction: row;
  }
  .itens-lista {
    width: 66.66%;
  }
  .resumo-pedido {
    width: 33.33%;
  }
}
</style>