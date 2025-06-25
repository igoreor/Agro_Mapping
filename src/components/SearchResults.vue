<template>
  <div class="search-results-container">

    <div v-if="results && results.length > 0" class="results-grid">
      <div v-for="produto in results" :key="produto.id" class="product-card">
        <img :src="produto.imagem || 'https://via.placeholder.com/300x200'" :alt="produto.nome" class="product-image">
        <div class="product-info">
          <p class="product-category">{{ produto.categoria }}</p>
          <h3 class="product-name">{{ produto.nome }}</h3>
          <p class="product-price">R$ {{ produto.preco.toFixed(2) }}</p>
          <button @click="openModal(produto)" class="btn btn-add-to-cart">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <svg xmlns="http://www.w3.org/2000/svg" class="no-results-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3>Nenhum produto encontrado</h3>
      <p>Tente ajustar seus termos de busca na barra de pesquisa acima.</p>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel">
        <h3 class="modal-title">Adicionar ao Carrinho</h3>
        <div v-if="selectedProduct" class="modal-product-info">
          <img :src="selectedProduct.imagem || 'https://via.placeholder.com/150'" :alt="selectedProduct.nome" class="modal-product-image">
          <div>
            <strong>{{ selectedProduct.nome }}</strong>
            <p>R$ {{ selectedProduct.preco.toFixed(2) }}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="quantidade">Quantidade:</label>
          <input type="number" id="quantidade" v-model.number="quantidade" min="1" class="form-input">
        </div>
        <p v-if="erro" class="error-message">{{ erro }}</p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button @click="adicionarAoCarrinho" :disabled="isSubmitting" class="btn btn-primary">
            <svg v-if="isSubmitting" class="spinner-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Adicionando...' : 'Confirmar' }}</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Define as props que o componente espera receber (igual ao original)
const props = defineProps({
  results: {
    type: Array,
    required: true,
  },
});

// Estado do modal e do formulário (lógica original)
const showModal = ref(false);
const selectedProduct = ref(null);
const quantidade = ref(1);
const isSubmitting = ref(false);
const erro = ref(null);

// Funções do Modal (lógica original)
const openModal = (produto) => {
  selectedProduct.value = produto;
  quantidade.value = 1;
  erro.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

// Função para adicionar o item ao carrinho via API (lógica original)
const adicionarAoCarrinho = async () => {
  if (quantidade.value < 1) {
    erro.value = 'A quantidade deve ser de pelo menos 1.';
    return;
  }

  isSubmitting.value = true;
  erro.value = null;
  const usuarioId = localStorage.getItem('usuarioId');
  const token = localStorage.getItem('token');

  if (!usuarioId || !token) {
    erro.value = 'Você precisa estar logado para adicionar itens ao carrinho.';
    isSubmitting.value = false;
    return;
  }

  const itemPedidoDTO = {
    produtoId: selectedProduct.value.id,
    quantidade: quantidade.value,
    idUsuario: usuarioId,
  };

  try {
    await axios.post('https://agro-mapping.onrender.com/itemPedido/adicionar', itemPedidoDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Produto adicionado ao carrinho com sucesso!');
    closeModal();
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err);
    erro.value = 'Não foi possível adicionar o produto. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Estilos para o componente, sem precisar de Tailwind CSS */
.search-results-container {
  width: 100%;
}

/* Grade de Produtos */
.results-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* 1 coluna por padrão (mobile) */
  gap: 1.5rem;
}

.product-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px -3px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-category {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0.25rem 0;
}

.product-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #059669;
  margin-bottom: 1rem;
}

.btn-add-to-cart {
  width: 100%;
  margin-top: auto; /* Empurra o botão para o final do card */
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-panel {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.modal-product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-sizing: border-box; /* Garante que o padding não aumente a largura */
}

.error-message {
  color: #b91c1c;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Botões Genéricos */
.btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 0.375rem;
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
.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}

.spinner-btn {
  animation: spin 1s linear infinite;
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.75rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Nenhum Resultado */
.no-results {
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;
}
.no-results-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
}
.no-results h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

/* Media Queries para Responsividade da Grade */
@media (min-width: 640px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>