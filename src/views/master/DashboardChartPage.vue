<script setup>
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue';
import { useMainStore } from '@/services/main.store';
import { useGlobalStore } from '@/services/global.store';
import { storeToRefs } from 'pinia';
import { i18n } from '@/plugins/i18n';

const { proxy } = getCurrentInstance();
const mainStore = useMainStore();
const GlobalStore = useGlobalStore();

const { loading, errors } = storeToRefs(mainStore);

const { dt, apiUrl, title, isDownloading, keyword } = storeToRefs(GlobalStore);

const {
    canShow,
    canCreate,
    canUpload,
    canEdit,
    canRestore,
    canDestroy,
    canDelete,
    canDestroyMultiple,
    canRestoreMultiple,
    canDeleteMultiple,
    canExport,
    canSearch,
    canMultiSelectData,
    canSelectField,
    actionColumn
} = storeToRefs(GlobalStore.permissions);

const { data, meta, rowsPerPage, sortField } = storeToRefs(GlobalStore.tableData);

const { form, item, selectedData, selectedFields } = storeToRefs(GlobalStore.formData);

const {
    formDialog,
    uploadDialog,
    detailDialog,
    destroyDataDialog,
    destroySelectedDialog,
    restoreDataDialog,
    restoreSelectedDialog,
    destroyPermanentDialog,
    destroyPermanentSelectedDialog,
    selectFieldDialog,
    exportDialog
} = storeToRefs(GlobalStore.dialogs);

const {
    onChangePage,
    onSortData,
    reloadData,

    getData,
    restoreData,
    destroyData,
    deleteData,
    destroyMultiple,
    restoreMultiple,
    deleteMultiple,

    resetDialog,

    newData,
    newUpload,
    submitData,
    showData,
    editData,
    confirmDestroyData,
    confirmRestoreData,
    confirmDeletePermanentData,
    confirmDeleteSelected,
    confirmRestoreSelected,
    confirmDeletePermanentSelectedDialog,
    confirmSelectField,
    confirmExportData,
    uploadFile
} = GlobalStore;

onMounted(async () => {
    sortField.value = '-id';
    title.value = i18n.t('page.chart-types');
    apiUrl.value = 'dashboardCharts';
    form.value = {
        id: null,
        name: ''
    };

    await getData({
        per_page: meta?.value.per_page
    });
});

onUnmounted(() => {
    GlobalStore.resetTable();
    GlobalStore.$reset();
});
const channel = ref(0);
proxy.$pusher.channel('permission-channel').listen('.permission-event', () => {
    channel.value += 1;
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ToolbarTable
                    :canCreate="canCreate"
                    :canUpload="canUpload"
                    :canMultiSelectData="canMultiSelectData"
                    :canDestroyMultiple="canDestroyMultiple"
                    :canRestoreMultiple="canRestoreMultiple"
                    :canExport="canExport"
                    :canDeleteMultiple="canDeleteMultiple"
                    :canSelectField="canSelectField && selectedFields.length > 0"
                    :selectedData="selectedData"
                    :isDownloading="isDownloading"
                    @newData="newData"
                    @newUpload="newUpload"
                    @confirmDeleteSelected="confirmDeleteSelected"
                    @confirmRestoreSelected="confirmRestoreSelected"
                    @confirmSelectField="confirmSelectField"
                    @download="confirmExportData"
                    @confirmDeletePermanentSelectedDialog="confirmDeletePermanentSelectedDialog"
                />

                <DataTable
                    lazy
                    :loading="false"
                    ref="dt"
                    :value="data"
                    v-model:selection="selectedData"
                    dataKey="id"
                    responsiveLayout="scroll"
                    :resizableColumns="true"
                    scrollable
                    @page="onChangePage($event)"
                    @sort="onSortData"
                >
                    <template #empty>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-center md:align-items-center my-3"
                        >
                            <h5 class="m-0" :class="loading ? 'text-blue-600' : 'text-red-600'">
                                {{ loading ? 'Loading...' : 'Data Tidak Ditemukan' }}
                            </h5>
                        </div>
                    </template>
                    <template #header>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-2"
                        >
                            <h5 class="m-0 capitalize">{{ title }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left" v-if="canSearch">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" :placeholder="$t('table.search')" />
                            </span>
                        </div>
                    </template>

                    <Column
                        selectionMode="multiple"
                        headerStyle="width: 3rem"
                        v-if="canMultiSelectData"
                    ></Column>

                    <!-- start table content -->

                    <Column field="code" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.code') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.code }}
                            </span>
                        </template>
                    </Column>

                    <Column field="name" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.name') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.name }}
                            </span>
                        </template>
                    </Column>

                    <Column field="status" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> status </span>
                        </template>
                        <template #body="slotProps">
                            <Tag
                                class="mr-2"
                                :severity="slotProps.data.status ? 'success' : 'danger'"
                                :value="
                                    slotProps.data.status ? $t('text.active') : $t('text.inactive')
                                "
                            ></Tag>
                        </template>
                    </Column>

                    <!-- end table content -->

                    <Column
                        class="text-center"
                        headerStyle="min-width:10rem;"
                        :frozen="true"
                        align-frozen="right"
                        v-if="actionColumn"
                    >
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('table.action') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <ColumnActionButton
                                :actionColumn="actionColumn"
                                :data="slotProps.data"
                                :canShow="canShow"
                                :canEdit="canEdit"
                                :canRestore="canRestore"
                                :canDestroy="canDestroy"
                                :canDelete="canDelete"
                                @confirmRestoreData="confirmRestoreData(slotProps.data)"
                                @confirmDeletePermanentData="
                                    confirmDeletePermanentData(slotProps.data)
                                "
                                @showData="showData(slotProps.data)"
                                @editData="editData(slotProps.data)"
                                @confirmDestroyData="confirmDestroyData(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>

                <Paginator
                    :template="{
                        '640px': 'PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown',
                        '960px':
                            'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
                        '1300px':
                            'FirstPageLink PrevPageLink CurrentPageReport PageLink NextPageLink LastPageLink RowsPerPageDropdown',
                        default:
                            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
                    }"
                    :first="meta?.to - 1"
                    :rows="parseInt(meta?.per_page)"
                    :totalRecords="meta?.total"
                    :rowsPerPageOptions="rowsPerPage"
                    @page="onChangePage"
                >
                    <template #start>
                        <Button
                            type="button"
                            icon="pi pi-refresh"
                            text
                            v-tooltip.top="`Reload`"
                            @click="reloadData(), (channel = 0)"
                            :label="channel > 0 ? 'New update' : ''"
                        />
                    </template>
                    <template #end> </template>
                </Paginator>
            </div>
        </div>
    </div>

    <!-- form dialog -->
    <DialogFormInput
        :loading="loading"
        :show="formDialog"
        :header="form.id ? $t('dialog.edit-form') : $t('dialog.create-form')"
        :submitButton="form.id ? $t('button.update') : $t('button.save')"
        @submit="submitData"
        @close="resetDialog"
    >
        <template #content>
            <div class="card">
                <div class="p-fluid formgrid grid">
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="name"
                                type="text"
                                v-model="form.name"
                                :class="{ 'p-invalid': errors.name }"
                                @input="mainStore.removeError"
                                placeholder="Name"
                            />
                            <InputLabel value="name" />
                        </span>
                        <InputError :message="errors.name" />
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <Textarea
                                required
                                id="description"
                                :rows="5"
                                v-model="form.description"
                                :class="{ 'p-invalid': errors.description }"
                                @input="mainStore.removeError"
                                placeholder="description"
                            />
                            <InputLabel value="description" />
                        </span>
                        <InputError :message="errors.description" />
                    </div>
                    <div class="mb-4 field col-12">
                        <InputLabel value="status" class="mb-3" />
                        <InputSwitch v-model="form.status" />
                        <InputError :message="errors.status" />
                    </div>
                </div>
            </div>
        </template>
    </DialogFormInput>

    <!-- detail dialog -->
    <DialogDetail :show="detailDialog" @close="resetDialog()">
        <template #content>
            <ul class="list-none p-0">
                <ListDetailBreak :label="$t('text.code')" :value="item.code" />
                <ListDetailBreak :label="$t('text.name')" :value="item.name" />
                <ListDetailBreak
                    :label="$t('text.status')"
                    :value="item.status ? $t('text.active') : $t('text.inactive')"
                />
                <li class="mb-4">
                    <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                        {{ $t('text.status') }}
                    </p>
                    <Tag
                        class="mr-2"
                        :severity="item.status ? 'success' : 'danger'"
                        :value="item.status ? $t('text.active') : $t('text.inactive')"
                    ></Tag>
                </li>
            </ul>
        </template>
    </DialogDetail>

    <!-- restore single data dialog -->
    <DialogRestore
        :show="restoreDataDialog"
        :label="item?.name"
        :loading="loading"
        @submit="restoreData(item.id)"
        @close="resetDialog()"
    />

    <!-- delete single data dialog -->
    <DialogDestroy
        :show="destroyDataDialog"
        :label="item?.name"
        :loading="loading"
        @submit="destroyData(item.id)"
        @close="resetDialog()"
    />

    <!-- delete permanen single data dialog -->
    <DialogDelete
        :show="destroyPermanentDialog"
        :label="item?.name"
        :loading="loading"
        @submit="deleteData(item.id)"
        @close="resetDialog()"
    />

    <!-- delete selected data dialog -->
    <DialogDestroySelected
        :show="destroySelectedDialog"
        :data="selectedData"
        :loading="loading"
        @submit="destroyMultiple()"
        @close="resetDialog()"
    />

    <!-- restore selected data dialog -->
    <DialogRestoreSelected
        :show="restoreSelectedDialog"
        :data="selectedData"
        :loading="loading"
        @submit="restoreMultiple()"
        @close="resetDialog()"
    />

    <!-- delete permanent selected data dialog -->
    <DialogDeleteSelected
        :show="destroyPermanentSelectedDialog"
        :data="selectedData"
        :loading="loading"
        @submit="deleteMultiple()"
        @close="resetDialog()"
    />

    <DialogSelectField
        :show="selectFieldDialog"
        :selectedFields="selectedFields"
        :loading="loading"
        @close="resetDialog()"
    />

    <DialogUpload
        :show="uploadDialog"
        :loading="loading"
        @submit="uploadFile()"
        @close="resetDialog()"
    />

    <DialogExport
        :header="title"
        :show="exportDialog"
        :loading="isDownloading"
        @close="resetDialog()"
    />
</template>

<style scoped lang="scss"></style>
