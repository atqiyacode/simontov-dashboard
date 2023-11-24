<script setup>
import axios from 'axios';
import { ref, onMounted, onBeforeMount, onUnmounted, getCurrentInstance } from 'vue';
import { GoogleMap, InfoWindow } from 'vue3-google-map';

import { useMainStore } from '@/services/main.store';
import { useLocationStore } from '@/services/master/Location.store';
import { storeToRefs } from 'pinia';

const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;
const mainStore = useMainStore();
const LocationStore = useLocationStore();
const { proxy } = getCurrentInstance();
proxy.$pusher.channel('location-channel').listen('.location-event', () => {
    //
});
const {
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
} = storeToRefs(LocationStore);
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
} = LocationStore;

const dt = ref(null);
const location = ref('');
const center = ref({ lat: -6.175327999999999, lng: 106.8271517 });

onBeforeMount(() => {
    getData({
        per_page: meta.value.per_page
    });
});
onMounted(() => {
    //
});

onUnmounted(() => {
    // LocationStore.$reset();
});

const openNew = () => {
    center.value = { lat: -6.175327999999999, lng: 106.8271517 };
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
    center.value = { lat: data.lattitude, lng: data.longitude };
    form.value = { ...data };
    formDialog.value = true;
    selectedData.value = [];
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

const onSelectMap = (event) => {
    form.value.lattitude = event.latLng.lat();
    form.value.longitude = event.latLng.lng();
    getStreetAddressFrom(form.value.lattitude, form.value.longitude);
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
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" :placeholder="$t('table.search')" />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

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

                    <Column field="name" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold">
                                {{ $t('text.name') }}
                            </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.name }}
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
                                class="p-button-rounded p-button-sm p-button-info mr-2"
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
        maximizable
    >
        <div class="card">
            <div class="p-fluid formgrid grid">
                <div class="mb-4 field col-12">
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
                <div class="mb-4 field col-12">
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
                <div class="mb-4 field col-12">
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
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Textarea
                            required
                            id="description"
                            :rows="5"
                            v-model="form.description"
                            :class="{ 'p-invalid': errors.description }"
                            @input="mainStore.removeError"
                        />
                        <InputLabel :value="$t('text.description')" />
                    </span>
                    <InputError :message="errors.description" />
                </div>

                <div class="mb-4 field col-12">
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
                <div class="mb-4 field col-12">
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
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Textarea
                            required
                            id="location"
                            :auto-resize="true"
                            v-model="location"
                            :class="{ 'p-invalid': errors.lattitude || errors.longitude }"
                            @input="mainStore.removeError"
                            readonly
                        />
                        <InputLabel :value="$t('text.location')" />
                    </span>
                </div>
                <div class="mb-4 field col-12">
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
