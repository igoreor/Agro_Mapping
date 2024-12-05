<template>
    <div>

    <MainNav/>

    <MappingFeiras/>

    <LogoutButton />
        
    </div>
</template>
<script>
import MainNav from '@/components/MainNav.vue';
import MappingFeiras from '@/components/MappingFeiras.vue';
import LogoutButton from '@/components/LogoutButton.vue';

export default{
    components:{
        MainNav,
        MappingFeiras,
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
