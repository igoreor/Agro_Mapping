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
              <li><router-link to="/meusAnuncios">Meus Anúncios</router-link></li> <!-- Novo item de navegação -->
            </ul>
          </nav>
          <div class="nav-icons-container">
            <img src="@/layouts/kindpng_746008.png" class="clickable-image" @click="goToProfile" />
            <span class="hover-text">Sair</span>

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
        <div v-else>
          <div
            class="product-item"
            v-for="produto in resultados"
            :key="produto.id"
          >
            <h3>{{ produto.nome }}</h3>
            <p>{{ produto.descricao }}</p>
            <p>Preço: {{ produto.preco | currency }}</p>
            <p>Quantidade: {{ produto.estoque.quantidadeDisponivel | currency }}</p>
            <button @click="abrirModal(produto)">Colocar no Carrinho</button>
          </div>
        </div>
      </div>

      <!-- Modal para inserir a quantidade -->
      <div v-if="modalAberto" class="modal">
        <div class="modal-content">
          <h3>Adicionar ao Carrinho</h3>
          <p>Produto: {{ produtoSelecionado.nome }}</p>
          <label for="quantidade">Quantidade:</label>
          <input
            type="number"
            v-model="quantidade"
            min="1"
            placeholder="Digite a quantidade"
          />
          <div class="modal-actions">
            <button @click="adicionarAoCarrinho">Adicionar</button>
            <button @click="fecharModal">Cancelar</button>
          </div>
        </div>
      </div>
    </main>
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
          this.erro = "Por favor, insira um termo de busca.";
          return;
        }
  
        this.erro = "";
        this.loading = true;
  
        try {
          const { data } = await axios.get(
            `https://agro-mapping.onrender.com/produto/buscarProdutoPorNome/nome/${encodeURIComponent(
              this.query
            )}`
          );
          this.resultados = data;
        } catch (erro) {
          this.erro = "Erro ao buscar produtos. Tente novamente mais tarde.";
        } finally {
          this.loading = false;
        }
      },
      limparBusca() {
        this.query = "";
        this.resultados = [];
        this.erro = "";
      },
      goToProfile() {
        this.$router.push('/meuPerfil');
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
        console.log(idUsuario)
        if (!token) {
          alert("Você não está autenticado!");
          return;
        }
        const itemPedido = {
          idProduto: this.produtoSelecionado.id,
          quantidade: this.quantidade,
          idUsuario: idUsuario,
        };

        // Configuração do cabeçalho com token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .post("https://agro-mapping.onrender.com/itemPedido", itemPedido, config)
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
      }
    },
    filters: {
      currency(value) {
        return `R$ ${parseFloat(value).toFixed(2)}`;
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  /* Estilo para o modal */
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

  body {
      font-family: 'arial';
  }

  .header-inner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  

  .navbar {
    margin-top: 20px;
    width: 90%;
    height: 90px;
    margin-left: 85px;
    margin-right: 10px; 
    background-color: #2c2c2c;
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    border-radius: 9999px;

  }

  .navbar > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 20px;
  }

  .logo {
      color: green;
  }

  .logo span {
      color: white;
  }

  .buscar-box {
      width: 400px;
      height: 40px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      position: relative;
      border-radius: 5px;
      margin: 10px 0;
  }

  .buscar-box .lupa-buscar, .buscar-box .btn-fechar {
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
  }

  .buscar-box .btn-fechar i {
      font-size: 20px;
      margin-left: 5px;
      color: green;
  }

  .buscar-box .lupa-buscar i {
      font-size: 25px;
      color: green;
  }

  .buscar-box .input-buscar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(100% - 80px);
      height: 100%;
  }

  .buscar-box .input-buscar input {
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

  .menu-button {
      display: none;
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

  header {
      background-image: radial-gradient(white, gray);
      padding: 2rem 1rem;
  }

  .header-bottom-side {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
  }

  .header-bottom-side-left {
      height: 100%;
      flex-basis: 50%;
  }

  .header-bottom-side-left h2 {
      font-size: 3.2rem;
      margin-bottom: 1.5rem;
  }

  .header-bottom-side-left p {
      line-height: 1.5rem;
      margin-bottom: 1.5rem;
  }

  .header-bottom-side-left button {
      background-color: rgb(0, 209, 0);
      border: none;
      cursor: pointer;
      padding: 0.8rem 3.8rem;
      border-radius: 9999px;
      color: white;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.2s;
  }

  .header-bottom-side-left button:hover {
      background-color: rgb(0, 104, 0);
  }

  .header-bottom-side-right {
      flex-basis: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .header-bottom-side-right img {
      width: 115%;
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
  }

  .advertise-button:hover {
      background-color: #FFC107;
  }

.search-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    width: 100%; /* Permitir que a caixa ocupe toda a largura disponível */
}

.product-item {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    margin: 10px 0;
    width: auto; /* Ajuste automático ao conteúdo */
    max-width: 100%; /* Limite opcional para a largura máxima */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-item h3 {
    margin-bottom: 10px;
    font-size: 1.2rem; /* Ajuste conforme necessário */
}

.product-item p {
    margin: 5px 0;
    font-size: 1rem; /* Ajuste conforme necessário */
}


  @media (max-width: 768px) {
      .navbar > div {
          flex-direction: column;
          align-items: flex-start;
      }

      .buscar-box {
          width: 100%;
      }

      .nav-icons-container {
          width: 100%;
          justify-content: space-between;
      }

      nav ul {
          flex-direction: column;
          width: 100%;
          padding: 1rem 0;
          display: none;
      }

      nav ul.open {
          display: flex;
      }

      nav ul li {
          margin: 0.5rem 0;
      }

      .menu-button {
          display: block;
      }

      .header-bottom-side {
          flex-direction: column;
      }

      .header-bottom-side-left, .header-bottom-side-right {
          flex-basis: 100%;
      }

      .header-bottom-side-left button {
          width: 100%;
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
      width: 70px; /* Ajuste o tamanho da logo conforme necessário */
      height: auto;
      margin-right: 1px; /* Espaçamento entre a logo e o texto */
  }

  li a {
      text-decoration: none;
      color: inherit;
      display: block;
      width: 100%;
      height: 100%;
  }

  </style>
  