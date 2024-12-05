<template>
  <div>
    <div class="navbar">
      <div class="header-inner-content">
        <div class="logo-container">
          <img src="@/layouts/logo.png" alt="Logo" class="logo-image" />
          <h1 class="logo">AGRO <span>Mapping</span></h1>
        </div>
        <form @submit.prevent="buscarProduto" class="buscar-box">
          <div class="lupa-buscar">
            <i class="bi bi-search"></i>
          </div>
          <div class="input-buscar">
            <input type="text" v-model="query" placeholder="Faça uma busca" />
          </div>
          <div class="btn-fechar" @click="limparBusca">
            <i class="bi bi-x-circle"></i>
          </div>
        </form>
        <nav>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/feiras">Feiras</router-link></li>
            <li><router-link to="/carrinho">Carrinho</router-link></li>
          </ul>
        </nav>
        <div class="nav-icons-container">
          <div class="image-container">
            <img src="@/layouts/kindpng_746008.png" class="clickable-image" @click="goToProfile" />
            <span class="hover-text">Sair</span>
          </div>
        </div>
      </div>
    </div>

    <main>
      <div id="search-results" class="search-results">
        <div v-if="loading">Buscando, por favor, aguarde...</div>
        <div v-else-if="erro">{{ erro }}</div>
        <div v-else-if="resultados.length === 0">
          <p>Nenhum resultado encontrado.</p>
        </div>
        <div v-else class="products-grid">
          <div class="product-item" v-for="produto in resultados" :key="produto.id">
            <h3>{{ produto.nome }}</h3>
            <p>{{ produto.descricao }}</p>
            <p>Preço: {{ produto.preco | currency }}</p>
            <p>Quantidade: {{ produto.estoque.quantidadeDisponivel | currency }}</p>
            <button @click="abrirModal(produto)">Colocar no Carrinho</button>
          </div>
        </div>
      </div>
    </main>

   
    <div v-if="modalAberto" class="modal">
      <div class="modal-content">
        <h3>Adicionar ao Carrinho</h3>
        <p>Produto: {{ produtoSelecionado.nome }}</p>
        <label for="quantidade">Quantidade:</label>
        <input type="number" v-model="quantidade" min="1" placeholder="Digite a quantidade" />
        <div class="modal-actions">
          <button @click="adicionarAoCarrinho">Adicionar</button>
          <button @click="fecharModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      query: "",
      resultados: [],
      loading: false,
      erro: "",
      modalAberto: false,
      produtoSelecionado: null,
      quantidade: 1,
    };
  },
  methods: {
    async buscarProduto() {
      if (!this.query.trim()) {
        this.listarProdutos();
        return;
      }

      this.erro = "";
      this.loading = true;
      const token = localStorage.getItem("token"); 

      try {
        const { data } = await axios.get(
          `http://localhost:8090/produto/buscarProdutoPorNome/nome/${encodeURIComponent(this.query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        this.resultados = data;
      } catch (erro) {
        this.erro = "Erro ao buscar produtos. Tente novamente mais tarde.";
        console.error("Erro ao buscar produto:", erro);
      } finally {
        this.loading = false;
      }
    },
    async listarProdutos() {
      this.loading = true;
      this.erro = "";

      const token = localStorage.getItem("token");
      if (!token) {
        this.erro = "Token não encontrado. Faça login novamente.";
        console.error("Token ausente.");
        this.loading = false;
        return;
      }
      console.log("Token presente.");

      try {
        const { data } = await axios.get(
          "http://localhost:8090/produto/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Token autorizado.");
        this.resultados = data;
      } catch (erro) {
        this.erro = "Erro ao carregar os produtos. Tente novamente mais tarde.";
        console.error("Erro ao listar produtos:", erro);
      } finally {
        this.loading = false;
      }
    },
    limparBusca() {
      this.query = "";
      this.listarProdutos(); 
    },
    goToProfile() {
      this.$router.push("/meuPerfil");
    },
    abrirModal(produto) {
      this.produtoSelecionado = produto;
      this.quantidade = 1;
      this.modalAberto = true;
    },
    fecharModal() {
      this.modalAberto = false;
      this.produtoSelecionado = null;
      this.quantidade = 1;
    },
    adicionarAoCarrinho() {
      if (this.quantidade <= 0) {
        alert("Quantidade inválida!");
        return;
      }

      const token = localStorage.getItem("token");
      const idUsuario = localStorage.getItem("usuarioId");
      console.log(idUsuario);
      if (!token) {
        alert("Você não está autenticado!");
        return;
      }
      const itemPedido = {
        idProduto: this.produtoSelecionado.id,
        quantidade: this.quantidade,
        idUsuario: idUsuario,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .post("http://localhost:8090/itemPedido", itemPedido, config)
        .then(() => {
          alert("Produto adicionado ao carrinho com sucesso!");
        })
        .catch((erro) => {
          console.error("Erro ao adicionar ao carrinho:", erro.response?.data || erro.message);
          if (erro.response?.status === 403) {
            alert("Acesso negado! Verifique sua autenticação.");
          } else {
            alert("Erro ao adicionar ao carrinho. Tente novamente.");
          }
        })
        .finally(() => {
          this.fecharModal();
        });
    },
  },
  filters: {
    currency(value) {
      return `R$ ${parseFloat(value).toFixed(2)}`;
    },
  },
  mounted() {
    this.listarProdutos(); 
  },
};
</script>

  
  <style scoped>
 * {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

.navbar {
  margin-top: 20px;
  width: 90%;
  height: 90px;
  margin-left: 85px;
  margin-right: 10px;
  background-color: #2c2c2c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  border-radius: 9999px;
}

.navbar .header-inner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.logo {
  color: green;
  font-size: 1.8rem;
  font-weight: 100;
}


.logo span {
  color: white;
}

.navbar .buscar-box {
  width: 400px;
  height: 40px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;
  border-radius: 5px;
  margin: 10px 0;
}

.navbar .buscar-box .lupa-buscar,
.navbar .buscar-box .btn-fechar {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.navbar .buscar-box .lupa-buscar i,
.navbar .buscar-box .btn-fechar i {
  font-size: 25px;
  color: green;
}

.navbar .buscar-box .input-buscar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 80px);
  height: 100%;
}

.navbar .buscar-box .input-buscar input {
  width: 100%;
  border: 0;
  border-radius: 5px;
  outline: 0;
  font-size: 16px;
  padding: 0 10px;
  box-sizing: border-box;
}

nav ul {
  display: flex;
  align-items: center;
  gap: 50px;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav ul li {
  cursor: pointer;
}

nav ul li a {
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #00b33c;
}

.nav-icons-container {
  display: flex;
  align-items: center;
}

.nav-icons-container img {
  width: 30px;
  cursor: pointer;
}

.nav-icons-container img:first-child {
  margin-right: 1rem;
}

.image-container {
  position: relative;
  display: inline-block;
}

.clickable-image {
  display: block;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.hover-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.image-container:hover .hover-text {
  opacity: 1;
}

.search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  justify-items: center;
}

.product-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 240px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.product-item h3 {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.product-item p {
  font-size: 1rem;
  margin: 5px 0;
}

.product-item button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-item button:hover {
  background-color: #218838;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-top: 10px;
}

.modal button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal button:hover {
  background-color: #218838;
}

.advertise-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #FFD700;
  color: black;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.advertise-button:hover {
  background-color: #FFC107;
}

@media (max-width: 1024px) {
  .advertise-button {
    font-size: 14px;
    padding: 12px 24px;
  }
}

@media (max-width: 768px) {
  .advertise-button {
    font-size: 12px;
    padding: 10px 20px;
  }
}
@media (max-width: 480px) {
      .navbar {
          padding: 0.5rem;
      }

      .logo {
          font-size: 1.5rem;
      }

      .header-bottom-side-left h2 {
          font-size: 1.5rem;
      }

      .header-bottom-side-left p {
          font-size: 1rem;
      }
  }

  .logo-container {
      display: flex;
      align-items: center;
  }

  .logo-image {
      width: 70px; 
      height: auto;
      margin-right: 1px; 
  }


  </style>
  