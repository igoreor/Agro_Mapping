<template>
    <div>

        <MainNav/>
        <Meuspedidos/>
        <LogoutButton/>
        
    </div>
</template>
<script>
import Meuspedidos from '@/components/Meuspedidos.vue';
import MainNav from '@/components/MainNav.vue';
import LogoutButton from '@/components/LogoutButton.vue';

export default{
    components:{
        Meuspedidos,
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