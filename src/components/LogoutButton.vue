<template>
    <button class="logout-button" @click="logout">Logout</button>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.removeItem('token');
            console.log('Token removido. Redirecionando para login...');
            this.$router.push('/login');
        },
    },
};
</script>

<style>
.logout-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    position: fixed;
    top: 93%; 
    right: 94%; 
    z-index: 1000; 
}

.logout-button:hover {
    background-color: #d32f2f;
}
</style>
