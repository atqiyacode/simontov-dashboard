<script setup>
const props = defineProps({
    show: {
        default: false,
        type: Boolean
    }
});
defineEmits(['close']);
</script>

<template>
    <Dialog
        :visible="props.show"
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        header="Detail"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
        class="p-fluid"
    >
        <slot name="content" />
        <template #footer>
            <Button
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-text"
                @click="$emit('close', $event)"
            />
        </template>
    </Dialog>
</template>
