<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig, contextPath } = useLayout();

const logoUrl = computed(() => {
    return `${contextPath}logo/${layoutConfig.darkTheme.value === 'true' ? 'vepro' : 'vepro'}.png`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="30" />
    </div>
</template>
<style lang="scss" scoped></style>
