<template>
    <div>

        <MainNav/>
        <MeusAnuncios/>
        
    </div>
</template>
<script>
import MeusAnuncios from '@/components/MeusAnuncios.vue';
import MainNav from '@/components/MainNav.vue';

export default{
    components:{
        MeusAnuncios,
        MainNav
    }
}
</script>
<style scoped>
/* Estilização local do componente */
div {
  padding: 20px;
}
</style>