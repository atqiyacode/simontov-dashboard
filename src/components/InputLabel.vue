<script setup>
defineProps(['value']);
</script>

<template>
    <label class="block font-medium text-sm ">
        <span v-if="value" class="capitalize">{{ value }}</span>
        <span v-else><slot /></span>
    </label>
</template>
