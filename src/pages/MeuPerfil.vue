<template>
    <div>

        <MainNav/>
        <MeuPerfil/>
        
    </div>
</template>
<script>
import MeuPerfil from '@/components/MeuPerfil.vue';
import MainNav from '@/components/MainNav.vue';

export default{
    components:{
        MeuPerfil,
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