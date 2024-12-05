<template>
  <div class="imagem">
  </div>
  <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="fazerLogin">
          <div class="input-group">
              <label for="email">Email:</label>
              <input type="email" v-model="email" id="email" required />
          </div>
          <div class="input-group">
              <label for="senha">Senha:</label>
              <input type="password" v-model="senha" id="senha" required />
          </div>
          <button type="submit">Entrar</button>
          <p v-if="erro" class="erro">{{ erro }}</p>
      </form>
      <p>Não tem uma conta? <router-link to="/registro">Registre-se</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
          email: '',
          senha: '',
          erro: null,
      };
  },
  methods: {
    
      async fazerLogin() {
          
          if (!this.email || !this.senha) {
              this.erro = 'Por favor, preencha todos os campos.';
              return;
          }

          try {
              const resposta = await axios.post('http://localhost:8090/api/login', {
                  email: this.email,
                  senha: this.senha,
              });

              const token = resposta.data.token;
              localStorage.setItem('token', token); 

           
              const role = this.extractRoleFromToken(token);
              localStorage.setItem('role', role); 
              const decodedToken = this.decodeJWT(token);
              if (decodedToken && decodedToken.idUsuario) {
                this.usuarioId = decodedToken.idUsuario; 
              } else {
                this.erro = 'Token inválido ou malformado.';
                this.$router.push('/login');
                return;
              }
              localStorage.setItem('usuarioId', decodedToken.idUsuario);
              
              if (role === 'ADMIN') {
                  this.$router.push('/admin-dashboard'); 
              } else {
                  this.$router.push('/'); 
              }
          } catch (erro) {
              this.erro = 'Email ou senha incorretos.'; 
          }
      },

     
      extractRoleFromToken(token) {
          try {
              const base64Url = token.split('.')[1]; 
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
              const jsonPayload = decodeURIComponent(
                  atob(base64)
                      .split('')
                      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
              );

              const decoded = JSON.parse(jsonPayload); 
              return decoded.UserRole; 
          } catch (e) {
              console.error('Erro ao extrair role do token:', e);
              return null;
          }
      },
      decodeJWT(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload); 
      } catch (error) {
        console.error('Erro ao decodificar o JWT:', error);
        return null; 
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto; 
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f977; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}
.imagem {
  background-image: url('@/layouts/background.jpg'); 
  background-size: cover;  
  background-position: center;  
  background-repeat: no-repeat; 
  height: 100vh; 
  width: 100%;    
  position: absolute; 
  top: 0; 
  left: 0; 
  z-index: -1; 
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
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
