<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crudStore';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const store = useCrudStore();

const { hideDialog, load, get, save, update, destroy, restore, deletePermanent } = store;

const { keyword, restoreDialog, destroyDialog, deleteDialog, detailDialog, formDialog, successMessage, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

// main
const toast = useToast();
const router = useRouter();

// mounted
onMounted(() => {
    title.value = 'Job Vacancy Page';
    api.value = '/hr/jobVacancy';
    tableBody.value = [
        { label: 'title', value: 'title', type: 'text', sort: true },
        { label: 'open_date', value: 'open_date', type: 'text', sort: true }
    ];
    getData();
});

// onUnMounted
onUnmounted(() => {
    store.$reset();
});

watch(
    keyword,
    _.debounce((value) => {
        let length = value.length;
        if (length >= 3 || length == 0) {
            keyword.value = value;
            getData();
        }
    }, 500)
);
const filterSearch = (value) => {
    keyword.value = value;
};

const onChangePage = (val) => {
    load({
        page: val.page + 1,
        rows: val.rows
    });
};

// axios
const getData = () => {
    const params = {};
    keyword.value ? (params.search = keyword.value) : null;
    load(params);
};

const processData = () => {
    if (form.value.id) {
        update().then(() => {
            notify(successMessage.value);
        });
    } else {
        save().then(() => {
            notify(successMessage.value);
        });
    }
};

const destroyData = (params) => {
    destroy(params.id)
        .then(() => {
            getData();
            notify(successMessage.value);
        })
        .catch((err) => {
            hideDialog();
            notify(err.data.error, 'error');
        });
};

const restoreData = (params) => {
    restore(params.id).then(() => {
        notify(successMessage.value);
    });
};

const deleteData = (params) => {
    deletePermanent(params.id).then(() => {
        notify(successMessage.value);
    });
};

// dialog
const onCreate = () => {
    formLabel.value = 'New Data';
    selected.value = {};
    form.value = {};
    formDialog.value = true;
};

const onEdit = (val) => {
    formLabel.value = 'Edit Data';
    form.value = {
        id: val.id,
        name: val.name
    };
    formDialog.value = true;
    detailDialog.value = false;
};

const onRestore = (val) => {
    selected.value = val;
    restoreDialog.value = true;
    deleteDialog.value = false;
    detailDialog.value = false;
};

const onDestroy = (val) => {
    selected.value = val;
    destroyDialog.value = true;
};

const showDetail = (val) => {
    router.push({
        name: 'detail-job-vacancy',
        params: {
            id: val.id
        }
    });
    get(val.id);
    // selected.value = val;
    // detailDialog.value = true;
};
const confirmDelete = (val) => {
    selected.value = val;
    deleteDialog.value = true;
    detailDialog.value = false;
};
// other

const notify = (message, type = 'success') => {
    if (message) {
        toast.add({
            severity: type,
            summary: 'Notification',
            detail: message,
            life: 3000,
            closable: false
        });
    }
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
        :canCreate="false"
        :canEdit="false"
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
                        <input-label value="title" />
                    </span>
                    <InputError :message="errors.title" />
                </div>
            </div>
        </div>

        <template #footer>
            <form @submit.prevent="processData">
                <Button label="Cancel" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog" />
                <Button :loading="loading" type="submit" label="Submit" icon="pi pi-check" class="p-button-rounded p-button-success" />
            </form>
        </template>
    </Dialog>
    <!-- end dialog form -->
    <!-- dialog detail -->
    <Dialog v-model:visible="detailDialog" :style="{ width: '640px' }" header="Detail" :modal="true" :closable="false" class="p-fluid">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="title" :value="selected.title" />
                <pre>
                    {{ selected }}
                </pre>
            </ul>
        </div>

        <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
            <Button label="Delete" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(selected)" />
        </template>
    </Dialog>
    <!-- end dialog detail -->
    <!-- delete dialog -->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true" :closable="false">
        <DeleteDialog :data="selected.name" />
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDialog()" />
            <Button :loading="loading" label="Yes" icon="pi pi-check" class="p-button-danger" @click="destroyData(selected)" />
        </template>
    </Dialog>
    <!-- end delete dialog -->

    <!-- restore dialog -->
    <Dialog v-model:visible="restoreDialog" :style="{ width: '450px' }" header="Confirm" :modal="true" :closable="false">
        <RestoreDialog :data="selected.name" />
        <template #footer>
            <form @submit.prevent="restoreData(selected)">
                <Button label="No" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" label="Yes, Restore" icon="pi pi-check" class="p-button-rounded p-button-warning" />
            </form>
        </template>
    </Dialog>
    <!-- end restore dialog -->
    <!-- delete permanent dialog -->
    <Dialog v-model:visible="destroyDialog" :style="{ width: '450px' }" header="Confirm" :modal="true" :closable="false">
        <DeleteDialog :data="selected.name" />
        <template #footer>
            <form @submit.prevent="deleteData(selected)">
                <Button label="No" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" label="Yes, Delete Permanent" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete permanent dialog -->
</template>
