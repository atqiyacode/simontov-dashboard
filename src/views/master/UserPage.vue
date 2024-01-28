<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted, getCurrentInstance } from 'vue';

import { useMainStore } from '@/services/main.store';
import { useUserStore } from '@/services/master/User.store';
import { useLocationStore } from '@/services/master/Location.store';
import { useRoleStore } from '@/services/master/Role.store';
import { usePermissionStore } from '@/services/master/Permission.store';
import { useDashboardChart } from '@/services/master/DashboardChart.store';
import { storeToRefs } from 'pinia';

// import router from '@/router';

const mainStore = useMainStore();
const UserStore = useUserStore();
const { proxy } = getCurrentInstance();
const LocationStore = useLocationStore();
const RoleStore = useRoleStore();
const PermissionStore = usePermissionStore();
const DashboardChart = useDashboardChart();

proxy.$pusher.subscribe('user-channel').bind('.user-event', () => {
    //
});
const {
    sortField,
    title,
    data,
    meta,
    keyword,
    selectedData,
    form,
    item,
    rowsPerPage,
    formDialog,
    destroyDataDialog,
    destroySelectedDialog,
    restoreDataDialog,
    restoreSelectedDialog,
    destroyPermanentDialog,
    destroyPermanentSelectedDialog
} = storeToRefs(UserStore);
const { loading, errors } = storeToRefs(mainStore);
const {
    onChangePage,
    onSortData,
    getData,
    createData,
    updateData,
    restoreData,
    destroyData,
    deleteData,
    destroyMultiple,
    restoreMultiple,
    deleteMultiple,
    exportCSV,
    exportExcel
} = UserStore;

const dt = ref(null);

onBeforeMount(() => {
    sortField.value = '-id';
    getData({
        per_page: meta.value.per_page
    });
});
onMounted(() => {
    LocationStore.getAll();
    DashboardChart.getAll();
    RoleStore.getData();
    PermissionStore.getData();
});

onUnmounted(() => {
    // UserStore.$reset();
});

const openNew = () => {
    selectedData.value = [];
    form.value = {};
    formDialog.value = true;
};

const hideDialog = () => {
    errors.value = {};
    formDialog.value = false;
};

const saveData = () => {
    if (form.value.id) {
        updateData();
    } else {
        createData();
    }
};

const editData = (data) => {
    form.value = { ...data };
    formDialog.value = true;
    selectedData.value = [];
    // router.push({
    //     name: 'master-user-detail',
    //     params: {
    //         id: id
    //     }
    // });
};

// destroy
const confirmDestroyData = (data) => {
    item.value = data;
    destroyDataDialog.value = true;
    selectedData.value = [];
};

// restore
const confirmRestoreData = (data) => {
    item.value = data;
    restoreDataDialog.value = true;
};

// delete permanently
const confirmDeletePermanentData = (data) => {
    item.value = data;
    destroyPermanentDialog.value = true;
};

// delete selected
const confirmDeleteSelected = () => {
    destroySelectedDialog.value = true;
};

// restore selected
const confirmRestoreSelected = () => {
    restoreSelectedDialog.value = true;
};

// delete permanent selected
const confirmDeletePermanentSelectedDialog = () => {
    destroyPermanentSelectedDialog.value = true;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button
                                v-tooltip.top="$t('button.new-data')"
                                icon="pi pi-plus"
                                class="p-button-rounded p-button-sm p-button-success mr-2"
                                @click="openNew"
                            />
                            <Button
                                v-tooltip.top="$t('button.delete-data')"
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-sm p-button-warning mr-2"
                                @click="confirmDeleteSelected"
                                :disabled="!selectedData || !selectedData.length"
                            />
                            <Button
                                v-tooltip.top="$t('button.restore-data')"
                                icon="pi pi-refresh"
                                class="p-button-rounded p-button-sm p-button-info mr-2"
                                @click="confirmRestoreSelected"
                                :disabled="!selectedData || !selectedData.length"
                            />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button
                            label="CSV"
                            icon="pi pi-file"
                            class="p-button-info p-button-sm mr-2"
                            @click="exportCSV($event)"
                        />
                        <Button
                            label="Excel"
                            icon="pi pi-file-excel"
                            class="p-button-success p-button-sm mr-2"
                            @click="exportExcel($event)"
                        />
                        <Button
                            :label="$t('button.delete-data-Permanent')"
                            v-tooltip.top="$t('button.delete-data-Permanent')"
                            icon="pi pi-trash"
                            class="p-button-sm p-button-danger"
                            @click="confirmDeletePermanentSelectedDialog"
                            :disabled="!selectedData || !selectedData.length"
                        />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :row-hover="false"
                    :loading="loading"
                    :value="data"
                    v-model:selection="selectedData"
                    dataKey="id"
                    responsiveLayout="scroll"
                    @page="onChangePage($event)"
                    @sort="onSortData"
                    scrollable
                    class="p-datatable-sm"
                >
                    <template #empty>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-center md:align-items-center my-3"
                        >
                            <h5 class="m-0 text-red-600">
                                {{ $t('alert.no-data-found') }}
                            </h5>
                        </div>
                    </template>
                    <template #header>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-2"
                        >
                            <h5 class="m-0 capitalize">{{ title }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left" v-if="!formDialog">
                                <i class="pi pi-search" />
                                <InputText
                                    v-model="keyword"
                                    :placeholder="$t('table.search')"
                                    autocomplete="false"
                                    id="search"
                                />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.full-name') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.name }}
                            </span>
                        </template>
                    </Column>
                    <Column field="username" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.username') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.username }}
                            </span>
                        </template>
                    </Column>
                    <Column field="email" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.email') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.email }}
                            </span>
                        </template>
                    </Column>

                    <Column
                        class="text-center"
                        headerStyle="min-width:7rem;"
                        alignFrozen="right"
                        :frozen="true"
                    >
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('table.action') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <Button
                                v-if="slotProps.data.trashed"
                                v-tooltip.top="$t('button.restore-data')"
                                icon="pi pi-refresh"
                                class="p-button-rounded p-button-sm p-button-secondary mr-2"
                                @click="confirmRestoreData(slotProps.data)"
                            />
                            <Button
                                v-if="slotProps.data.trashed"
                                v-tooltip.top="$t('button.delete-data')"
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-sm p-button-danger mr-2"
                                @click="confirmDeletePermanentData(slotProps.data)"
                            />
                            <Button
                                v-if="!slotProps.data.trashed"
                                v-tooltip.top="$t('button.edit-data')"
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-sm p-button-success mr-2"
                                @click="editData(slotProps.data)"
                            />
                            <Button
                                v-if="!slotProps.data.trashed"
                                v-tooltip.top="$t('button.delete-data')"
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-sm p-button-warning mt-2"
                                @click="confirmDestroyData(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>

                <Paginator
                    v-if="meta.total > 0"
                    :template="{
                        '640px': 'PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown',
                        '960px':
                            'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
                        '1300px':
                            'FirstPageLink PrevPageLink CurrentPageReport PageLink NextPageLink LastPageLink RowsPerPageDropdown',
                        default:
                            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
                    }"
                    :first="meta.to - 1"
                    :rows="parseInt(meta.per_page)"
                    :totalRecords="meta.total"
                    :rowsPerPageOptions="rowsPerPage"
                    @page="onChangePage"
                />
            </div>
        </div>
    </div>

    <!-- form dialog -->
    <Dialog
        v-model:visible="formDialog"
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        :header="form.id ? $t('button.edit-data') : $t('button.new-data')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
        class="p-fluid"
    >
        <TabView>
            <TabPanel header="Detail" v-if="form.id">
                <div class="card">
                    <ul class="list-none p-0 m-0">
                        <ListDetailBreak label="full name" :value="form.name" />
                        <ListDetailBreak label="username" :value="form.username" />
                        <ListDetailBreak label="email" :value="form.email" />
                        <li class="mb-4">
                            <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Roles
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.roles_name">
                                <template v-for="(item, index) in form.roles_name" :key="index">
                                    <Tag class="mr-2 mb-2" severity="info" :value="`${item}`"></Tag>
                                </template>
                            </div>
                            <!-- <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Permissions
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.permissions_name">
                                <template
                                    v-for="(item, index) in form.permissions_name"
                                    :key="index"
                                >
                                    <Tag
                                        class="mr-2 mb-2"
                                        severity="secondary"
                                        :value="`${item}`"
                                    ></Tag>
                                </template>
                            </div> -->
                            <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Locations
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.locations_name">
                                <template v-for="(item, index) in form.locations_name" :key="index">
                                    <Tag
                                        class="mr-2 mb-2"
                                        severity="primary"
                                        :value="`${item}`"
                                    ></Tag>
                                </template>
                            </div>
                            <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Charts
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.dashboardCharts_name">
                                <template
                                    v-for="(item, index) in form.dashboardCharts_name"
                                    :key="index"
                                >
                                    <Tag
                                        class="mr-2 mb-2"
                                        severity="success"
                                        :value="`${item}`"
                                    ></Tag>
                                </template>
                            </div>
                        </li>
                    </ul>
                </div>
            </TabPanel>
            <TabPanel header="Account">
                <div class="card">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12">
                            <label class="font-bold capitalize" for="name">Name</label>
                            <InputText
                                id="name"
                                v-model="form.name"
                                placeholder="Full Name"
                                :class="{ 'p-invalid': errors?.name }"
                            />
                            <small class="text-sm p-error" v-if="errors?.name">
                                {{ errors?.name[0] }}
                            </small>
                        </div>
                        <div class="field col-12">
                            <label class="font-bold capitalize" for="username">username</label>
                            <InputText
                                id="username"
                                v-model="form.username"
                                placeholder="Username"
                                :class="{ 'p-invalid': errors?.username }"
                            />
                            <small class="text-sm p-error" v-if="errors?.username">
                                {{ errors?.username[0] }}
                            </small>
                        </div>
                        <div class="field col-12">
                            <label class="font-bold capitalize" for="email">Email</label>
                            <InputText
                                id="email"
                                v-model="form.email"
                                placeholder="Email"
                                :class="{ 'p-invalid': errors?.email }"
                            />
                            <small class="text-sm p-error" v-if="errors?.email">
                                {{ errors?.email[0] }}
                            </small>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label class="font-bold capitalize" for="roles">Roles</label>
                            <MultiSelect
                                display="chip"
                                id="roles"
                                v-model="form.roles"
                                placeholder="Select roles"
                                :options="RoleStore.data"
                                optionLabel="name"
                                optionValue="id"
                                :class="{ 'p-invalid': errors?.roles }"
                            />
                            <small class="text-sm p-error" v-if="errors?.roles">
                                {{ errors?.roles[0] }}
                            </small>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label class="font-bold capitalize" for="permissions"
                                >permissions</label
                            >
                            <MultiSelect
                                display="chip"
                                id="permissions"
                                v-model="form.permissions"
                                placeholder="Select permissions"
                                :options="PermissionStore.data"
                                optionLabel="name"
                                optionValue="id"
                                :class="{ 'p-invalid': errors?.permissions }"
                            />
                            <small class="text-sm p-error" v-if="errors?.permissions">
                                {{ errors?.permissions[0] }}
                            </small>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Password">
                <div class="card">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label class="font-bold capitalize" for="password">password</label>
                            <Password
                                :toggle-mask="true"
                                :feedback="true"
                                v-model="form.password"
                                placeholder="New Password"
                            />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label class="font-bold capitalize" for="password_confirmation"
                                >password confirmation</label
                            >
                            <Password
                                :toggle-mask="true"
                                :feedback="false"
                                v-model="form.password_confirmation"
                                placeholder="Confirm New Password"
                            />
                        </div>
                    </div>
                </div>
            </TabPanel>

            <TabPanel header="Location">
                <div class="card">
                    <div class="grid">
                        <div
                            class="col-12 md:col-4"
                            v-for="location of LocationStore.allData"
                            :key="location.key"
                        >
                            <div class="field-checkbox mb-0">
                                <Checkbox
                                    v-model="form.locations"
                                    :inputId="location.key"
                                    name="location"
                                    :value="location.id"
                                />
                                <label :for="location.key" class="font-bold">{{
                                    location.name
                                }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Charts">
                <div class="card">
                    <div class="grid">
                        <div
                            class="col-12 md:col-4"
                            v-for="item of DashboardChart.allData"
                            :key="item.id"
                        >
                            <div class="field-checkbox mb-0">
                                <Checkbox
                                    v-model="form.dashboardCharts"
                                    :inputId="item.id"
                                    name="item"
                                    :value="item.id"
                                />
                                <label :for="item.id" class="font-bold">{{ item.name }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabView>

        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="hideDialog"
            />
            <Button
                :loading="loading"
                :label="form.id ? $t('button.update') : $t('button.save')"
                icon="pi pi-check"
                class="p-button-success"
                @click="saveData"
            />
        </template>
    </Dialog>

    <!-- restore single data dialog -->
    <Dialog
        v-model:visible="restoreDataDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="item" class="text-center">
            {{ $t('dialog.restore-text') }}
        </p>
        <p v-if="item" class="text-center">
            <b>{{ item.name }}</b>
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="restoreDataDialog = false"
            />
            <Button
                :label="$t('button.yes-restore')"
                icon="pi pi-check"
                class="p-button-success"
                @click="restoreData(item.id)"
                :loading="loading"
            />
        </template>
    </Dialog>

    <!-- delete single data dialog -->
    <Dialog
        v-model:visible="destroyDataDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="item" class="text-center">
            {{ $t('dialog.delete-text') }}
        </p>
        <p v-if="item" class="text-center">
            <b>{{ item.name }}</b>
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroyDataDialog = false"
            />
            <Button
                :label="$t('button.yes-delete')"
                icon="pi pi-check"
                class="p-button-danger"
                @click="destroyData(item.id)"
                :loading="loading"
            />
        </template>
    </Dialog>

    <!-- delete permanen single data dialog -->

    <Dialog
        v-model:visible="destroyPermanentDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="item" class="text-center">
            {{ $t('dialog.delete-permanent-text') }}
        </p>
        <p v-if="item" class="text-center">
            <b>{{ item.name }}</b>
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroyPermanentDialog = false"
            />
            <Button
                :label="$t('button.yes-destroy')"
                icon="pi pi-check"
                class="p-button-danger"
                @click="deleteData(item.id)"
                :loading="loading"
            />
        </template>
    </Dialog>

    <!-- delete selected data dialog -->

    <Dialog
        v-model:visible="destroySelectedDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="selectedData" class="text-center">
            {{ $t('dialog.delete-multiple-text', { count: selectedData.length }) }}
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroySelectedDialog = false"
            />
            <Button
                :label="$t('button.yes-delete')"
                icon="pi pi-check"
                class="p-button-danger"
                @click="destroyMultiple()"
                :loading="loading"
            />
        </template>
    </Dialog>

    <!-- restore selected data dialog -->

    <Dialog
        v-model:visible="restoreSelectedDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="selectedData" class="text-center">
            {{ $t('dialog.restore-multiple-text', { count: selectedData.length }) }}
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="restoreSelectedDialog = false"
            />
            <Button
                :label="$t('button.yes-restore')"
                icon="pi pi-check"
                class="p-button-warning"
                @click="restoreMultiple()"
                :loading="loading"
            />
        </template>
    </Dialog>

    <!-- delete permanent selected data dialog -->
    <Dialog
        v-model:visible="destroyPermanentSelectedDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="selectedData" class="text-center">
            Apakah yakin akan mengapus permanen <b>{{ selectedData.length }}</b> data yang dipilih ?
        </p>
        <h4 class="font-bold text-center">{{ $t('dialog.delete-permanent-alert-text') }}</h4>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroyPermanentSelectedDialog = false"
            />
            <Button
                :label="$t('button.yes-destroy')"
                icon="pi pi-check"
                class="p-button-danger"
                @click="deleteMultiple()"
                :loading="loading"
            />
        </template>
    </Dialog>
</template>

<style scoped lang="scss"></style>
