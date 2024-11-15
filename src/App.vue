<!-- src/App.vue -->
<template>
    <div id="app">
        
        <main>
            <router-view />
        </main>
    </div>
</template>

<script>



export default {
    name: 'App',
    components: {
        
       
    },
};
</script>

<style lang="css">
@import './assets/main.css';

#app {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
main {
    flex: 1;
}
</style>
