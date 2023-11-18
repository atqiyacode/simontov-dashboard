<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted, getCurrentInstance } from 'vue';

import { useMainStore } from '@/services/main.store';
import { useFlowrateStore } from '@/services/features/Flowrate.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const FlowrateStore = useFlowrateStore();
const { proxy } = getCurrentInstance();

const { title, data, meta, keyword, selectedData, rowsPerPage } = storeToRefs(FlowrateStore);
const { loading, currentMap } = storeToRefs(mainStore);
const { onChangePage, onSortData, getData, exportCSV, exportExcel } = FlowrateStore;

const dt = ref(null);
const detailDialog = ref(false);
const selected = ref({});
const newDataCount = ref(0);
proxy.$pusher.channel('flowrate-channel-' + currentMap.value.id).listen('.flowrate-event', () => {
    newDataCount.value++;
});
onBeforeMount(() => {
    //
});
onMounted(() => {
    getData({
        per_page: meta.value.per_page
    });
});

onUnmounted(() => {
    // FlowrateStore.$reset();
});

const loadNewData = () => {
    newDataCount.value = 0;
    getData({
        per_page: meta.value.per_page
    });
};

const showDetail = (data) => {
    selected.value = { ...data };
    detailDialog.value = true;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <Button
                            type="button"
                            icon="pi pi-refresh"
                            text
                            :label="`${newDataCount} Data Baru`"
                            @click="loadNewData"
                        />
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
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :row-hover="true"
                    :loading="loading"
                    :value="data"
                    v-model:selection="selectedData"
                    dataKey="id"
                    responsiveLayout="scroll"
                    @page="onChangePage($event)"
                    @sort="onSortData"
                    scrollable
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
                            <h5 class="m-0 capitalize">{{ title }} - {{ currentMap.name }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" placeholder="Cari..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="mag_date" :sortable="true" headerStyle="min-width:20rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> mag date </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.mag_date }}
                            </span>
                        </template>
                    </Column>
                    <Column field="ph" :sortable="true" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> PH </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.ph }}
                            </span>
                        </template>
                    </Column>
                    <Column field="cod" :sortable="true" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> COD </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.cod }}
                            </span>
                        </template>
                    </Column>
                    <Column field="flowrate" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> flowrate </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.flowrate }}
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer_1" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer 1 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.totalizer_1 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer_2" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer 2 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.totalizer_2 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer_3" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer 3 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.totalizer_3 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="analog_1" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> analog 1 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.analog_1 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="pressure" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Pressure </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.pressure }}
                            </span>
                        </template>
                    </Column>
                    <Column field="status_battery" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Status Battery </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.status_battery }}
                            </span>
                        </template>
                    </Column>

                    <Column field="bin_alarm" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Bin Alarm </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.bin_alarm }}
                            </span>
                        </template>
                    </Column>
                    <Column field="file_name" :sortable="true" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> File Name </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.file_name }}
                            </span>
                        </template>
                    </Column>
                    <Column
                        class="text-center"
                        headerStyle="min-width:15rem;"
                        :frozen="true"
                        align-frozen="right"
                    >
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Aksi </span>
                        </template>
                        <template #body="slotProps">
                            <Button
                                v-if="!slotProps.data.trashed"
                                v-tooltip.top="`Detail`"
                                icon="pi pi-search"
                                class="p-button-rounded p-button-sm p-button-info mt-2"
                                @click="showDetail(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>

                <Paginator
                    class="mt-3"
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
                >
                </Paginator>
            </div>
        </div>
    </div>
    <Dialog
        v-model:visible="detailDialog"
        :style="{ width: '50vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        header="Detail"
        :modal="true"
        :closable="false"
    >
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetail label="Lokasi" :value="selected.location.name" />
                <ListDetail label="mag date" :value="selected.mag_date" />
                <ListDetail label="flowrate" :value="selected.flowrate" />
                <ListDetail label="totalizer 1" :value="selected.totalizer_1" />
                <ListDetail label="totalizer 2" :value="selected.totalizer_2" />
                <ListDetail label="totalizer 3" :value="selected.totalizer_3" />
                <ListDetail label="analog 1" :value="selected.analog_1" />
                <ListDetail label="pressure" :value="selected.pressure" />
                <ListDetail label="status battery" :value="selected.status_battery" />
                <ListDetail label="bin alarm" :value="selected.bin_alarm" />
                <ListDetail label="file" :value="selected.file_name" />
                <ListDetail label="PH" :value="selected.ph" />
                <ListDetail label="COD" :value="selected.cod" />
                <ListDetail label="Cond" :value="selected.cond" />
                <ListDetail label="Level" :value="selected.level" />
            </ul>
        </div>

        <template #footer>
            <Button
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-rounded p-button-text"
                @click="detailDialog = false"
            />
        </template>
    </Dialog>
</template>

<style scoped lang="scss"></style>
