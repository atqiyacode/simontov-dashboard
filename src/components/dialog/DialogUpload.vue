<script setup>
const props = defineProps({
    label: {
        default: ' - ',
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
        header="Upload File Import"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <h3>UPload File</h3>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-warning"
                @click="$emit('close', $event)"
            />
        </template>
    </Dialog>
</template>
