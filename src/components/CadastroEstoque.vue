<template>
  <div class="imagem"></div>
  <div class="imagem"></div>
  <div class="voltarParaCadastro">
    <voltarParaCadastro
      @click="voltarParaCadastro"
    >
      Voltar
  </voltarParaCadastro>
  </div>
  <div
    class="cadastro-estoque-container bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 p-10 rounded-3xl shadow-xl max-w-md mx-auto mt-16 text-center"
  >
    <h2 class="text-3xl text-white mb-6">Cadastro de Estoque</h2>

    <form @submit.prevent="cadastrarEstoque" class="space-y-6">
      <div class="input-group">
        <label for="quantidade" class="block text-lg text-white mb-2">Quantidade Disponível:</label>
        <input
          type="number"
          v-model="estoque.quantidadeDisponivel"
          id="quantidade"
          required
          placeholder="Digite a quantidade disponível"
          min="0"
          class="w-full p-4 text-lg bg-transparent border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-lg hover:bg-gradient-to-l from-green-500 to-blue-600 focus:ring-2 focus:ring-indigo-500 transition"
      >
        Cadastrar Estoque
      </button>

      <p v-if="erro" class="text-red-500 text-sm mt-4">{{ erro }}</p>
      <p v-if="isSubmitting" class="text-yellow-300">Enviando, aguarde...</p>
    </form>
  </div>

 
  <div v-if="showSuccessPopup" class="popup-overlay">
    <div class="popup-content">
      <p class="popup-message">Produto cadastrado com sucesso!</p>
      <button @click="closePopup" class="popup-close-btn">Fechar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      estoque: {
        quantidadeDisponivel: 0,
      },
      produtoId: null,
      erro: "",
      isSubmitting: false,
      showSuccessPopup: false, 
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.produtoId = urlParams.get("produtoId");

    if (!this.produtoId) {
      this.erro = "ID do produto não encontrado. Volte ao cadastro de produto.";
    }
  },
  methods: {
    async cadastrarEstoque() {
      this.erro = "";
      this.isSubmitting = true;

      try {
        const resposta = await axios.post(
          `http://localhost:8090/estoque?produtoId=${this.produtoId}`,
          { quantidadeDisponivel: this.estoque.quantidadeDisponivel },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Estoque cadastrado:", resposta.data);
        this.showSuccessPopup = true; 
      } catch (erro) {
        console.error("Erro ao cadastrar estoque:", erro);
        if (erro.response && erro.response.data) {
          this.erro = erro.response.data.message || "Erro ao cadastrar estoque.";
        } else {
          this.erro = "Erro ao conectar com o servidor.";
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    closePopup() {
      this.showSuccessPopup = false;
      this.$router.push("/"); 
    },
    voltarParaCadastro() {
      this.$router.push('/cadastroProdutos');
    }
  },
};
</script>

<style scoped>
.cadastro-estoque-container {
  background-color: #f9f9f977;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
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
  border-radius: 8px;
  background-color: #f0f0f0;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #4038a0;
  box-shadow: 0 0 5px rgba(64, 56, 160, 0.5);
}

button {
  padding: 12px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.imagem {
  background-image: url("@/layouts/cadastro.jpeg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

/* Popup de sucesso */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.popup-message {
  font-size: 18px;
  color: green;
}

.popup-close-btn {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}
.voltarParaCadastro {
  position: absolute;
  top: 30px;   
  background-color: darkblue;
  left: 30px;  
  color: white; 
  padding: 10px 20px; 
  font-size: 16px; 
  border: none; 
  border-radius: 8px;
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.voltarParaCadastro:hover {
  background-color: #42b983; 
}
</style>
