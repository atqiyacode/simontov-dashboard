<script setup>
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
import { useOptionStore } from '@/services/option.store';

const store = useCrudStore();
const option = useOptionStore();

const { hideDialog, getData, filterSearch, onChangePage, processData, destroyData, onCreate, showEditDialog, showDetail, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

const { appStatuses } = storeToRefs(option);

// mounted
onMounted(() => {
    title.value = 'Mobile App Version';
    api.value = '/mobile/mobileAppVersion';
    tableBody.value = [
        { label: 'version', value: 'version', type: 'text', sort: false },
        { label: 'version code', value: 'version_code', type: 'text', sort: false },
        { label: 'status', value: 'status', object: 'name', type: 'object', sort: false }
    ];
    getData();
    option.loadAppStatus();
    option.loadDeviceType();
    option.loadBuildType();
});

// onUnMounted
onUnmounted(() => {
    store.$reset();
});

const onEdit = (val) => {
    showEditDialog();
    store.$patch({
        form: {
            id: val.id,
            version: val.version,
            version_code: val.version_code,
            note: val.note,
            mobile_app_status_id: val.status.id
        }
    });
};
</script>

<template>
    <CustomDataTable
        :label="title"
        :loading="loading"
        :data="data"
        :meta="meta"
        :rowsPerPage="rowsPerPage"
        :keyword="keyword"
        :tableBody="tableBody"
        :canSelectMultiple="false"
        :canRestore="true"
        @search="filterSearch($event)"
        @create="onCreate()"
        @show="showDetail($event)"
        @edit="onEdit($event)"
        @destroy="confirmDelete($event)"
        @changePage="onChangePage($event)"
        @restore="onRestore($event)"
        @deletePermanent="onDestroy($event)"
    />
    <!-- dialog form -->
    <Dialog v-model:visible="formDialog" :style="{ width: '640px' }" :header="formLabel" :modal="true" :closable="false" class="p-fluid">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <!-- status -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Dropdown required id="status" type="text" v-model="form.mobile_app_status_id" :class="{ 'p-invalid': errors.status }" placeholder="status" :options="appStatuses" optionLabel="name" optionValue="id" />
                        <InputLabel for="status" value="Status" />
                    </span>
                    <InputError :message="errors.status" />
                </div>
                <!-- code -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputText required id="version" type="text" v-model="form.version" :class="{ 'p-invalid': errors.version }" placeholder="Version version" />
                        <InputLabel for="version" value="Version version" />
                    </span>
                    <InputError :message="errors.version" />
                </div>
                <!-- name -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputText required id="version_code" type="text" v-model="form.version_code" :class="{ 'p-invalid': errors.version_code }" placeholder="Version version_code" />
                        <InputLabel for="version_code" value="Version code" />
                    </span>
                    <InputError :message="errors.name" />
                </div>
                <!-- note -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Textarea required id="note" v-model="form.note" :class="{ 'p-invalid': errors.note }" placeholder="Version note" :auto-resize="true" />
                        <InputLabel for="note" value="Version Note" />
                    </span>
                    <InputError :message="errors.note" />
                </div>
            </div>
        </div>

        <template #footer>
            <form @submit.prevent="processData">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog" />
                <Button :loading="loading" type="submit" :label="$t('button.process')" icon="pi pi-check" class="p-button-rounded p-button-success" />
            </form>
        </template>
    </Dialog>
    <!-- end dialog form -->
    <!-- dialog detail -->
    <Dialog v-model:visible="detailDialog" :style="{ width: '640px' }" header="Detail" :modal="true" :closable="false" class="p-fluid">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="version number" :value="selected.version" />
                <ListDetailBreak label="version code" :value="selected.version_code" />
                <ListDetailBreak label="status" :value="selected.status.name" />
                <ListDetailBreak label="note" :value="selected.note" />
            </ul>
        </div>

        <template #footer>
            <Button :label="$t('button.close')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
            <Button :label="$t('button.edit-data')" icon="pi pi-pencil" class="p-button-rounded p-button-warning" @click="onEdit(selected)" />
            <Button :label="$t('button.delete-data')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(selected)" />
        </template>
    </Dialog>
    <!-- end dialog detail -->
    <!-- delete dialog -->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <DeleteDialog :data="selected.name" />
        <template #footer>
            <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-text" @click="hideDialog()" />
            <Button :loading="loading" :label="$t('button.yes-delete')" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="destroyData(selected)" />
        </template>
    </Dialog>
    <!-- end delete dialog -->

    <!-- restore dialog -->
    <Dialog v-model:visible="restoreDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <RestoreDialog :data="selected.name" />
        <template #footer>
            <form @submit.prevent="restoreData(selected)">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" :label="$t('button.yes-restore')" icon="pi pi-check" class="p-button-rounded p-button-warning" />
            </form>
        </template>
    </Dialog>
    <!-- end restore dialog -->
    <!-- delete permanent dialog -->
    <Dialog v-model:visible="destroyDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <DeleteDialog :data="selected.name" />
        <template #footer>
            <form @submit.prevent="deleteData(selected)">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" :label="$t('button.yes-destroy')" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete permanent dialog -->
</template>
