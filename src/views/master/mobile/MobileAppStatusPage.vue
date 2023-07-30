<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
const { proxy } = getCurrentInstance();

const store = useCrudStore();

const { hideDialog, getData, filterSearch, onChangePage, processData, destroyData, onCreate, showEditDialog, showDetail, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

// mounted
onMounted(() => {
    title.value = 'Mobile App Status ';
    api.value = '/mobile/mobileAppStatus';
    tableBody.value = [
        { label: 'name', value: 'name', type: 'text', sort: true },
        { label: 'slug', value: 'slug', type: 'text', sort: true }
    ];
    getData();
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
            name: val.name
        }
    });
};

proxy.$pusher.channel('mobile-build-type-channel').listen('.mobile-build-type-event', () => {
    getData();
});
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
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputText required id="name" type="text" v-model="form.name" :class="{ 'p-invalid': errors.name }" placeholder="Name" />
                        <InputLabel value="name" />
                    </span>
                    <InputError :message="errors.name" />
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
                <ListDetailBreak label="slug" :value="selected.slug" />
                <ListDetailBreak label="name" :value="selected.name" />
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
