<template>
    <div>

        <SearchResults/>
        <LogoutButton/>
        
    </div>
</template>
<script>
import SearchResults from '@/components/SearchResults.vue';
import LogoutButton from '@/components/LogoutButton.vue';

export default{
    components:{
        SearchResults,
        LogoutButton
    }
}
</script>
