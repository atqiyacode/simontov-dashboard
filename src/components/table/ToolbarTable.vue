<script setup>
defineProps({
    selectedData: {
        type: Array,
        default: null
    },

    actionColumn: {
        type: Boolean,
        default: true
    },
    canCreate: {
        type: Boolean,
        default: true
    },
    canUpload: {
        type: Boolean,
        default: false
    },
    canMultiSelectData: {
        type: Boolean,
        default: true
    },
    canDestroyMultiple: {
        type: Boolean,
        default: true
    },
    canRestoreMultiple: {
        type: Boolean,
        default: true
    },
    canExport: {
        type: Boolean,
        default: true
    },
    canDeleteMultiple: {
        type: Boolean,
        default: true
    },
    canSelectField: {
        type: Boolean,
        default: true
    },
    isDownloading: {
        type: Boolean,
        default: false
    }
});
defineEmits([
    'newData',
    'newUpload',
    'confirmDeleteSelected',
    'confirmRestoreSelected',
    'download',
    'confirmDeletePermanentSelectedDialog',
    'confirmSelectField'
]);
</script>
<template>
    <Toolbar
        class="mb-4"
        v-if="
            canCreate ||
            canMultiSelectData ||
            canUpload ||
            canDestroyMultiple ||
            canSelectField ||
            canExport
        "
    >
        <template v-slot:start>
            <div class="my-2">
                <Button
                    v-tooltip.top="$t('button.new-data')"
                    icon="pi pi-plus"
                    class="p-button-sm mr-1"
                    severity="primary"
                    rounded
                    @click="$emit('newData', $event)"
                    v-if="canCreate"
                />
                <Button
                    v-tooltip.top="$t('button.import-data')"
                    icon="pi pi-upload"
                    class="p-button-sm mr-1"
                    severity="success"
                    rounded
                    @click="$emit('newUpload', $event)"
                    v-if="canUpload"
                />
                <Button
                    v-tooltip.top="$t('button.delete-all')"
                    icon="pi pi-trash"
                    class="p-button-sm mr-1"
                    severity="warning"
                    rounded
                    @click="$emit('confirmDeleteSelected', $event)"
                    :disabled="!selectedData || !selectedData.length"
                    v-if="canDestroyMultiple && canMultiSelectData"
                />
                <Button
                    v-tooltip.top="$t('button.restore-all')"
                    icon="pi pi-refresh"
                    class="p-button-sm mr-1"
                    severity="info"
                    rounded
                    @click="$emit('confirmRestoreSelected', $event)"
                    :disabled="!selectedData || !selectedData.length"
                    v-if="canRestoreMultiple && canMultiSelectData"
                />
            </div>
        </template>

        <template v-slot:end>
            <!-- <Button
                v-tooltip.top="$t('button.setting')"
                icon="pi pi-table"
                class="p-button-sm mr-1"
                severity="info"
                rounded
                @click="$emit('confirmSelectField', $event)"
                v-if="canSelectField"
            /> -->

            <Button
                :loading="isDownloading"
                v-tooltip.top="$t('button.download')"
                icon="pi pi-download"
                class="p-button-sm mr-1"
                severity="success"
                rounded
                @click="$emit('download', $event)"
                v-if="canExport"
            />

            <Button
                v-tooltip.top="$t('button.delete-permanent')"
                icon="pi pi-trash"
                class="p-button-sm mr-1"
                severity="danger"
                rounded
                @click="$emit('confirmDeletePermanentSelectedDialog', $event)"
                :disabled="!selectedData || !selectedData.length"
                v-if="canDeleteMultiple && canMultiSelectData"
            />
        </template>
    </Toolbar>
</template>
