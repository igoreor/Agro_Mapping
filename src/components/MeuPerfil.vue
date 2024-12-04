<template>
    <div class="profile-container">
      <h2>Editar Perfil</h2>
      <form @submit.prevent="atualizarPerfil">
        <div class="input-group">
          <label for="nome">Nome:</label>
          <input type="text" v-model="usuario.nome" id="nome" required />
        </div>
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" v-model="usuario.email" id="email" required disabled />
        </div>
        <div class="input-group">
          <label for="telefone">Telefone:</label>
          <input type="text" v-model="usuario.telefone" id="telefone" />
        </div>
        <button type="submit">Salvar Alterações</button>
        <p v-if="erro" class="erro">{{ erro }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        usuario: {
          nome: '',
          email: '',
          telefone: '',
        },
        erro: null,
      };
    },
    mounted() {
      this.buscarPerfil();
    },
    methods: {
      async buscarPerfil() {
        const token = localStorage.getItem('token');
        try {
          const resposta = await axios.get('http://localhost:8090/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.usuario = resposta.data; // Atualiza os dados com a resposta do backend
        } catch (erro) {
          this.erro = 'Erro ao carregar perfil. Tente novamente mais tarde.';
        }
      },
  
      // Função para atualizar os dados do perfil
      async atualizarPerfil() {
        const token = localStorage.getItem('token');
        try {
          const resposta = await axios.put('http://localhost:8090/api/user', this.usuario, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.erro = null; // Limpa mensagens de erro
          alert('Perfil atualizado com sucesso!');
        } catch (erro) {
          this.erro = 'Erro ao atualizar perfil. Tente novamente.';
        }
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
  
  .input-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #555;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    border-color: #42b983;
    outline: none;
    box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
  }
  
  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #369b75;
  }
  
  .erro {
    color: red;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }
  
  p {
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  
  a {
    color: #42b983;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  