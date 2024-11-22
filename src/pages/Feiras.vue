<template>
    <div>

    <MainNav/>

    <MappingFeiras/>
        
    </div>
</template>
<script>
import MainNav from '@/components/MainNav.vue';
import MappingFeiras from '@/components/MappingFeiras.vue';

export default{
    components:{
        MainNav,
        MappingFeiras
    }
}

</script>

<style scoped>
/* Estilização local do componente */
div {
  padding: 20px;
}
</style>
