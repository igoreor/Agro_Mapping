<template>
    <div>

        <MainNav/>
        <MeuPerfil/>
        <LogoutButton/>
        
    </div>
</template>
<script>
import MeuPerfil from '@/components/MeuPerfil.vue';
import MainNav from '@/components/MainNav.vue';
import LogoutButton from '@/components/LogoutButton.vue';

export default{
    components:{
        MeuPerfil,
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