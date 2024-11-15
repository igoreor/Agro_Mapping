<template>
    <div class="registro-container">
      <h2>Cadastrar</h2>
      <form @submit.prevent="registrarUsuario">
        <div class="input-group">
          <label for="nome">Nome:</label>
          <input type="text" v-model="nome" id="nome" required />
        </div>
  
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
  
        <div class="input-group">
          <label for="dataDeNascimento">Data de Nascimento:</label>
          <input type="date" v-model="dataDeNascimento" id="dataDeNascimento" required />
        </div>
  
        <div class="input-group">
          <label for="senha">Senha:</label>
          <input type="password" v-model="senha" id="senha" required />
        </div>
  
        <div class="input-group">
          <label for="userRole">Escolha sua role:</label>
          <select v-model="userRole" id="userRole" required>
            <option value="USER">USER</option>
            <option value="SELLER">SELLER</option>
          </select>
        </div>
  
        <button type="submit" :disabled="isSubmitting">Registrar</button>
        <div>
          <p>Já tem uma conta? <router-link to="/login">Faça login</router-link></p>
        </div>
  
     
        <p v-if="erro" class="erro">{{ erro }}</p>
  
      
        <p v-if="isSubmitting">Registrando, aguarde...</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        nome: '',
        email: '',
        senha: '',
        dataDeNascimento: '',
        userRole: 'USER', 
        erro: '',         
        isSubmitting: false, 
      };
    },
    methods: {
      async registrarUsuario() {
        this.erro = ''; 
        this.isSubmitting = true;
  
        try {
        
          const resposta = await axios.post('http://localhost:8080/api/register', {
            nome: this.nome,
            email: this.email,
            senha: this.senha, 
            dataDeNascimento: this.dataDeNascimento,
            userRole: this.userRole,
          });
  
         
          this.$router.push('/login');
        } catch (erro) {
     
          if (erro.response && erro.response.data) {
            this.erro = erro.response.data.message || 'Erro ao registrar. Tente novamente.';
          } else {
            this.erro = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
          }
        } finally {
          this.isSubmitting = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  
  body {
    background-image: url("../images/vista-frontal-vegetal.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .registro-container {
    background-color: #ffffff80;
    padding: 30px;
    border-radius: 4%;
    box-shadow: 3px 3px 1px 0px #00000060;
    max-width: 400px;
    width: 100%;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #0d009c;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    color: #0d009c;
  }
  
  input,
  select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 2px solid #0d009c;
    background-color: transparent;
    outline: none;
    font-size: 16px;
    transition: all 0.3s ease-out;
  }
  
  input:focus,
  select:focus {
    border-color: #4038a0;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #369b75;
  }
  
  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  .erro {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
  
  p {
    text-align: center;
  }
  </style>
  