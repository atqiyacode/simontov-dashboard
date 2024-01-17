<script setup>
const props = defineProps({
    show: {
        default: false,
        type: Boolean
    },
    header: String,
    submitButton: String,
    loading: Boolean
});
defineEmits(['submit', 'close']);
</script>

<template>
    <Dialog
        :visible="props.show"
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        :header="header"
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
                :disabled="loading"
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-text"
                @click="$emit('close', $event)"
            />
            <Button
                :loading="loading"
                :label="submitButton"
                icon="pi pi-check"
                class="p-button-success"
                @click="$emit('submit', $event)"
            />
        </template>
    </Dialog>
</template>
