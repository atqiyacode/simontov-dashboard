<script setup>
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue';
import { useMainStore } from '@/services/main.store';
import { useGlobalStore } from '@/services/global.store';
import { storeToRefs } from 'pinia';
import { i18n } from '@/plugins/i18n';

const { proxy } = getCurrentInstance();
const mainStore = useMainStore();
const GlobalStore = useGlobalStore();

const { loading, errors, currentMap } = storeToRefs(mainStore);

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
    title.value = i18n.t('Location Notification');
    apiUrl.value = 'locationNotifications';
    form.value = {
        id: null,
        name: '',
        description: ''
    };

    await getData({
        per_page: meta?.value.per_page,
        location_id: currentMap.value.id
    });
});

const reloadData = () => {
    getData({
        per_page: meta?.value.per_page,
        location_id: currentMap.value.id
    });
};

onUnmounted(() => {
    GlobalStore.resetTable();
    GlobalStore.$reset();
});
const channel = ref(0);
proxy.$pusher
    .subscribe('location-notification-channel-' + currentMap.value.id)
    .bind('.location-notification-event', (res) => {
        reloadData();
        console.log(res);
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

                    <Column field="created_at" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Craeted Date </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.created_at }}
                            </span>
                        </template>
                    </Column>

                    <Column field="updated_at" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> updated Date </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.updated_at }}
                            </span>
                        </template>
                    </Column>

                    <Column field="location_id" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Location </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.location?.name }}
                            </span>
                        </template>
                    </Column>

                    <Column
                        field="alert_notification_type_id"
                        :sortable="true"
                        headerStyle="min-width:15rem;"
                    >
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Alert type </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.alertNotificationType?.name }}
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
                <div class="p-fluid formgrid grid">
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="location_id"
                                type="text"
                                v-model="form.location_id"
                                :class="{ 'p-invalid': errors.location_id }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.location_id')" />
                        </span>
                        <InputError :message="errors.location_id" />
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="alert_notification_type_id"
                                type="text"
                                v-model="form.alert_notification_type_id"
                                :class="{ 'p-invalid': errors.alert_notification_type_id }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.alert_notification_type_id')" />
                        </span>
                        <InputError :message="errors.alert_notification_type_id" />
                    </div>
                </div>
            </div>
        </template>
    </DialogFormInput>

    <!-- detail dialog -->
    <DialogDetail :show="detailDialog" @close="resetDialog()">
        <template #content>
            <ul class="list-none p-0">
                <ListDetailBreak label="code" :value="item.location?.code" />
                <ListDetailBreak label="Name" :value="item.location?.name" />
            </ul>
            <Divider />
            <ul class="list-none p-0">
                <ListDetailBreak label="Alert name" :value="item.alertNotificationType?.name" />
                <ListDetailBreak
                    label="Alert Job Event"
                    :value="item.alertNotificationType?.job_event"
                />
                <ListDetailBreak
                    label="Description"
                    :value="item.alertNotificationType?.description"
                />
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
