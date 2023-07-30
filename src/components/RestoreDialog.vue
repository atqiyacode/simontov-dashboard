<script setup>
// props
defineProps({
    data: Object
});
</script>
<template>
    <div class="text-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <p class="font-bold">{{ $t('confirmation.restore') }}</p>
        <h6 class="font-bold text-yellow-500">{{ data }}</h6>
    </div>
</template>
