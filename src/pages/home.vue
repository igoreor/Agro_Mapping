<template>
    <div>
        <MainNav />
        <MainHeader />
        <SobreSection />
        <button class="advertise-button" @click="goToVendas">Anuncie seus produtos aqui</button>
    </div>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import MainNav from '@/components/MainNav.vue';
import SobreSection from '@/components/SobreSection.vue';

export default {
    components: {
        MainNav,
        MainHeader,
        SobreSection,
    },
    created() {
        this.verificarToken();
    },
    methods: {
        verificarToken() {
            const token = localStorage.getItem('token');
            if (!token) {
                this.$router.push('/login');
            }
        },
        goToVendas() {
            this.$router.push('/vendas');
        },
    },
};
</script>

<style>
/* Adicione estilos aqui, se necessário */
</style>
