<template>
    <div>

        <MainNav/>
        <MeusAnuncios/>
        <LogoutButton/>
        
    </div>
</template>
<script>
import MeusAnuncios from '@/components/MeusAnuncios.vue';
import MainNav from '@/components/MainNav.vue';
import LogoutButton from '@/components/LogoutButton.vue';

export default{
    components:{
        MeusAnuncios,
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