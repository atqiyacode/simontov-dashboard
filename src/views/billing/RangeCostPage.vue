<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted, getCurrentInstance } from 'vue';

import { useMainStore } from '@/services/main.store';
import { useRangeCostStore } from '@/services/billing/RangeCost.store';
import { useRangeTypeStore } from '@/services/billing/RangeType.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const RangeCostStore = useRangeCostStore();
const RangeTypeStore = useRangeTypeStore();
const { proxy } = getCurrentInstance();
proxy.$pusher.channel('range-cost-channel').listen('.range-cost-event', () => {
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
} = storeToRefs(RangeCostStore);
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
} = RangeCostStore;

const dt = ref(null);

onBeforeMount(() => {
    getData({
        per_page: meta.value.per_page
    });
});
onMounted(() => {
    RangeTypeStore.getData();
});

onUnmounted(() => {
    // RangeCostStore.$reset();
});

const searchType = (event) => {
    RangeTypeStore.keyword = event.value;
};

const openNew = () => {
    selectedData.value = [];
    form.value = {
        value: 0
    };
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
                                v-tooltip.top="`Tambah`"
                                icon="pi pi-plus"
                                class="p-button-rounded p-button-sm p-button-success mr-2"
                                @click="openNew"
                            />
                            <Button
                                v-tooltip.top="`Hapus`"
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-sm p-button-warning mr-2"
                                @click="confirmDeleteSelected"
                                :disabled="!selectedData || !selectedData.length"
                            />
                            <Button
                                v-tooltip.top="`Restore`"
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
                            label="Hapus Permanen"
                            v-tooltip.top="`Hapus Permanen`"
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
                            <h5 class="m-0 text-red-600">Data Tidak Ditemukan</h5>
                        </div>
                    </template>
                    <template #header>
                        <div
                            class="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-2"
                        >
                            <h5 class="m-0 capitalize">{{ title }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" placeholder="Cari..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="range_type.name" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Jenis Pemakaian </span>
                        </template>
                        <template #body="slotProps">
                            <span
                                v-if="slotProps.data.range_type"
                                :class="{
                                    'text-red-500': slotProps.data.trashed
                                }"
                            >
                                {{ slotProps.data.range_type?.label }}
                                <small>
                                    ({{ slotProps.data.range_type?.lower_limit }} m<sup>3</sup> -
                                    {{ slotProps.data.range_type?.upper_limit }} m<sup>3</sup>)
                                </small>
                            </span>
                            <span v-else class="text-red-500"> Data Not Match </span>
                        </template>
                    </Column>

                    <Column field="value" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Harga </span>
                        </template>
                        <template #body="slotProps">
                            <span
                                :class="{
                                    'text-red-500':
                                        slotProps.data.trashed || !slotProps.data.range_type
                                }"
                            >
                                {{ formatCurrency(slotProps.data.value) }}
                            </span>
                        </template>
                    </Column>

                    <Column
                        class="text-center"
                        headerStyle="min-width:15rem;"
                        alignFrozen="right"
                        :frozen="true"
                    >
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Aksi </span>
                        </template>
                        <template #body="slotProps">
                            <Button
                                v-if="slotProps.data.trashed"
                                v-tooltip.top="`Restore`"
                                icon="pi pi-refresh"
                                class="p-button-rounded p-button-sm p-button-secondary mr-2"
                                @click="confirmRestoreData(slotProps.data)"
                            />
                            <Button
                                v-if="slotProps.data.trashed"
                                v-tooltip.top="`Hapus`"
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-sm p-button-danger mr-2"
                                @click="confirmDeletePermanentData(slotProps.data)"
                            />
                            <Button
                                v-if="!slotProps.data.trashed"
                                v-tooltip.top="`Ubah`"
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-sm p-button-success mr-2"
                                @click="editData(slotProps.data)"
                            />
                            <Button
                                v-if="!slotProps.data.trashed"
                                v-tooltip.top="`Hapus`"
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
        :style="{ width: '450px' }"
        :header="form.id ? 'Ubah Data' : 'Tambah Data'"
        :modal="true"
        :closable="false"
        class="p-fluid"
    >
        <div class="field">
            <label class="font-bold" for="range_type_id"> Jenis Pemakaian </label>
            <Dropdown
                :options="RangeTypeStore.data"
                v-model="form.range_type_id"
                :class="{ 'p-invalid': errors.range_type_id }"
                optionValue="id"
                optionLabel="label"
                placeholder="Jenis Pemakaian"
                :filter="true"
                @filter="searchType($event)"
            >
                <template #option="slotProps">
                    <span class="font-bold">
                        {{ slotProps.option.label }}
                    </span>
                    (
                    {{ numberFormat(slotProps.option.lower_limit) }}
                    m<sup>3</sup>
                    -
                    {{ numberFormat(slotProps.option.lower_limit) }}
                    m<sup>3</sup>
                    )
                </template>
            </Dropdown>
            <small class="text-sm p-error" v-if="errors?.range_type_id">{{
                errors?.range_type_id[0]
            }}</small>
        </div>
        <div class="field">
            <label class="font-bold capitalize" for="value">Nilai</label>
            <InputNumber
                id="value"
                v-model.trim="form.value"
                required="true"
                :class="{ 'p-invalid': errors?.value }"
                :minFractionDigits="0"
                mode="currency"
                currency="IDR"
                inputId="locale-id"
                locale="id-ID"
            />
            <small class="text-sm p-error" v-if="errors?.value">{{ errors?.value[0] }}</small>
        </div>
        <template #footer>
            <Button
                :disabled="loading"
                label="Batal"
                icon="pi pi-times"
                class="p-button-text"
                @click="hideDialog"
            />
            <Button
                :loading="loading"
                :label="form.id ? 'Update' : 'Simpan'"
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
        header="Konfirmasi Pemulihan"
        :modal="true"
        :closable="false"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="item" class="text-center">Apakah yakin akan memulihkan data ?</p>
        <p v-if="item" class="text-center">
            <b>{{ item.name }}</b>
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                label="Tidak"
                icon="pi pi-times"
                class="p-button-text"
                @click="restoreDataDialog = false"
            />
            <Button
                label="Ya, Pulihkan"
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
        header="Konfirmasi Penghapusan"
        :modal="true"
        :closable="false"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="item" class="text-center">Apakah yakin akan menghapus data ?</p>
        <p v-if="item" class="text-center">
            <b>{{ item.name }}</b>
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                label="Tidak"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroyDataDialog = false"
            />
            <Button
                label="Ya, Hapus"
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
        header="Konfirmasi Penghapusan Permanen"
        :modal="true"
        :closable="false"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="item" class="text-center">Apakah yakin akan menghapus permanen data ?</p>
        <p v-if="item" class="text-center">
            <b>{{ item.name }}</b>
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                label="Batal"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroyPermanentDialog = false"
            />
            <Button
                label="Ya, Hapus Permanen"
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
        header="Konfirmasi Penghapusan"
        :modal="true"
        :closable="false"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="selectedData" class="text-center">
            Apakah yakin akan menghapus <b>{{ selectedData.length }}</b> data yang dipilih ?
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                label="Batal"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroySelectedDialog = false"
            />
            <Button
                label="Ya, Hapus"
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
        header="Konfirmasi Pemulihan"
        :modal="true"
        :closable="false"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="selectedData" class="text-center">
            Apakah yakin akan memulihkan <b>{{ selectedData.length }}</b> data yang dipilih ?
        </p>
        <template #footer>
            <Button
                :disabled="loading"
                label="Batal"
                icon="pi pi-times"
                class="p-button-text"
                @click="restoreSelectedDialog = false"
            />
            <Button
                label="Ya, Pulihkan"
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
        header="Konfirmasi Penghapusan Masal"
        :modal="true"
        :closable="false"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle text-center mb-3" style="font-size: 3rem" />
        </div>
        <p v-if="selectedData" class="text-center">
            Apakah yakin akan mengapus permanen <b>{{ selectedData.length }}</b> data yang dipilih ?
        </p>
        <h4 class="font-bold text-center">Data Tidak dapat dipulihkan lagi.</h4>
        <template #footer>
            <Button
                :disabled="loading"
                label="Batal"
                icon="pi pi-times"
                class="p-button-text"
                @click="destroyPermanentSelectedDialog = false"
            />
            <Button
                label="Ya, Hapus Permanen"
                icon="pi pi-check"
                class="p-button-danger"
                @click="deleteMultiple()"
                :loading="loading"
            />
        </template>
    </Dialog>
</template>

<style scoped lang="scss"></style>
