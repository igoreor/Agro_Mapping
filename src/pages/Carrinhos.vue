<template>
    <div>

        <MainNav/>
        <Carrinhos/>
        
    </div>
</template>
<script>
import Carrinhos from '@/components/Carrinhos.vue';
import MainNav from '@/components/MainNav.vue';

export default{
    components:{
        Carrinhos,
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