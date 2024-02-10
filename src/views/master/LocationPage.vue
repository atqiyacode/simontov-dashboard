<script setup>
import axios from 'axios';
import { GoogleMap, InfoWindow, Marker, MarkerCluster } from 'vue3-google-map';
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue';
import { useMainStore } from '@/services/main.store';
import { useGlobalStore } from '@/services/global.store';
import { storeToRefs } from 'pinia';
import { i18n } from '@/plugins/i18n';

import { useDashboardChart } from '@/services/master/DashboardChart.store';

const DashboardChart = useDashboardChart();

const { proxy } = getCurrentInstance();
const mainStore = useMainStore();
const GlobalStore = useGlobalStore();

const { loading, errors } = storeToRefs(mainStore);

const { dt, apiUrl, title, isDownloading, keyword } = storeToRefs(GlobalStore);

const {
    canShow,
    canCreate,
    canUpload,
    canEdit,
    canRestore,
    canDestroy,
    canDelete,
    canDestroyMultiple,
    canRestoreMultiple,
    canDeleteMultiple,
    canExport,
    canSearch,
    canMultiSelectData,
    canSelectField,
    actionColumn
} = storeToRefs(GlobalStore.permissions);

const { data, meta, rowsPerPage, sortField } = storeToRefs(GlobalStore.tableData);

const { form, item, selectedData, selectedFields } = storeToRefs(GlobalStore.formData);

const {
    formDialog,
    uploadDialog,
    detailDialog,
    destroyDataDialog,
    destroySelectedDialog,
    restoreDataDialog,
    restoreSelectedDialog,
    destroyPermanentDialog,
    destroyPermanentSelectedDialog,
    selectFieldDialog,
    exportDialog
} = storeToRefs(GlobalStore.dialogs);

const {
    onChangePage,
    onSortData,
    reloadData,

    getData,
    restoreData,
    destroyData,
    deleteData,
    destroyMultiple,
    restoreMultiple,
    deleteMultiple,

    resetDialog,

    newData,
    newUpload,
    submitData,
    showData,
    editData,
    confirmDestroyData,
    confirmRestoreData,
    confirmDeletePermanentData,
    confirmDeleteSelected,
    confirmRestoreSelected,
    confirmDeletePermanentSelectedDialog,
    confirmSelectField,
    confirmExportData,
    uploadFile
} = GlobalStore;

onMounted(async () => {
    sortField.value = 'id';
    title.value = i18n.t('page.locations');
    apiUrl.value = 'locations';
    form.value = {
        id: null,
        name: ''
    };

    await getData({
        per_page: meta?.value.per_page
    });
    DashboardChart.getAll();
});

onUnmounted(() => {
    GlobalStore.resetTable();
    GlobalStore.$reset();
});
const formDialogChart = ref(false);
const setChart = (item) => {
    formDialogChart.value = true;
    form.value = item;
};

const updateChart = async () => {
    await submitData();
    formDialogChart.value = false;
};

const channel = ref(0);
proxy.$pusher.channel('location-channel').listen('.location-event', () => {
    channel.value += 1;
});

// GOOGLE MAPS

const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;
const center = ref({ lat: -6.175327999999999, lng: 106.8271517 });
const location = ref('');

const onSelectMap = (event) => {
    form.value.lattitude = event.latLng.lat();
    form.value.longitude = event.latLng.lng();
    getStreetAddressFrom(form.value.lattitude, form.value.longitude);
};

const setCenterData = (data) => {
    center.value = { lat: data.lattitude, lng: data.longitude };
};

const getStreetAddressFrom = async (lat, long) => {
    try {
        var { data } = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
                lat +
                ',' +
                long +
                '&key=' +
                gmapApiKey
        );
        if (data.error_message) {
            location.value = '';
        } else {
            form.value.description = data.results[0].formatted_address;
            center.value = {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng
            };
            location.value = data.results[0].formatted_address;
        }
    } catch (error) {
        location.value = '';
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ToolbarTable
                    :canCreate="canCreate"
                    :canUpload="canUpload"
                    :canMultiSelectData="canMultiSelectData"
                    :canDestroyMultiple="canDestroyMultiple"
                    :canRestoreMultiple="canRestoreMultiple"
                    :canExport="canExport"
                    :canDeleteMultiple="canDeleteMultiple"
                    :canSelectField="canSelectField && selectedFields.length > 0"
                    :selectedData="selectedData"
                    :isDownloading="isDownloading"
                    @newData="newData"
                    @newUpload="newUpload"
                    @confirmDeleteSelected="confirmDeleteSelected"
                    @confirmRestoreSelected="confirmRestoreSelected"
                    @confirmSelectField="confirmSelectField"
                    @download="confirmExportData"
                    @confirmDeletePermanentSelectedDialog="confirmDeletePermanentSelectedDialog"
                />

                <DataTable
                    lazy
                    :loading="false"
                    ref="dt"
                    :value="data"
                    v-model:selection="selectedData"
                    dataKey="id"
                    responsiveLayout="scroll"
                    :resizableColumns="true"
                    scrollable
                    @page="onChangePage($event)"
                    @sort="onSortData"
                >
                    <template #empty>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-center md:align-items-center my-3"
                        >
                            <h5 class="m-0" :class="loading ? 'text-blue-600' : 'text-red-600'">
                                {{ loading ? 'Loading...' : 'Data Tidak Ditemukan' }}
                            </h5>
                        </div>
                    </template>
                    <template #header>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-2"
                        >
                            <h5 class="m-0 capitalize">{{ title }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left" v-if="canSearch">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" :placeholder="$t('table.search')" />
                            </span>
                        </div>
                    </template>

                    <Column
                        selectionMode="multiple"
                        headerStyle="width: 3rem"
                        v-if="canMultiSelectData"
                    ></Column>

                    <!-- start table content -->

                    <Column field="code" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.code') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.code }}
                            </span>
                        </template>
                    </Column>

                    <Column field="company_name" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.company-name') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.company_name }}
                            </span>
                        </template>
                    </Column>

                    <Column field="pic" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.pic') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.pic }}
                            </span>
                        </template>
                    </Column>

                    <Column field="id" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> charts </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.charts.length || '-' }}
                            </span>
                        </template>
                    </Column>

                    <!-- end table content -->

                    <Column
                        class="text-center"
                        headerStyle="min-width:10rem;"
                        :frozen="true"
                        align-frozen="right"
                        v-if="actionColumn"
                    >
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('table.action') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <Button
                                icon="pi pi-chart-bar"
                                class="p-button-rounded p-button-secondary mr-2"
                                outlined
                                @click="setChart(slotProps.data)"
                            />
                            <ColumnActionButton
                                :actionColumn="actionColumn"
                                :data="slotProps.data"
                                :canShow="canShow"
                                :canEdit="canEdit"
                                :canRestore="canRestore"
                                :canDestroy="canDestroy"
                                :canDelete="canDelete"
                                @confirmRestoreData="confirmRestoreData(slotProps.data)"
                                @confirmDeletePermanentData="
                                    confirmDeletePermanentData(slotProps.data)
                                "
                                @showData="showData(slotProps.data)"
                                @editData="editData(slotProps.data), setCenterData(slotProps.data)"
                                @confirmDestroyData="confirmDestroyData(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>

                <Paginator
                    :template="{
                        '640px': 'PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown',
                        '960px':
                            'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
                        '1300px':
                            'FirstPageLink PrevPageLink CurrentPageReport PageLink NextPageLink LastPageLink RowsPerPageDropdown',
                        default:
                            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
                    }"
                    :first="meta?.to - 1"
                    :rows="parseInt(meta?.per_page)"
                    :totalRecords="meta?.total"
                    :rowsPerPageOptions="rowsPerPage"
                    @page="onChangePage"
                >
                    <template #start>
                        <Button
                            type="button"
                            icon="pi pi-refresh"
                            text
                            v-tooltip.top="`Reload`"
                            @click="reloadData(), (channel = 0)"
                            :label="channel > 0 ? 'New update' : ''"
                        />
                    </template>
                    <template #end> </template>
                </Paginator>
            </div>
        </div>
    </div>

    <!-- form dialog -->
    <DialogFormInput
        :loading="loading"
        :show="formDialog"
        :header="form.id ? $t('dialog.edit-form') : $t('dialog.create-form')"
        :submitButton="form.id ? $t('button.update') : $t('button.save')"
        @submit="submitData"
        @close="resetDialog"
    >
        <template #content>
            <div class="card">
                <div class="p-fluid formgrid grid">
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="code"
                                type="text"
                                v-model="form.code"
                                :class="{ 'p-invalid': errors.code }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.code')" />
                        </span>
                        <InputError :message="errors.code" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="company_name"
                                type="text"
                                v-model="form.company_name"
                                :class="{ 'p-invalid': errors.company_name }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.company-name')" />
                        </span>
                        <InputError :message="errors.company_name" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="name"
                                type="text"
                                v-model="form.name"
                                :class="{ 'p-invalid': errors.name }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.name')" />
                        </span>
                        <InputError :message="errors.name" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="pic"
                                type="text"
                                v-model="form.pic"
                                :class="{ 'p-invalid': errors.pic }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.pic')" />
                        </span>
                        <InputError :message="errors.pic" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="npwp"
                                type="text"
                                v-model="form.npwp"
                                :class="{ 'p-invalid': errors.npwp }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.npwp')" />
                        </span>
                        <InputError :message="errors.npwp" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <Textarea
                                :auto-resize="true"
                                required
                                id="address"
                                type="text"
                                v-model="form.address"
                                :class="{ 'p-invalid': errors.address }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.address')" />
                        </span>
                        <InputError :message="errors.address" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="email"
                                type="text"
                                v-model="form.email"
                                :class="{ 'p-invalid': errors.email }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.email')" />
                        </span>
                        <InputError :message="errors.email" />
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <Textarea
                                required
                                id="description"
                                :auto-resize="true"
                                v-model="form.description"
                                :class="{ 'p-invalid': errors.description }"
                                @input="mainStore.removeError"
                            />
                            <InputLabel :value="$t('text.description')" />
                        </span>
                        <InputError :message="errors.description" />
                    </div>

                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="Lattitude"
                                type="text"
                                v-model="form.lattitude"
                                :class="{ 'p-invalid': errors.lattitude }"
                                @input="mainStore.removeError"
                                readonly
                            />
                            <InputLabel :value="$t('text.lattitude')" />
                        </span>
                    </div>
                    <div class="mb-5 field col-12">
                        <span class="p-float-label">
                            <InputText
                                required
                                id="Longitude"
                                type="text"
                                v-model="form.longitude"
                                :class="{ 'p-invalid': errors.longitude }"
                                @input="mainStore.removeError"
                                readonly
                            />
                            <InputLabel :value="$t('text.longitude')" />
                        </span>
                    </div>

                    <div class="mb-5 field col-12">
                        <GoogleMap
                            :api-key="gmapApiKey"
                            style="width: 100%; height: 300px"
                            :center="center"
                            @click="onSelectMap($event)"
                            :zoom="15"
                        >
                            <InfoWindow />
                        </GoogleMap>
                    </div>
                </div>
            </div>
        </template>
    </DialogFormInput>

    <!-- form dialog chart-->
    <DialogFormInput
        :loading="loading"
        :show="formDialogChart"
        header="Chart"
        :submitButton="form.id ? $t('button.update') : $t('button.save')"
        @submit="updateChart()"
        @close="formDialogChart = !formDialogChart"
    >
        <template #content>
            <div class="card">
                <div class="grid">
                    <div
                        class="col-12 md:col-4"
                        v-for="item of DashboardChart.allData"
                        :key="item.id"
                    >
                        <div class="field-checkbox mb-0">
                            <Checkbox
                                v-model="form.charts"
                                :inputId="item.code"
                                name="item"
                                :value="item.id"
                            />
                            <label :for="item.code" class="font-bold">{{ item.name }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DialogFormInput>

    <!-- detail dialog -->
    <DialogDetail :show="detailDialog" @close="resetDialog()">
        <template #content>
            <ul class="list-none p-0">
                <ListDetailBreak :label="$t('text.code')" :value="item.code" />
                <ListDetailBreak label="Tenant Name" :value="item.company_name" />
                <ListDetailBreak label="Tenant Email" :value="item.email" />
                <ListDetailBreak label="Tenant PIC" :value="item.pic" />
                <ListDetailBreak label="Tenant NPWP" :value="item.npwp" />
                <ListDetailBreak label="Tenant Address" :value="item.address" />
                <ListDetailBreak label="Description" :value="item.description" />
                <ListDetailBreak label="longitude" :value="item.longitude" />
                <ListDetailBreak label="lattitude" :value="item.lattitude" />
            </ul>
            <div class="card">
                <GoogleMap
                    :api-key="gmapApiKey"
                    style="width: 100%; height: 300px"
                    :center="{ lat: item.lattitude, lng: item.longitude }"
                    :zoom="13"
                >
                    <MarkerCluster>
                        <Marker
                            :options="{
                                position: {
                                    lat: item.lattitude,
                                    lng: item.longitude
                                }
                            }"
                        >
                        </Marker>
                    </MarkerCluster>
                </GoogleMap>
            </div>
        </template>
    </DialogDetail>

    <!-- restore single data dialog -->
    <DialogRestore
        :show="restoreDataDialog"
        :label="item?.name"
        :loading="loading"
        @submit="restoreData(item.id)"
        @close="resetDialog()"
    />

    <!-- delete single data dialog -->
    <DialogDestroy
        :show="destroyDataDialog"
        :label="item?.name"
        :loading="loading"
        @submit="destroyData(item.id)"
        @close="resetDialog()"
    />

    <!-- delete permanen single data dialog -->
    <DialogDelete
        :show="destroyPermanentDialog"
        :label="item?.name"
        :loading="loading"
        @submit="deleteData(item.id)"
        @close="resetDialog()"
    />

    <!-- delete selected data dialog -->
    <DialogDestroySelected
        :show="destroySelectedDialog"
        :data="selectedData"
        :loading="loading"
        @submit="destroyMultiple()"
        @close="resetDialog()"
    />

    <!-- restore selected data dialog -->
    <DialogRestoreSelected
        :show="restoreSelectedDialog"
        :data="selectedData"
        :loading="loading"
        @submit="restoreMultiple()"
        @close="resetDialog()"
    />

    <!-- delete permanent selected data dialog -->
    <DialogDeleteSelected
        :show="destroyPermanentSelectedDialog"
        :data="selectedData"
        :loading="loading"
        @submit="deleteMultiple()"
        @close="resetDialog()"
    />

    <DialogSelectField
        :show="selectFieldDialog"
        :selectedFields="selectedFields"
        :loading="loading"
        @close="resetDialog()"
    />

    <DialogUpload
        :show="uploadDialog"
        :loading="loading"
        @submit="uploadFile()"
        @close="resetDialog()"
    />

    <DialogExport
        :header="title"
        :show="exportDialog"
        :loading="isDownloading"
        @close="resetDialog()"
    />
</template>

<style scoped lang="scss"></style>
