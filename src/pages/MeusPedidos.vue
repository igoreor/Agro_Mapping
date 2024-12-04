<template>
    <div>

        <MainNav/>
        <Meuspedidos/>
        
    </div>
</template>
<script>
import Meuspedidos from '@/components/Meuspedidos.vue';
import MainNav from '@/components/MainNav.vue';

export default{
    components:{
        Meuspedidos,
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