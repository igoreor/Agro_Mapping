<template>

  <div class="header-bottom-side-right">
        <img src="@/layouts/background.jpg" alt="Header Image" />
  </div>
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
              const resposta = await axios.post('http://localhost:8090/api/register', {
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
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

/* Corpo da página com centralização e fundo */
body {
  background-image: url('src/layouts/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Altura total da janela */
  margin: 0; /* Remove margens extras */
}

/* Container principal */
.registro-container {
  background-color: rgba(255, 255, 255, 0.9); /* Fundo branco semi-transparente */
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para destaque */
  max-width: 500px; /* Largura máxima */
  width: 100%; /* Adaptação responsiva */
  
  position: absolute; /* Ou 'fixed' se quiser que a centralização seja fixa mesmo ao rolar a página */
  top: 50%; /* Centraliza verticalmente */
  left: 50%; /* Centraliza horizontalmente */
  transform: translate(-50%, -50%); /* Ajusta para o centro exato */
}


/* Título */
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #0d009c;
  font-size: 24px;
}

/* Grupos de entrada */
.input-group {
  margin-bottom: 15px;
}

/* Rótulos */
label {
  display: block;
  margin-bottom: 5px;
  color: #0d009c;
  font-weight: bold;
}

/* Campos de entrada e seleção */
input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #0d009c;
  border-radius: 4px;
  background-color: transparent;
  outline: none;
  transition: border-color 0.3s ease;
}

/* Efeito de foco */
input:focus,
select:focus {
  border-color: #4038a0;
  box-shadow: 0 0 5px rgba(64, 56, 160, 0.5);
}

/* Botão */
button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Botão - Hover */
button:hover {
  background-color: #369b75;
}

/* Botão - Desabilitado */
button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Mensagens de erro */
.erro {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

/* Links e parágrafos */
p {

  text-align: center;
  font-size: 14px;
  color: #333;
  margin-top: 20px;
}

a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
