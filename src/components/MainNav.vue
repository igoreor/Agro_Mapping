<template>
  <div class="navbar">
    <div class="header-inner-content">
      <div class="logo-container">
        <img src="@/layouts/logo.png" alt="Logo" class="logo-image" />
        <h1 class="logo">AGRO <span>Mapping</span></h1>
      </div>
      <form @submit.prevent="performSearch" class="buscar-box">
        <div class="lupa-buscar" @click="performSearch">
          <i class="bi bi-search"></i>
        </div>
        <div class="input-buscar">
          <input type="text" v-model="searchQuery" placeholder="Faça uma busca" />
        </div>
        <div class="btn-fechar" @click="clearSearch">
          <i class="bi bi-x-circle"></i>
        </div>
      </form>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/produtos">Produtos</router-link></li>
          <li @click="scrollToSobre">Sobre</li>
          <li>Contato</li>
        </ul>
      </nav>
      <div class="nav-icons-container">
        <img src="@/layouts/kindpng_746008.png" class="clickable-image" @click="logout" />
        <span class="hover-text">Sair</span>
        <img src="@/layouts/menu.png" class="menu-button" @click="toggleMenu" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    clearSearch() {
      this.searchQuery = '';
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/pesquisa', query: { q: this.searchQuery } });
      }
    },
    logout() {
      document.cookie = 'token=; Max-Age=-99999999;';
      document.cookie = 'userLogado=; Max-Age=-99999999;';
      this.$router.push('/login');
    },
    scrollToSobre() {
      document.getElementById('sobre').scrollIntoView({ behavior: 'smooth' });
    },
  },
};
</script>

<style scoped>
/* Navbar Principal */
.navbar {
  background-color: #2c2c2c;
  padding: 0.5rem 1 rem;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

/* Conteúdo da Navbar */
.header-inner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: auto;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
  gap: 2px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.logo span {
  color: #00b33c; /* Cor de destaque */
}

/* Barra de Busca */
.buscar-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 3px 100px;
  margin-left: 10px;
}

.input-buscar input {
  border: none;
  outline: none;
  background: transparent;
  padding: 5px;
  font-size: 14px;
}

.lupa-buscar,
.btn-fechar {
  cursor: pointer;
  color: #555;
  font-size: 18px;
  transition: color 0.3s;
}

.lupa-buscar:hover,
.btn-fechar:hover {
  color: #00b33c;
}

/* Navegação */
nav ul {
  display: flex;
  align-items: center;
  gap: 15px;
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
  font-size: 14px;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #00b33c;
}

/* Ícones à Direita */
.nav-icons-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.clickable-image {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.menu-button {
  width: 20px;
  cursor: pointer;
}

.hover-text {
  display: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .header-inner-content {
    flex-direction: column;
    align-items: center;
  }
  nav ul {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  .buscar-box {
    width: 100%;
    margin-top: 10px;
  }
}
</style>