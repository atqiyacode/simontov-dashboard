<script setup>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
import { useOptionStore } from '@/services/option.store';
import { useUserStore } from '@/services/user.store';
const { proxy } = getCurrentInstance();
const store = useCrudStore();
const userStore = useUserStore();
const option = useOptionStore();

const { hideDialog, load, filterSearch, onChangePage, processData, destroyData, onCreate, showEditDialog, showDetail, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { loadRoles, loadPermissions } = option;
const { cancelNewEmailUser, resendPendingEmailVerificationMail } = userStore;

const { roles, permissions } = storeToRefs(option);

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

const userStatus = ref('all');
// main
// table props
onMounted(() => {
    title.value = 'User';
    api.value = '/master/user';
    tableBody.value = [
        { label: 'Avatar', value: 'avatar', type: 'image', sort: false },
        {
            label: 'Name',
            value: 'name',
            type: 'text',
            sort: true
        },
        {
            label: 'Email',
            value: 'email',
            type: 'text',
            sort: true
        },
        { label: 'phone', value: 'phone', type: 'text', sort: true },
        {
            label: 'Roles',
            value: 'roles',
            type: 'array-chip',
            sort: false,
            color: 'info'
        },
        {
            label: 'Status',
            value: 'verified',
            type: 'boolean-chip',
            sort: false,
            labels: [
                {
                    label: 'Verified',
                    color: 'success'
                },
                {
                    label: 'Not Verified',
                    color: 'danger'
                }
            ]
        },
        {
            label: 'Pending New Email',
            value: 'newEmail',
            type: 'boolean-chip',
            sort: false,
            labels: [
                {
                    label: 'Yes',
                    color: 'warning'
                },
                {
                    label: 'No',
                    color: 'danger'
                }
            ]
        }
    ];
    getData();
    loadRoles();
    loadPermissions();
});

onUnmounted(() => {
    store.$reset();
});

const getData = () => {
    const params = {};
    keyword.value ? (params.search = keyword.value) : null;
    params.status = userStatus.value;
    load(params);
};

const onEdit = (val) => {
    showEditDialog();
    store.$patch({
        form: {
            id: val.id,
            name: val.name,
            email: val.email,
            phone: val.phone
        }
    });
    selectedRoles(val.roles);
    selectedPermissions(val.permissions);
};

const onCancelNewEmailUser = (val) => {
    cancelNewEmailUser(val).then(() => {
        getData();
    });
};

const onResendPendingEmailVerificationMail = (val) => {
    resendPendingEmailVerificationMail(val).then(() => {
        getData();
    });
};

// other
const selectedRoles = (roles) => {
    let list = [];
    roles.forEach((val) => {
        list.push(val.id);
    });
    form.value.roles = list;
};
const selectedPermissions = (permissions) => {
    let list = [];
    permissions.forEach((val) => {
        list.push(val.id);
    });
    form.value.permissions = list;
};

const statuses = [
    {
        code: 'all',
        name: 'All Status',
        color: 'p-button-primary'
    },
    {
        code: 'true',
        name: 'Verified',
        color: 'p-button-success'
    },
    {
        code: 'false',
        name: 'Not verify',
        color: 'p-button-danger'
    }
];

function filterUserStatus() {
    getData();
}

proxy.$pusher.channel('user-channel').listen('.user-event', () => {
    getData();
});
</script>

<template>
    <div class="card mb-2">
        <Toolbar class="p-0">
            <template v-slot:start>
                <div class="my-0">
                    <Button label="New Data" icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-success mr-2" @click="onCreate()" />
                </div>
            </template>

            <template v-slot:end>
                <span class="p-float-label">
                    <Dropdown v-model="userStatus" :options="statuses" optionLabel="name" optionValue="code" placeholder="User Status" @change="filterUserStatus($event)" style="width: 150px">
                        <template #option="slotProps">
                            <div class="text-center">
                                <Button :label="slotProps.option.name" :class="slotProps.option.color" class="p-button-sm w-full"> </Button>
                            </div>
                        </template>
                    </Dropdown>
                    <InputLabel for="user status" value="user status" />
                </span>
            </template>
        </Toolbar>
    </div>

    <CustomDataTable
        :label="title"
        :loading="loading"
        :data="data"
        :meta="meta"
        :rowsPerPage="rowsPerPage"
        :keyword="keyword"
        :tableBody="tableBody"
        :canSelectMultiple="false"
        :canCreate="false"
        :canRestore="true"
        @search="filterSearch($event)"
        @show="showDetail($event)"
        @edit="onEdit($event)"
        @destroy="confirmDelete($event)"
        @changePage="onChangePage($event)"
        @restore="onRestore($event)"
        @deletePermanent="onDestroy($event)"
    />
    <!-- dialog form -->
    <Dialog v-model:visible="formDialog" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '50vw' }" :header="formLabel" :modal="true" :closable="false" class="p-fluid">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <!-- fullname -->
                <div class="mb-4 field col-12 md:col-12">
                    <span class="p-float-label">
                        <InputText required id="full-name" type="text" v-model="form.name" :class="{ 'p-invalid': errors.name }" placeholder="Full Name" />
                        <InputLabel for="name" value="name" />
                    </span>
                    <InputError :message="errors.name" />
                </div>
                <!-- email -->
                <div class="mb-4 field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText required id="email" type="email" v-model="form.email" :class="{ 'p-invalid': errors.email }" placeholder="Email" />
                        <InputLabel for="email" value="email" />
                    </span>
                    <InputError :message="errors.email" />
                </div>
                <!-- phone -->
                <div class="mb-4 field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText required @keypress="onNumeric" id="phone" v-model="form.phone" :class="{ 'p-invalid': errors.phone }" placeholder="08xx-xxxx-xxxx" />
                        <InputLabel for="phone" value="Phone Number" />
                    </span>
                    <InputError :message="errors.phone" />
                </div>

                <!-- password -->
                <div class="mb-4 field col-12 md:col-6">
                    <span class="p-float-label">
                        <Password required v-model="form.password" toggleMask id="password" placeholder="Password" :class="{ 'p-invalid': errors.password }"></Password>
                        <InputLabel for="password" value="password" />
                    </span>
                    <InputError :message="errors.password" />
                </div>
                <!-- confirm password -->
                <div class="mb-4 field col-12 md:col-6">
                    <span class="p-float-label">
                        <Password required v-model="form.password_confirmation" toggleMask :feedback="false" id="password_confirmation" placeholder="Password Confirmation" :class="{ 'p-invalid': errors.password_confirmation }"></Password>
                        <InputLabel for="password_confirmation" value="password confirmation" />
                    </span>
                    <InputError :message="errors.password_confirmation" />
                </div>
                <!-- roles -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <MultiSelect required v-model="form.roles" :options="roles" optionLabel="name" optionValue="id" placeholder="Select roles" display="chip" :class="{ 'p-invalid': errors.roles }" />
                        <InputLabel for="roles" value="roles" />
                    </span>
                    <InputError :message="errors.roles" />
                </div>
                <!-- permissions -->
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <MultiSelect required v-model="form.permissions" :options="permissions" optionLabel="name" optionValue="id" placeholder="Select Permissions" display="chip" :class="{ 'p-invalid': errors.permissions }" />
                        <InputLabel for="permissions" value="permissions" />
                    </span>
                    <InputError :message="errors.permissions" />
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
                <ListDetailBreak label="full name" :value="selected.name" />
                <ListDetailBreak label="email" :value="selected.email" />
                <ListDetailBreak class="text-yellow-400" v-if="selected.newEmail" label="new email" :value="selected.pendingEmail" />
                <ListDetailBreak label="Phone number" :value="selected.phone" />
                <ListDetailBreak label="Register Date" :value="selected.join_date.full_date" />
                <li class="mb-4">
                    <div>
                        <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">status</p>
                    </div>
                    <div class="mt-2">
                        <Tag :severity="selected.verified ? 'success' : 'danger'" :value="selected.verified ? 'Verified' : 'Not Verified'"></Tag>
                    </div>
                </li>
                <li class="mb-4">
                    <div>
                        <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">Roles</p>
                    </div>
                    <div class="mt-2" v-if="selected.roles">
                        <template v-for="(item, index) in selected.roles" :key="index">
                            <Tag class="mr-2 mb-2" severity="secondary" :value="`${item.name}`"></Tag>
                            <!-- <Tag class="mr-2 mb-2" severity="info" :value="`role:${item.name}`"></Tag> -->
                            <!-- <template v-for="(data, id) in item.permissions" :key="id">
                                <Tag class="mr-2 mb-2" severity="warning" :value="`permission: ${data.name}`"></Tag>
                            </template> -->
                        </template>
                    </div>
                </li>
                <li class="mb-4">
                    <div>
                        <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">Special Permissions</p>
                    </div>
                    <div class="mt-2" v-if="selected.permissions.length > 0">
                        <template v-for="(item, index) in selected.permissions" :key="index">
                            <Tag class="mr-2 mb-2" severity="info" :value="item.name"></Tag>
                        </template>
                    </div>
                    <div class="mt-2" v-else>
                        <span class="text-blue-600 font-medium"> - </span>
                    </div>
                </li>
            </ul>
        </div>

        <template #footer>
            <div class="grid">
                <div class="col-12 md:col-12">
                    <Button v-if="selected.newEmail" :label="$t('button.cancel-new-email')" icon="pi pi-times" class="p-button-rounded p-button-outlined p-button-warning" @click="onCancelNewEmailUser(selected)" />
                    <Button v-if="selected.newEmail" :label="$t('button.resend-new-email')" icon="pi pi-send" class="p-button-rounded p-button-outlined p-button-info" @click="onResendPendingEmailVerificationMail(selected)" />
                </div>
                <div class="col-12 md:col-12">
                    <Button :label="$t('button.close')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />

                    <Button :label="$t('button.edit-data')" icon="pi pi-pencil" class="p-button-rounded p-button-warning" @click="onEdit(selected)" />
                    <Button :label="$t('button.delete-data')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(selected)" />
                </div>
            </div>
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
