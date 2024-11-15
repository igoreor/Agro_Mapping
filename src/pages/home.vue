<template>
    <div>
        <MainNav />
        <MainHeader />
        <SobreSection />
        <button class="advertise-button" @click="goToVendas">Anuncie seus produtos aqui</button>
    </div>
</template>

<script>
import MainNav from '@/components/MainNav.vue';
import MainHeader from '@/components/MainHeader.vue';
import SobreSection from '@/components/SobreSection.vue';


export default {
    components: {
        MainNav,
        MainHeader,
        SobreSection,
    },
    methods: {
        goToVendas() {
            this.$router.push('/vendas');
        },
    },
};
</script>

<style>
/* Estilos específicos para Home se necessário */
</style>