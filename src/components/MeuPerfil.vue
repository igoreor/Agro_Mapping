<template>
  <div class="profile-container">
    <h2>Perfil</h2>
    <div v-if="usuario" class="profile-details">
      <p><strong>Nome:</strong> {{ usuario.nome }}</p>
      <p><strong>Email:</strong> {{ usuario.email }}</p>
      <p><strong>Telefone:</strong> {{ listarTelefones() }}</p>
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
    listarTelefones() {
      if (this.usuario && Array.isArray(this.usuario.contatos)) {
        return this.usuario.contatos.map(contato => contato.telefone).join(', ');
      }
      return 'Nenhum telefone disponível';
    },
  },
};
</script>

<style scoped>
.profile-container {
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

.profile-details p {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
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
