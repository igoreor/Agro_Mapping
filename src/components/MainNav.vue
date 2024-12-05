<template>
  <div class="navbar">
    <div class="header-inner-content">
      <div class="logo-container">
        <img src="@/layouts/logo.png" alt="Logo" class="logo-image" />
        <h1 class="logo">AGRO <span>Mapping</span></h1>
      </div>
      <form @submit.prevent="performSearch" class="buscar-box">
        <button class="buscar-button" @click="performSearch">
          <i class="bi bi-search"></i> Buscar
        </button>
      </form>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/feiras">Feiras</router-link></li>
          <li><router-link to="/meusAnuncios">Meus Anúncios</router-link></li>
          <li><router-link to="/meusPedidos">Meus Pedidos</router-link></li> <!-- Novo item de navegação -->
          <li @click="scrollToSobre"><router-link>Sobre</router-link></li>
          <li><router-link to="/carrinho">Carrinho</router-link></li>
        </ul>
      </nav>
      <div class="nav-icons-container">
        <img src="@/layouts/kindpng_746008.png" class="clickable-image" @click="goToProfile" />
        <span class="hover-text">Sair</span>
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
    performSearch() {
      const defaultQuery = 'produtos'; 
      this.$router.push('/search');
      console.log('Pesquisa iniciada com termo padrão:', defaultQuery);
    },
    scrollToSobre() {
      document.getElementById('sobre').scrollIntoView({ behavior: 'smooth' });
    },
    goToProfile() {
      this.$router.push('/meuPerfil');
    }
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 90px;
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

.header-inner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.logo-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.logo span {
  color: #00b33c;
}

.logo-image {
  height: 100px;
  width: auto;
}

.buscar-box {
  display: flex;
  align-items: center;
}

.buscar-button {
  background-color: #00b33c;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s;
}

.buscar-button:hover {
  background-color: #007e2b;
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
  gap: 20px;
}

.clickable-image {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.menu-button {
  width: 24px;
  cursor: pointer;
}

.hover-text {
  display: none;
}

@media (max-width: 768px) {
  .header-inner-content {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
  nav ul {
    flex-direction: column;
    gap: 15px;
    margin-top: 10px;
  }
  .buscar-box {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
