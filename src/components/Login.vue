<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="fazerLogin">
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" v-model="email" id="email" required />
            </div>
            <div class="input-group">
                <label for="senha">Senha:</label>
                <input type="password" v-model="senha" id="senha" required />
            </div>
            <button type="submit">Entrar</button>
            <p v-if="erro" class="erro">{{ erro }}</p>
        </form>
        <p>Não tem uma conta? <router-link to="/registro">Registre-se</router-link></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            senha: '',
            erro: null,
        };
    },
    methods: {
        async fazerLogin() {
            try {
                const resposta = await axios.post('http://localhost:8080/api/login', {
                    email: this.email,
                    senha: this.senha,
                });

                const token = resposta.data.token;
                localStorage.setItem('token', token); // Armazena o token no localStorage
                this.$router.push('/'); // Redireciona para a página Home
            } catch (erro) {
                this.erro = 'Email ou senha incorretos.'; // Exibe uma mensagem de erro
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.input-group {
    margin-bottom: 15px;
}
label {
    display: block;
    margin-bottom: 5px;
}
input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
button:hover {
    background-color: #369b75;
}
.erro {
    color: red;
    margin-top: 10px;
}
</style>
