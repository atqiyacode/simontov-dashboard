<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crudStore';
import { useToast } from 'primevue/usetoast';

const store = useCrudStore();

const { hideDialog, load, save, update, destroy, restore, deletePermanent } = store;

const { keyword, restoreDialog, destroyDialog, deleteDialog, detailDialog, formDialog, successMessage, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

// main
const toast = useToast();
const statuses = [
    {
        id: 'active',
        name: 'Active'
    },
    {
        id: 'inactive',
        name: 'Inactive'
    }
];

// mounted
onMounted(() => {
    title.value = 'Position';
    api.value = '/master/position';
    tableBody.value = [
        { label: 'name', value: 'name', type: 'text', sort: true },
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
        }
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
    form.value.status = form.value.status === 'active' ? true : false;
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
        name: val.name,
        description: val.description,
        status: val.status ? 'active' : 'inactive'
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
    selected.value = val;
    detailDialog.value = true;
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
                <!-- name -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputText required id="name" type="text" v-model="form.name" :class="{ 'p-invalid': errors.name }" placeholder="Name" />
                        <InputLabel for="name" value="name" />
                    </span>
                    <InputError :message="errors.name" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Textarea :rows="5" :autoResize="true" required id="description" v-model="form.description" :class="{ 'p-invalid': errors.description }" placeholder="description" />
                        <InputLabel for="description" value="description" />
                    </span>
                    <InputError :message="errors.description" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Dropdown required v-model="form.status" :options="statuses" optionLabel="name" optionValue="id" placeholder="Select status" display="chip" :class="{ 'p-invalid': errors.status }" />
                        <InputLabel for="status" value="status" />
                    </span>
                    <InputError :message="errors.status" />
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
                <ListDetailBreak label="name" :value="selected.name" />
                <ListDetailBreak label="description" :value="selected.description" />
                <li class="mb-4">
                    <div>
                        <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">Status</p>
                    </div>
                    <div class="mt-2">
                        <Tag :severity="selected.status ? 'success' : 'danger'" :value="selected.status ? 'Active' : 'Inactive'"></Tag>
                    </div>
                </li>
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
