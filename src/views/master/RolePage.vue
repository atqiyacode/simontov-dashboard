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
    sortField.value = 'name';
    title.value = i18n.t('page.roles');
    apiUrl.value = 'roles';
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
proxy.$pusher.subscribe('role-channel').bind('.role-event', () => {
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

                    <Column field="name" :sortable="true" headerStyle="min-width:10rem;">
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

                    <Column field="guard_name" :sortable="true" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.guard-name') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.guard_name }}
                            </span>
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
                <div class="field">
                    <label class="font-bold" for="name">Nama</label>
                    <InputText
                        id="name"
                        v-model="form.name"
                        required="true"
                        :class="{ 'p-invalid': errors?.name }"
                        placeholder="Name"
                        @input="mainStore.removeError"
                    />
                    <InputError :message="errors?.name" />
                </div>
            </div>
        </template>
    </DialogFormInput>

    <!-- detail dialog -->
    <DialogDetail :show="detailDialog" @close="resetDialog()">
        <template #content>
            <ul class="list-none p-0">
                <ListDetailBreak :label="$t('text.name')" :value="item.name" />
                <ListDetailBreak :label="$t('text.guard-name')" :value="item.guard_name" />
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
