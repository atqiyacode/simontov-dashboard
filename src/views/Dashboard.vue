<script setup>
import { onMounted } from 'vue';
import { useOptionStore } from '@/services/option.store';
import RealtimeChartPage from './chart/RealtimeChartPage.vue';

const optionStore = useOptionStore();

onMounted(() => {
    optionStore.loadSites();
});
</script>

<template>
    <div class="grid">
        <RealtimeChartPage />
    </div>
</template>
