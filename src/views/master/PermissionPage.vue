<script setup>
import { getCurrentInstance, onMounted, onUnmounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crudStore';
const { proxy } = getCurrentInstance();

const store = useCrudStore();

const { hideDialog, load, save, update, destroy } = store;

const { keyword, deleteDialog, detailDialog, formDialog, successMessage, errorMessage, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

// main
const toast = useToast();

// mounted
onMounted(() => {
    title.value = 'Permission';
    api.value = '/master/permission';
    tableBody.value = [{ label: 'name', value: 'name', type: 'text', sort: true }];
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
        update()
            .then(() => {
                notify(successMessage.value);
            })
            .catch(() => {
                notify(errorMessage.value, 'error');
            });
    } else {
        save()
            .then(() => {
                notify(successMessage.value);
            })
            .catch(() => {
                notify(errorMessage.value, 'error');
            });
    }
};

const destroyData = (params) => {
    destroy(params.id)
        .then(() => {
            hideDialog();
            getData();
            notify(successMessage.value);
        })
        .catch(() => {
            hideDialog();
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

proxy.$pusher.channel('permission-channel').listen('.permission-event', () => {
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
        @search="filterSearch($event)"
        @create="onCreate()"
        @show="showDetail($event)"
        @edit="onEdit($event)"
        @destroy="confirmDelete($event)"
        @changePage="onChangePage($event)"
    />
    <!-- dialog form -->
    <Dialog v-model:visible="formDialog" :style="{ width: '640px' }" :header="formLabel" :modal="true" :closable="false" class="p-fluid">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <!-- fullname -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputText required id="name" type="text" v-model="form.name" :class="{ 'p-invalid': errors.name }" placeholder="Full Name" />
                        <label for="name">Name</label>
                    </span>
                    <InputError :message="errors.name" />
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
                <ListDetailBreak label="guard" :value="selected.guard_name" />
            </ul>
        </div>

        <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
            <Button label="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-warning" @click="onEdit(selected)" />
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
</template>
