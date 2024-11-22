<template>
    <button class="logout-button" @click="logout">Logout</button>
</template>


<script>
export default {
    methods: {
        logout() {
            // Limpa o token do localStorage
            localStorage.removeItem('token');
            console.log('Token removido. Redirecionando para login...');
            // Redireciona para a página de login
            this.$router.push('/login');
        },
    },
};
</script>


<style>
.logout-button {
    /* Estilo opcional para o botão */
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}


.logout-button:hover {
    background-color: #d32f2f;
}
</style>



