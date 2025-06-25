<template>
  <div class="cadastro-contato-container">
    <h2>Cadastro de Contato</h2>

    <form @submit.prevent="cadastrarContato">
      <div class="input-group">
        <label for="telefone">Telefone:</label>
        <input
          type="text"
          v-model="telefone"
          id="telefone"
          required
          placeholder="Digite o número de telefone"
        />
      </div>

      <button type="submit" :disabled="isSubmitting">Cadastrar</button>

      <p v-if="erro" class="erro">{{ erro }}</p>
      <p v-if="isSubmitting">Enviando, aguarde...</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      telefone: '',
      erro: '',
      isSubmitting: false,
      usuarioId: '',
      usuarioRole: '', // Armazenar a role do usuário
    };
  },
  created() {
    // Verifica se há um token no localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('Token não encontrado no localStorage.');
      this.erro = 'Usuário não autenticado. Faça login novamente.';
      this.$router.push('/login');
      return;
    }

    // Se houver token, extraímos o ID do usuário e consultamos a API para pegar a role
    const decodedToken = this.decodeJWT(token);
    if (decodedToken && decodedToken.idUsuario) {
      this.usuarioId = decodedToken.idUsuario; // ID do usuário extraído do token
    } else {
      this.erro = 'Token inválido ou malformado.';
      this.$router.push('/login');
      return;
    }

    // Agora, fazemos uma requisição para o back-end para obter a role do usuário
    this.getUsuarioRole();
  },
  methods: {
    // Função para decodificar o JWT
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
        return JSON.parse(jsonPayload); // Retorna o payload decodificado
      } catch (error) {
        console.error('Erro ao decodificar o JWT:', error);
        return null; // Retorna null se houver erro
      }
    },

    // Método para consultar o back-end e pegar a role do usuário
    async getUsuarioRole() {
      try {
        const resposta = await axios.get(
          `https://agro-mapping.onrender.com/usuario/${this.usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Envia o token para autenticação
            },
          }
        );

        // Exibe a resposta completa da API para depuração
        console.log('Resposta completa da API:', resposta.data);

        // Atribuindo a role do usuário à variável usuarioRole
        this.usuarioRole = resposta.data.userRole; // Aqui você usa "userRole" para capturar a role do usuário

        
        console.log('Role do usuário recebida do backend:', this.usuarioRole);

        // Dependendo da role, redireciona para a página apropriada
        if (this.usuarioRole === 'SELLER') {
        
          this.$router.push('/cadastroProdutos'); // Redireciona para a página de cadastro de produtos
        }
      } catch (erro) {
        console.error('Erro ao obter a role do usuário:', erro);
        this.erro = 'Erro ao verificar a role do usuário.';
        this.$router.push('/login');
      }
    },

    // Método para cadastrar contato
    async cadastrarContato() {
      this.erro = '';
      this.isSubmitting = true;

      try {
        if (!this.usuarioId) {
          throw new Error('ID do usuário não encontrado. Faça login novamente.');
        }

        const resposta = await axios.post(
          `https://agro-mapping.onrender.com/contato?usuarioId=${this.usuarioId}`,
          {
            telefone: this.telefone,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Envia o token para autenticação
            },
          }
        );

        // Exibe um alert após o contato ser cadastrado
     

        // Após o cadastro do contato, redireciona para a página inicial
        this.$router.push('/');
      } catch (erro) {
        console.error('Erro ao cadastrar contato:', erro);

        if (erro.response && erro.response.data) {
          this.erro = erro.response.data.message || 'Erro ao cadastrar contato.';
        } else {
          this.erro = 'Erro ao conectar com o servidor.';
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>


<style scoped>
/* Estilos para o componente */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.cadastro-contato-container {
  background-color: #f9f9f977;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  margin: 50px auto;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #0d009c;
  font-size: 24px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #0d009c;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #0d009c;
  border-radius: 4px;
  background-color: transparent;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #4038a0;
  box-shadow: 0 0 5px rgba(64, 56, 160, 0.5);
}

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

button:hover {
  background-color: #369b75;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.erro {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
