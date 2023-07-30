<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crudStore';
import { useOptionStore } from '@/services/optionStore';

const store = useCrudStore();
const option = useOptionStore();

const { hideDialog, load, save, update, destroy, restore, deletePermanent } = store;

const { loadDepartments, loadDesignation, loadGrade } = option;

const { departments, designations, grades } = storeToRefs(option);

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, successMessage, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, api, tableBody, title } = storeToRefs(store);

const toast = useToast();

onUnmounted(() => {
    store.data = [];
});

// table props
onMounted(() => {
    title.value = 'Employee';
    api.value = '/master/masterDataKaryawan';
    tableBody.value = [
        { label: 'NIK', value: 'nik', type: 'text', sort: true },
        { label: 'code', value: 'code', type: 'text', sort: true },
        { label: 'full name', value: 'full_name', type: 'text', sort: true },
        { label: 'grade', value: 'grade', type: 'object', sort: false, object: 'name' },
        {
            label: 'designation',
            value: 'designation',
            type: 'object',
            sort: false,
            object: 'name'
        },
        {
            label: 'department',
            value: 'department',
            type: 'object',
            sort: false,
            object: 'name'
        },
        {
            label: 'Has Account',
            value: 'has_account',
            type: 'boolean-chip',
            sort: false,
            labels: [
                {
                    label: 'Registered',
                    color: 'success'
                },
                {
                    label: 'Not Registered',
                    color: 'danger'
                }
            ]
        }
    ];
    getData();
    loadDepartments();
    loadDesignation();
    loadGrade();
});

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
        search: keyword.value,
        page: val.page + 1,
        rows: val.rows
    });
};

const onSort = (event) => {
    load({
        sortField: event.sortField,
        sortOrder: event.sortOrder > 0 ? 'ASC' : 'DESC'
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
        update();
    } else {
        save();
    }
};

const destroyData = (params) => {
    destroy(params.id).then(() => {
        notify(successMessage.value);
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
    formDialog.value = true;
};

const onEdit = (val) => {
    formLabel.value = 'Edit Data';
    form.value = {
        id: val.id,
        nik: val.nik,
        code: val.code,
        full_name: val.full_name,
        grade_id: val.grade.id,
        department_id: val.department.id,
        designation_id: val.designation.id,
        npwp: val.npwp,
        jamsostek: val.jamsostek,
        child: val.child,
        dependent: val.dependent,
        basic_salary: val.basic_salary
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
        @sort="onSort($event)"
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
    <Dialog v-model:visible="formDialog" :header="formLabel" :modal="true" :closable="false" class="p-fluid" :breakpoints="{ '960px': '85vw', '640px': '100vw' }" :style="{ width: '50vw' }">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <!-- fullname -->
                <div class="mb-5 field col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <span class="p-float-label">
                            <InputText required id="full_name" type="text" v-model="form.full_name" :class="{ 'p-invalid': errors.full_name }" />
                            <InputLabel for="full_name">Full name</InputLabel>
                        </span>
                    </div>
                    <InputError :message="errors.full_name" />
                </div>
                <!-- gradeType -->
                <div class="mb-5 field col-4">
                    <span class="p-float-label">
                        <Dropdown :filter="true" :showClear="true" id="grade_type_id" required v-model="form.grade_id" :options="grades" optionLabel="name" optionValue="id" placeholder="Select Grade Type" :class="{ 'p-invalid': errors.grade_id }" />
                        <InputLabel for="grade_type_id">Grade Type</InputLabel>
                    </span>
                    <InputError :message="errors.grade_id" />
                </div>
                <!-- designation -->
                <div class="mb-5 field col-4">
                    <span class="p-float-label">
                        <Dropdown
                            :filter="true"
                            :showClear="true"
                            id="designation_id"
                            required
                            v-model="form.designation_id"
                            :options="designations"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select Designation"
                            :class="{ 'p-invalid': errors.designation_id }"
                        />
                        <InputLabel for="designation_id">Designation</InputLabel>
                    </span>
                    <InputError :message="errors.designation_id" />
                </div>
                <!-- department -->
                <div class="mb-5 field col-4">
                    <span class="p-float-label">
                        <Dropdown
                            :filter="true"
                            :showClear="true"
                            id="department_id"
                            required
                            v-model="form.department_id"
                            :options="departments"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select Department"
                            :class="{ 'p-invalid': errors.department_id }"
                        />
                        <InputLabel for="department_id">Department</InputLabel>
                    </span>
                    <InputError :message="errors.department_id" />
                </div>

                <!-- NIK -->
                <div class="mb-5 field col-6">
                    <span class="p-float-label">
                        <InputText required id="nik" type="text" v-model="form.nik" :class="{ 'p-invalid': errors.nik }" />
                        <InputLabel for="nik">NIK</InputLabel>
                    </span>
                    <InputError :message="errors.nik" />
                </div>
                <!-- code -->
                <div class="mb-5 field col-6">
                    <span class="p-float-label">
                        <InputText required id="code" type="text" v-model="form.code" :class="{ 'p-invalid': errors.code }" />
                        <InputLabel for="code">Code</InputLabel>
                    </span>
                    <InputError :message="errors.code" />
                </div>

                <!-- NPWP -->
                <div class="mb-5 field col-6">
                    <span class="p-float-label">
                        <InputNumber :useGrouping="false" required id="npwp" type="text" v-model="form.npwp" :class="{ 'p-invalid': errors.npwp }" />
                        <InputLabel for="npwp">NPWP</InputLabel>
                    </span>
                    <InputError :message="errors.npwp" />
                </div>
                <!-- Jamsostek -->
                <div class="mb-5 field col-6">
                    <span class="p-float-label">
                        <InputText required id="jamsostek" type="text" v-model="form.jamsostek" :class="{ 'p-invalid': errors.jamsostek }" />
                        <InputLabel for="jamsostek">Jamsostek</InputLabel>
                    </span>
                    <InputError :message="errors.jamsostek" />
                </div>
                <!-- Child -->
                <div class="mb-5 field col-6">
                    <span class="p-float-label">
                        <InputNumber :useGrouping="false" :min="0" required id="child" type="text" v-model="form.child" :class="{ 'p-invalid': errors.child }" />
                        <InputLabel for="child">Child</InputLabel>
                    </span>
                    <InputError :message="errors.child" />
                </div>
                <!-- dependent -->
                <div class="mb-5 field col-6">
                    <span class="p-float-label">
                        <InputNumber :useGrouping="false" :min="0" required id="dependent" type="text" v-model="form.dependent" :class="{ 'p-invalid': errors.dependent }" />
                        <InputLabel for="dependent">Dependent</InputLabel>
                    </span>
                    <InputError :message="errors.dependent" />
                </div>

                <!-- basic salary -->
                <div class="mb-5 field col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon"> Rp. </span>
                        <span class="p-float-label">
                            <InputNumber required :min="1000" id="basic_salary" type="text" v-model="form.basic_salary" :class="{ 'p-invalid': errors.basic_salary }" />
                            <InputLabel for="basic_salary">Basic Salary</InputLabel>
                        </span>
                    </div>
                    <InputError :message="errors.basic_salary" />
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
    <Dialog v-model:visible="detailDialog" :style="{ width: '640px' }" header="Detail" :modal="true" :closable="false">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetail label="NIK" :value="selected.nik" />
                <ListDetail label="Employee Code" :value="selected.code" />
                <ListDetail label="Full name" :value="selected.full_name" />
                <ListDetail label="Department" :value="selected.department.name" />
                <ListDetail label="Designation" :value="selected.designation.name" />
                <ListDetail label="grade" :value="selected.grade.name" />
                <ListDetail label="child" :value="selected.child" />
                <ListDetail label="dependent" :value="selected.dependent" />
                <ListDetail label="NPWP" :value="selected.npwp" />
                <ListDetail label="Jamsostek" :value="selected.jamsostek" />
                <ListDetail label="Basic Salary" :value="formatCurrency(selected.basic_salary)" />
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
        <DeleteDialog :data="selected.full_name" />
        <template #footer>
            <form @submit.prevent="destroyData(selected)">
                <Button label="No" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" label="Yes" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete dialog -->
    <!-- restore dialog -->
    <Dialog v-model:visible="restoreDialog" :style="{ width: '450px' }" header="Confirm" :modal="true" :closable="false">
        <RestoreDialog :data="selected.full_name" />
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
        <DeleteDialog :data="selected.full_name" />
        <template #footer>
            <form @submit.prevent="deleteData(selected)">
                <Button label="No" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" label="Yes, Delete Permanent" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete permanent dialog -->
</template>
