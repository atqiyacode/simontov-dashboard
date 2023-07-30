<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();

const store = useCrudStore();
const router = useRouter();
const { hideDialog, getData, filterSearch, onChangePage, processData, destroyData, onCreate, showEditDialog, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

const statuses = [
    {
        id: 1,
        name: 'Active'
    },
    {
        id: 0,
        name: 'Inactive'
    }
];

// mounted
onMounted(() => {
    title.value = 'Job Vacancy Page';
    api.value = '/hr/jobVacancy';
    tableBody.value = [
        { label: 'title', value: 'title', type: 'text', sort: true },
        { label: 'type', value: 'type', type: 'text', sort: true },
        { label: 'position', value: 'position', type: 'object', object: 'name', sort: true },
        { label: 'recruitments', value: 'recruitment_count', type: 'text', sort: true },
        {
            label: 'Status',
            value: 'status',
            type: 'boolean-chip',
            sort: false,
            labels: [
                {
                    label: 'Active',
                    color: 'success'
                },
                {
                    label: 'Inactive',
                    color: 'danger'
                }
            ]
        },
        { label: 'open date', value: 'open_date', type: 'object', object: 'full_date', sort: true },
        { label: 'close date', value: 'close_date', type: 'object', object: 'human_date', sort: true }
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
            title: val.title,
            status: val.status ? 1 : 0,
            type: val.type,
            close_date: val.close_date,
            open_date: val.open_date
        }
    });
};

const showDetail = (val) => {
    router.push({
        name: 'detail-job-vacancy',
        params: {
            id: val.id
        }
    });
};

proxy.$pusher.channel('department-channel').listen('.department-event', () => {
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
                        <InputText required id="title" type="text" v-model="form.title" :class="{ 'p-invalid': errors.title }" placeholder="title" />
                        <InputLabel value="title" />
                    </span>
                    <InputError :message="errors.title" />
                </div>

                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Dropdown required v-model="form.status" :options="statuses" optionLabel="name" optionValue="id" placeholder="Select status" display="chip" :class="{ 'p-invalid': errors.status }" />
                        <InputLabel for="status" value="status" />
                    </span>
                    <InputError :message="errors.status" />
                </div>

                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Calendar v-model="form.open_date" :minDate="minDate" :maxDate="maxDate" :manualInput="false" dateFormat="DD, dd MM yy" />
                        <InputLabel for="open_date" value="open date" />
                    </span>
                    <InputError :message="errors.open_date" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Calendar v-model="form.close_date" :minDate="minDate" :maxDate="maxDate" :manualInput="false" dateFormat="DD, dd MM yy" />
                        <InputLabel for="close_date" value="close date" />
                    </span>
                    <InputError :message="errors.close_date" />
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
    <Dialog v-model:visible="detailDialog" :style="{ width: '640px' }" :header="$t('header.detail')" :modal="true" :closable="false" class="p-fluid">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="title" :value="selected.title" />
                <ListDetailBreak label="type" :value="selected.type" />
                <ListDetailBreak label="status" :value="selected.status" />
                <ListDetailBreak label="open date" :value="selected.open_date.full_date" />
                <ListDetailBreak label="close date" :value="`${selected.close_date.full_date} - ${selected.close_date.human_date}`" />
                <ListDetailBreak label="Limit at" :value="`${selected.close_date.human_date}`" />
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
        <DeleteDialog :data="selected.title" />
        <template #footer>
            <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-text" @click="hideDialog()" />
            <Button :loading="loading" :label="$t('button.yes-delete')" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="destroyData(selected)" />
        </template>
    </Dialog>
    <!-- end delete dialog -->

    <!-- restore dialog -->
    <Dialog v-model:visible="restoreDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <RestoreDialog :data="selected.title" />
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
        <DeleteDialog :data="selected.title" />
        <template #footer>
            <form @submit.prevent="deleteData(selected)">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" :label="$t('button.yes-destroy')" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete permanent dialog -->
</template>
