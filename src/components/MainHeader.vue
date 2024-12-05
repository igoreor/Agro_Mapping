<template>
  <header>
    <div class="header-inner-content">
      <div class="header-bottom-side">
        <div class="header-bottom-side-left">
          <h2>Faça Suas Compras Aqui!</h2>
          <p>Cuide da sua saúde comprando frutas e verduras frescas</p>
          <button @click="goToSearch">
            Ver agora &#8594;
          </button>
        </div>
        <div class="header-bottom-side-right">
          <img src="@/layouts/file.png" alt="Header Image" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'MainHeader',
  methods: {
    goToSearch() {
      this.$router.push('/search');
    },
  },
};
</script>

<style scoped>
.header-inner-content {
  max-width: 2200px;
  margin: auto;
}

.header-bottom-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.header-bottom-side-left {
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
  width: 100%;
}
</style>