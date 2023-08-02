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
    title.value = 'Range Type';
    api.value = '/feature/rangeType';
    tableBody.value = [
        { label: 'label', value: 'label', type: 'text' },
        { label: 'lower_limit', value: 'lower_limit', type: 'volume' },
        { label: 'upper_limit', value: 'upper_limit', type: 'volume' }
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
            label: val.label,
            lower_limit: val.lower_limit,
            upper_limit: val.upper_limit,
            description: val.description
        }
    });
};

proxy.$pusher.channel('range-type-channel').listen('.range-type-event', (val) => {
    console.log(val);
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
                        <InputText required id="label" type="text" v-model="form.label" :class="{ 'p-invalid': errors.label }" placeholder="label" />
                        <InputLabel value="label" />
                    </span>
                    <InputError :message="errors.label" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputNumber required id="lower_limit" type="text" v-model="form.lower_limit" :class="{ 'p-invalid': errors.lower_limit }" placeholder="lower_limit" />
                        <InputLabel value="lower_limit" />
                    </span>
                    <InputError :message="errors.lower_limit" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputNumber required id="upper_limit" type="text" v-model="form.upper_limit" :class="{ 'p-invalid': errors.upper_limit }" placeholder="upper_limit" />
                        <InputLabel value="upper_limit" />
                    </span>
                    <InputError :message="errors.upper_limit" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Textarea required id="description" v-model="form.description" :class="{ 'p-invalid': errors.description }" placeholder="description" :rows="5" />
                        <InputLabel value="description" />
                    </span>
                    <InputError :message="errors.description" />
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
    <Dialog v-model:visible="detailDialog" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }" header="Detail" :modal="true" :closable="false">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="label" :value="selected.label" />
                <ListDetailBreak label="lower_limit" :value="selected.lower_limit" />
                <ListDetailBreak label="upper_limit" :value="selected.upper_limit" />
                <ListDetailBreak label="description" :value="selected.description" />
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
