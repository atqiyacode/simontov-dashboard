<script setup>
import { useLayout } from '@/layout/composables/layout';

const { developerTeam } = useLayout();
</script>

<template>
    <div class="layout-footer">
        Created by
        <span class="font-small ml-2">{{ developerTeam }}</span>
    </div>
</template>
<style lang="scss" scoped></style>
