<script setup>
const props = defineProps({
    label: {
        default: null,
        type: String
    },
    show: {
        default: false,
        type: Boolean
    },
    loading: Boolean
});
defineEmits(['submit', 'close']);
</script>

<template>
    <Dialog
        :visible="props.show"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p class="text-center">
            {{ $t('dialog.restore-text') }}
        </p>
        <h4 class="text-center">
            {{ label }}
        </h4>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="$emit('close', $event)"
            />
            <Button
                :label="$t('button.yes-restore')"
                icon="pi pi-check"
                class="p-button-warning"
                @click="$emit('submit', $event)"
                :loading="loading"
            />
        </template>
    </Dialog>
</template>
