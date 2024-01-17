<script setup>
defineProps({
    data: {
        type: Object,
        default: null
    },

    actionColumn: {
        type: Boolean,
        default: true
    },
    canRestore: {
        type: Boolean,
        default: true
    },
    canDelete: {
        type: Boolean,
        default: true
    },
    canShow: {
        type: Boolean,
        default: true
    },
    canEdit: {
        type: Boolean,
        default: true
    },
    canDestroy: {
        type: Boolean,
        default: true
    }
});
defineEmits([
    'confirmRestoreData',
    'confirmDeletePermanentData',
    'showData',
    'editData',
    'confirmDestroyData'
]);
</script>
<template>
    <Button
        v-if="data.trashed && canRestore"
        v-tooltip.top="$t('button.restore-data')"
        icon="pi pi-refresh"
        class="p-button-rounded p-button-secondary mr-2"
        outlined
        @click="$emit('confirmRestoreData', $event)"
    />
    <Button
        v-if="data.trashed && canDelete"
        v-tooltip.top="$t('button.delete-permanent')"
        icon="pi pi-trash"
        class="p-button-rounded p-button-danger mr-2"
        @click="$emit('confirmDeletePermanentData', $event)"
    />
    <Button
        v-if="!data.trashed && canShow"
        v-tooltip.top="$t('button.show-data')"
        icon="pi pi-search"
        class="p-button-rounded p-button-info mr-2"
        @click="$emit('showData', $event)"
    />
    <Button
        v-if="!data.trashed && canEdit"
        v-tooltip.top="$t('button.edit-data')"
        icon="pi pi-pencil"
        class="p-button-rounded p-button-success mr-2"
        @click="$emit('editData', $event)"
    />
    <Button
        v-if="!data.trashed && canDestroy"
        v-tooltip.top="$t('button.delete-data')"
        icon="pi pi-trash"
        class="p-button-rounded p-button-warning"
        @click="$emit('confirmDestroyData', $event)"
    />
</template>
