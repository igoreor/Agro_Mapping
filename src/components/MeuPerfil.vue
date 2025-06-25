<template>
  <div class="profile-page">
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando perfil...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchProfileData">Tentar Novamente</button>
    </div>
    
    <div v-else-if="user" class="profile-container">
      
      <div class="profile-card header-card">
        <div class="avatar-container">
          <img :src="user.avatar || defaultAvatar" alt="Foto de Perfil" class="profile-avatar">
        </div>
        <div class="user-info">
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="user-email">{{ user.email }}</p>
          <p class="member-since">Membro desde: {{ formatDate(user.memberSince) }}</p>
        </div>
        <button class="btn btn-edit-profile" @click="openEditModal">
          <i class="bi bi-pencil-square"></i> Editar Perfil
        </button>
      </div>

      <div class="details-grid">
        <div class="profile-card">
          <h2 class="card-title">Informações de Contato</h2>
          <div class="info-row">
            <i class="bi bi-telephone-fill"></i>
            <span>{{ user.phone }}</span>
          </div>
          <div class="info-row">
            <i class="bi bi-envelope-fill"></i>
            <span>{{ user.email }}</span>
          </div>
        </div>

        <div class="profile-card">
          <h2 class="card-title">Endereço Principal</h2>
          <div class="info-row">
            <i class="bi bi-geo-alt-fill"></i>
            <span>{{ user.address }}</span>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h2 class="card-title">Histórico de Pedidos</h2>
        <div v-if="orderHistory.length > 0" class="order-list">
          <div v-for="order in orderHistory" :key="order.id" class="order-item">
            <div class="order-details">
              <span class="order-id">Pedido #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.date) }}</span>
            </div>
            <div class="order-summary">
              <span class="order-total">R$ {{ order.total.toFixed(2) }}</span>
              <span :class="['status-badge', `status-${order.status.toLowerCase()}`]">{{ order.status }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-orders">
          <p>Você ainda não fez nenhum pedido.</p>
        </div>
      </div>
      
      <div class="account-actions">
        <button class="btn btn-secondary">Alterar Senha</button>
        <button class="btn btn-danger">Sair <i class="bi bi-box-arrow-right"></i></button>
      </div>

    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-panel">
        <h3 class="modal-title">Editar Perfil</h3>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input type="text" id="name" v-model="editableUser.name" class="form-input">
          </div>
          <div class="form-group">
            <label for="phone">Telefone</label>
            <input type="tel" id="phone" v-model="editableUser.phone" class="form-input">
          </div>
          <div class="form-group">
            <label for="address">Endereço</label>
            <textarea id="address" v-model="editableUser.address" class="form-input" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Estado inicial
const user = ref(null);
const orderHistory = ref([]);
const isLoading = ref(true);
const error = ref(null);

const defaultAvatar = 'https://via.placeholder.com/150';

// Busca os dados da API quando o componente é montado
onMounted(() => {
  fetchProfileData();
});

const fetchProfileData = async () => {
  isLoading.value = true;
  error.value = null;

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    error.value = "Usuário não autenticado. Por favor, faça o login novamente.";
    isLoading.value = false;
    // Opcional: redirecionar para a página de login
    // router.push('/login');
    return;
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  try {
    // Faz as chamadas à API em paralelo para mais eficiência
    const [userResponse, ordersResponse] = await Promise.all([
      // TODO: Confirme se este é o endpoint correto para buscar o usuário
      axios.get(`https://agro-mapping.onrender.com/usuario/${usuarioId}`, config),
      
      // TODO: Confirme se este é o endpoint correto para buscar os pedidos
      axios.get(`https://agro-mapping.onrender.com/pedidos/usuario/${usuarioId}`, config)
    ]);

    user.value = userResponse.data;
    orderHistory.value = ordersResponse.data;

  } catch (err) {
    console.error("Erro ao buscar dados do perfil:", err);
    error.value = "Não foi possível carregar os dados do seu perfil. Tente novamente mais tarde.";
  } finally {
    isLoading.value = false;
  }
};


// Lógica do Modal de Edição
const showEditModal = ref(false);
const editableUser = ref({});

const openEditModal = () => {
  editableUser.value = { ...user.value };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const saveProfile = async () => {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    alert("Sua sessão expirou. Faça o login novamente.");
    return;
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  try {
    // TODO: Confirme se este é o endpoint/método (PUT ou PATCH) correto para atualizar o usuário
    const response = await axios.put(`https://agro-mapping.onrender.com/usuario/${usuarioId}`, editableUser.value, config);
    
    user.value = response.data; // Atualiza o perfil com os dados retornados pela API
    
    closeEditModal();
    alert("Perfil atualizado com sucesso!");

  } catch (err) {
    console.error("Erro ao salvar o perfil:", err);
    alert("Não foi possível salvar as alterações. Tente novamente.");
  }
};

// Função para formatar datas
const formatDate = (dateString) => {
  if (!dateString) return 'Data indisponível';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>

<style scoped>
.profile-page {
  background-color: #f4f7f6;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #555;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #059669;
  animation: spin 1s ease infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
}
/* O resto do CSS permanece o mesmo da resposta anterior */
.profile-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
}

.header-card {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e0e0e0;
}

.user-info { flex-grow: 1; }
.user-name { font-size: 28px; font-weight: 700; color: #333; margin: 0 0 4px 0; }
.user-email { font-size: 16px; color: #666; margin: 0; }
.member-since { font-size: 14px; color: #888; margin-top: 8px; }

.btn-edit-profile { background-color: #e8f5e9; color: #059669; font-weight: 600; border: none; display: flex; align-items: center; gap: 8px; }
.btn-edit-profile:hover { background-color: #d1ead3; }

.details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.card-title { font-size: 20px; font-weight: 600; color: #333; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.info-row { display: flex; align-items: center; gap: 12px; font-size: 16px; color: #555; margin-bottom: 12px; }
.info-row i { color: #059669; }

.order-list { display: flex; flex-direction: column; gap: 16px; }
.order-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid #eee; border-radius: 8px; transition: background-color 0.2s, box-shadow 0.2s; }
.order-item:hover { background-color: #fafafa; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.order-id { font-weight: 600; color: #333; }
.order-date { font-size: 14px; color: #777; margin-left: 16px; }
.order-total { font-weight: 700; font-size: 18px; color: #059669; }
.status-badge { padding: 5px 12px; border-radius: 16px; font-size: 12px; font-weight: 700; margin-left: 20px; color: #fff; text-transform: uppercase; }
.status-entregue { background-color: #4CAF50; }
.status-pendente { background-color: #FFC107; color: #333; }
.status-cancelado { background-color: #F44336; }
.no-orders { text-align: center; color: #888; padding: 20px; }
.account-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; }

.btn { padding: 10px 20px; font-size: 16px; border-radius: 8px; font-weight: 600; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
.btn-primary { background-color: #10b981; color: white; }
.btn-primary:hover { background-color: #059669; }
.btn-secondary { background-color: #e5e7eb; color: #1f2937; }
.btn-secondary:hover { background-color: #d1d5db; }
.btn-danger { background-color: #ef4444; color: white; }
.btn-danger:hover { background-color: #dc2626; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-panel { background-color: #fff; padding: 2rem; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
.modal-title { font-size: 24px; font-weight: 700; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
.form-input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
.form-input:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }

@media (max-width: 768px) {
  .header-card { flex-direction: column; text-align: center; }
  .details-grid { grid-template-columns: 1fr; }
  .order-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .order-summary { width: 100%; display: flex; justify-content: space-between; align-items: center; }
}
</style>