<template>
  <div class="imagem"></div>

  <div
    class="cadastro-produto-container bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 p-10 rounded-3xl shadow-xl max-w-md mx-auto mt-16 text-center"
  >
    <h2 class="text-3xl text-white mb-6">Cadastro de Produto</h2>

    <form @submit.prevent="cadastrarProduto" class="space-y-6" id="reservation-form">
      <div class="input-group">
        <label for="nome" class="block text-lg text-white mb-2">Nome:</label>
        <input
          type="text"
          v-model="produto.nome"
          id="nome"
          required
          placeholder="Digite o nome do produto"
          class="w-full p-4 text-lg bg-transparent border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
      </div>

      <div class="input-group">
        <label for="categoria" class="block text-lg text-white mb-2">Categoria:</label>
        <input
          type="text"
          v-model="produto.categoria"
          id="categoria"
          required
          placeholder="Digite a categoria do produto"
          class="w-full p-4 text-lg bg-transparent border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
      </div>

      <div class="input-group">
        <label for="preco" class="block text-lg text-white mb-2">Preço:</label>
        <input
          type="number"
          v-model="produto.preco"
          id="preco"
          required
          placeholder="Digite o preço do produto"
          min="0"
          step="0.01"
          class="w-full p-4 text-lg bg-transparent border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
      </div>

      <div class="input-group">
        <label for="descricao" class="block text-lg text-white mb-2">Descrição:</label>
        <textarea
          v-model="produto.descricao"
          id="descricao"
          required
          placeholder="Digite a descrição do produto"
          class="w-full p-4 text-lg bg-transparent border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none min-h-32"
        ></textarea>
      </div>

      <div class="input-group">
        <label for="imagem" class="block text-lg text-white mb-2">Imagem:</label>
        <div class="relative w-full border-2 border-white rounded-lg overflow-hidden">
          <input
            type="file"
            id="image-upload"
            @change="previewImage"
            accept="image/*"
            class="absolute inset-0 opacity-0 cursor-pointer"
          />

          <img
            v-if="produto.imagemPreview"
            :src="produto.imagemPreview"
            alt="Pré-visualização"
            id="product-image-preview"
            class="preview-image"
          />
          <div v-else class="w-full h-32 bg-gray-300 flex items-center justify-center text-white">
            Selecionar Imagem
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-lg hover:bg-gradient-to-l from-green-500 to-blue-600 focus:ring-2 focus:ring-indigo-500 transition"
      >
        Cadastrar
      </button>

      <p v-if="erro" class="text-red-500 text-sm mt-4">{{ erro }}</p>
      <p v-if="isSubmitting" class="text-yellow-300">Enviando, aguarde...</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      produto: {
        nome: "",
        categoria: "",
        preco: "",
        descricao: "",
        imagem: null,
        imagemPreview: null,
        usuarioId: localStorage.getItem("usuarioId") || "", // Pegue o ID do usuário do localStorage
      },
      erro: "",
      isSubmitting: false,
    };
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.produto.imagemPreview = reader.result;
          this.produto.imagem = file.name; // Enviar o nome do arquivo
        };
        reader.readAsDataURL(file);
      }
    },
    async cadastrarProduto() {
      this.erro = "";
      this.isSubmitting = true;

      try {
        const usuarioId = localStorage.getItem("usuarioId"); // Pegue o usuarioId do localStorage

        if (!usuarioId) {
          throw new Error("Usuário não autenticado. Faça login novamente.");
        }

        const produtoDTO = {
          nome: this.produto.nome,
          categoria: this.produto.categoria,
          descricao: this.produto.descricao,
          preco: parseFloat(this.produto.preco),
          imagem: this.produto.imagem, // Apenas o nome ou caminho da imagem
          usuarioId, // Passe o UUID do usuário
        };

        const resposta = await axios.post(
          `http://localhost:8090/produto?usuarioId=${usuarioId}`,
          produtoDTO,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Produto cadastrado:", resposta.data);
        const produtoId = resposta.data.id;

        // Redirecione para a página de cadastro de estoque com o ID do produto
        this.$router.push(`/estoque?produtoId=${produtoId}`); // Redireciona para a página desejada
      } catch (erro) {
        console.error("Erro ao cadastrar produto:", erro);

        if (erro.response && erro.response.data) {
          this.erro = erro.response.data.message || "Erro ao cadastrar produto.";
        } else {
          this.erro = "Erro ao conectar com o servidor.";
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.cadastro-produto-container {
  background-color: rgba(255, 255, 255, 0.86);
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

input,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #0d009c;
  border-radius: 8px;
  background-color: #f0f0f0;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #4038a0;
  box-shadow: 0 0 5px rgba(64, 56, 160, 0.5);
}

textarea {
  resize: vertical;
  min-height: 100px;
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

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ffffff;
  display: block;
  margin: 200 auto;
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
</style>
