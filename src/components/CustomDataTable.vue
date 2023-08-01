<script setup>
import { ref } from 'vue';
// emits
defineEmits(['change', 'search', 'create', 'show', 'edit', 'destroy', 'restore', 'deletePermanent', 'deleteSelected', 'restoreSelected', 'changePage', 'upload', 'sort']);
// props
defineProps({
    label: String,
    keyword: String,
    data: Object,
    tableBody: Array,
    rowsPerPage: Array,
    meta: Object,
    loading: Boolean,

    canSelectMultiple: {
        type: Boolean,
        default: false
    },
    canSearch: {
        type: Boolean,
        default: true
    },
    canCreate: {
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
    },
    canRestore: {
        type: Boolean,
        default: false
    },
    canRestoreMultiple: {
        type: Boolean,
        default: false
    },
    canUpload: {
        type: Boolean,
        default: false
    },
    canBack: {
        type: Boolean,
        default: false
    }
});

const selectedData = ref(null);
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-3" v-if="canCreate || canUpload || canBack">
                    <template v-slot:start>
                        <div class="my-0">
                            <Button v-if="canBack" :label="$t('button.back')" icon="pi pi-arrow-left" class="p-button-sm p-button-rounded p-button-info mr-2" @click="$emit('back')" />
                            <Button v-if="canUpload" :label="$t('button.upload')" icon="pi pi-upload" class="p-button-sm p-button-rounded p-button-success mr-2" @click="$emit('upload')" />
                            <Button v-if="canCreate" :label="$t('button.new-data')" icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-success mr-2" @click="$emit('create'), (selectedData = false)" />
                            <Button
                                v-if="canSelectMultiple && canDestroy"
                                :label="$t('button.delete-data')"
                                icon="pi pi-trash"
                                class="p-button-sm p-button-rounded p-button-danger mr-2"
                                @click="$emit('deleteSelected', selectedData)"
                                :disabled="!selectedData || !selectedData.length"
                            />
                            <Button
                                v-if="canRestoreMultiple && canRestore"
                                :label="$t('button.restore-data')"
                                icon="pi pi-history"
                                class="p-button-sm p-button-rounded p-button-help mr-2"
                                @click="$emit('restoreSelected', selectedData)"
                                :disabled="!selectedData || !selectedData.length"
                            />
                        </div>
                    </template>
                </Toolbar>
                <DataTable :value="data" :rowHover="true" v-model:selection="selectedData" :loading="loading" @sort="$emit('sort', $event)" dataKey="id" responsiveLayout="scroll" removableSort>
                    <template #empty>
                        <div class="flex flex-column md:flex-row md:justify-content-center md:align-items-center mb-3">
                            <h5 class="m-0 text-red-600">Data Not Found</h5>
                        </div>
                    </template>
                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-3">
                        <h5 class="m-0 capitalize">{{ label }}</h5>

                        <span class="block mt-2 md:mt-0 p-input-icon-left" v-if="canSearch">
                            <i class="pi pi-search" />
                            <InputText @input="$emit('search', $event.target.value), (selectedData = false)" :value="keyword" :placeholder="$t('header.search')" />
                        </span>
                    </div>
                    <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="canSelectMultiple"></Column>
                    <Column v-for="body in tableBody" :key="body.id" class="text-center" :sortable="body.sort || false" :field="body.value">
                        <template #header>
                            <div class="flex-1 text-center capitalize">{{ body.label }}</div>
                        </template>
                        <template #body="slotProps">
                            <!-- boolean chip -->
                            <template v-if="body.type === 'image'">
                                <img :alt="slotProps.data[body.value]" :src="slotProps.data[body.value]" width="32" style="vertical-align: middle" />
                            </template>
                            <!-- boolean chip -->
                            <template v-if="body.type === 'boolean-chip'">
                                <Tag :value="slotProps.data[body.value] ? body.labels[0].label : body.labels[1].label" :severity="slotProps.data[body.value] ? body.labels[0].color : body.labels[1].color"> </Tag>
                            </template>
                            <!-- array chip -->
                            <template v-if="body.type === 'array-chip'">
                                <template v-for="(arrayChip, arrayChipId) in slotProps.data[body.value]" :key="arrayChipId">
                                    <Tag class="mr-2 mb-1" :severity="body.color" :value="arrayChip.name"></Tag>
                                </template>
                            </template>
                            <!-- object -->
                            <template v-if="body.type === 'object'">
                                {{ slotProps.data[body.value] ? slotProps.data[body.value][body.object] : '-' }}
                            </template>
                            <!-- text -->
                            <template v-if="body.type === 'text'">
                                {{ slotProps.data[body.value] ? slotProps.data[body.value] : '-' }}
                            </template>
                            <template v-if="body.type === 'currency'">
                                {{ slotProps.data[body.value] ? formatCurrency(slotProps.data[body.value]) : '-' }}
                            </template>
                            <!-- content -->
                        </template>
                    </Column>
                    <Column class="text-center">
                        <template #header>
                            <div class="flex-1 text-center">{{ $t('table.action') }}</div>
                        </template>
                        <template #body="slotProps">
                            <Button
                                v-if="slotProps.data.trashed && canRestore"
                                class="p-button-sm p-button-rounded p-button-outlined mx-1 p-button-help"
                                icon="pi pi-history"
                                v-tooltip.top="$t('button.restore-data')"
                                @click="$emit('restore', slotProps.data), (selectedData = false)"
                            />
                            <Button
                                v-if="slotProps.data.trashed && canDestroy"
                                class="p-button-sm p-button-rounded p-button-outlined mx-1 p-button-danger"
                                icon="pi pi-trash"
                                v-tooltip.top="$t('button.restore-data')"
                                @click="$emit('deletePermanent', slotProps.data), (selectedData = false)"
                            />
                            <Button
                                v-if="canShow && !slotProps.data.trashed"
                                class="p-button-sm p-button-rounded mx-1 p-button-info"
                                icon="pi pi-search"
                                v-tooltip.top="$t('button.show-data')"
                                @click="$emit('show', slotProps.data), (selectedData = false)"
                            />
                            <Button
                                v-if="canEdit && !slotProps.data.trashed && !slotProps.data.is_expired"
                                class="p-button-sm p-button-rounded mx-1 p-button-warning"
                                icon="pi pi-pencil"
                                v-tooltip.top="$t('button.edit-data')"
                                @click="$emit('edit', slotProps.data), (selectedData = false)"
                            />
                            <Button
                                v-if="canDestroy && !slotProps.data.trashed"
                                class="p-button-sm p-button-rounded mx-1 p-button-danger"
                                icon="pi pi-trash"
                                v-tooltip.top="$t('button.delete-data')"
                                @click="$emit('destroy', slotProps.data), (selectedData = false)"
                            >
                            </Button>
                        </template>
                    </Column>
                </DataTable>

                <Paginator
                    v-if="meta?.total > 1"
                    :template="{
                        '640px': 'PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown',
                        '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
                        '1300px': 'FirstPageLink PrevPageLink CurrentPageReport PageLink NextPageLink LastPageLink RowsPerPageDropdown',
                        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
                    }"
                    :first="meta.to - 1"
                    :rows="parseInt(meta.per_page)"
                    :totalRecords="meta.total"
                    :rowsPerPageOptions="rowsPerPage"
                    @page="$emit('changePage', $event), (selectedData = false)"
                />
            </div>
        </div>
    </div>
</template>
