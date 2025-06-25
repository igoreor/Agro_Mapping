<template>
  <div class="pesquisa-page">
    <div class="container">
      <div class="search-container">
        <h1 class="search-title">Encontre Produtos Frescos</h1>
        <p class="search-subtitle">Busque por frutas, verduras, legumes e muito mais.</p>
        <div class="search-bar">
          <input
            type="text"
            v-model="termoBusca"
            placeholder="O que você está procurando?"
            @keyup.enter="buscarProdutos"
            class="search-input"
          />
          <button @click="buscarProdutos" class="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Buscar</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="feedback-container">
        <p>Buscando produtos...</p>
      </div>

      <div v-if="erro" class="feedback-container erro-box">
        <p>{{ erro }}</p>
      </div>
      
      <ModernoSearchResults :results="produtos" />

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// 3. IMPORTE O COMPONENTE DE RESULTADOS QUE CRIAMOS
import ModernoSearchResults from '../components/ModernoSearchResults.vue'; 

// Estado da página
const termoBusca = ref('');
const produtos = ref([]);
const loading = ref(false);
const erro = ref(null);

// Função para buscar produtos na API
const buscarProdutos = async () => {
  if (!termoBusca.value.trim()) {
    erro.value = 'Por favor, digite algo para buscar.';
    return;
  }
  
  loading.value = true;
  erro.value = null;
  produtos.value = []; // Limpa resultados anteriores

  try {
    const response = await axios.get(`https://agro-mapping.onrender.com/produto/buscar?nome=${termoBusca.value}`);
    produtos.value = response.data;

    if (response.data.length === 0) {
      // A mensagem de "Nenhum produto encontrado" já é tratada pelo componente ModernoSearchResults
    }

  } catch (err) {
    console.error('Erro na busca:', err);
    erro.value = 'Ocorreu um erro ao buscar os produtos. Tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.pesquisa-page {
  background-color: #f9fafb;
  min-height: 90vh;
  padding-bottom: 3rem;
  font-family: sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Estilos da Barra de Busca */
.search-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  margin-bottom: 2.5rem;
  text-align: center;
}

.search-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.search-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #d1d5db;
  border-radius: 2rem;
  overflow: hidden;
}

.search-input {
  flex-grow: 1;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  outline: none;
}

.search-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #059669;
}

/* Feedback */
.feedback-container {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
}
.erro-box {
  color: #b91c1c;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.5rem;
}
</style>