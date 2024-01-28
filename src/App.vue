<script setup>
import { getCurrentInstance, onMounted } from 'vue';
import { useMainStore } from '@/services/main.store';
const { proxy } = getCurrentInstance();
const mainStore = useMainStore();

onMounted(() => {
    mainStore.sanctumCsrf();
    mainStore.$patch({
        socketId: proxy.$pusher.connection.socket_id
    });
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
