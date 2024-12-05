<template>
    <div>

        <MainNav/>
        <Carrinhos/>
        <LogoutButton/>
        
    </div>
</template>
<script>
import Carrinhos from '@/components/Carrinhos.vue';
import MainNav from '@/components/MainNav.vue';
import LogoutButton from '@/components/LogoutButton.vue';

export default{
    components:{
        Carrinhos,
        MainNav,
        LogoutButton
    }
}
</script>
<style scoped>
/* Estilização local do componente */
div {
  padding: 20px;
}
</style>