<script setup>
import { format, lastDayOfMonth } from 'date-fns';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useMainStore } from '@/services/main.store';
import { useGlobalStore } from '@/services/global.store';
import { storeToRefs } from 'pinia';
import { i18n } from '@/plugins/i18n';

const mainStore = useMainStore();
const GlobalStore = useGlobalStore();

const { loading, errors, error } = storeToRefs(mainStore);

const { dt, apiUrl, title, isDownloading } = storeToRefs(GlobalStore);

const {
    canShow,
    canCreate,
    canEdit,
    canRestore,
    canDestroy,
    canDelete,
    canDestroyMultiple,
    canRestoreMultiple,
    canDeleteMultiple,
    actionColumn
} = storeToRefs(GlobalStore.permissions);

const { allData, sortField } = storeToRefs(GlobalStore.tableData);

const { form, item } = storeToRefs(GlobalStore.formData);

const { formDialog, detailDialog, exportDialog } = storeToRefs(GlobalStore.dialogs);

const {
    getAll,

    resetDialog,

    submitData,
    showData,
    editData,
    confirmDestroyData,
    confirmRestoreData,
    confirmDeletePermanentData,
    confirmExportData,
    exportData
} = GlobalStore;

onMounted(() => {
    actionColumn.value = false;
    canCreate.value = false;
    canEdit.value = false;

    canDestroy.value = false;
    canDestroyMultiple.value = false;

    canRestore.value = false;
    canRestoreMultiple.value = false;

    canDelete.value = false;
    canDeleteMultiple.value = false;

    sortField.value = '-id';
    title.value = i18n.t('page.flow-meter');
    apiUrl.value = `flowrates/${mainStore.currentMap.id}/filterDate`;
});

onUnmounted(() => {
    GlobalStore.resetTable();
    GlobalStore.$reset();
});

const filterDate = ref(null);
const monthDate = ref(null);

const startDate = ref(null);
const endDate = ref(null);

const startMonth = ref(null);
const endMonth = ref(null);

const disbaledButton = ref(true);

const intervals = ref(['Hour', 'Day', 'Month']);
const interval = ref('day');

watch(filterDate, (value) => {
    if (value[1]) {
        [startDate.value, endDate.value] = value.map(formatDate);
    }
    disbaledButton.value = !(endMonth.value || endDate.value);
});

watch(monthDate, (value) => {
    if (value[1]) {
        startMonth.value = formatDate(value[0]);
        endMonth.value = formatMonth(value[1]);
    }
    disbaledButton.value = !(endMonth.value || endDate.value);
});

watch(interval, () => {
    disbaledButton.value = !(endMonth.value || endDate.value);
});

const formatMonth = (date) => {
    const inputMonth = new Date(date);
    const lastDay = lastDayOfMonth(inputMonth);
    const formattedMonth = format(lastDay, 'yyyy-MM-dd');
    return formattedMonth;
};

const formatDate = (date) => {
    const inputDate = new Date(date);
    const formattedDate = format(inputDate, 'yyyy-MM-dd');
    return formattedDate;
};

const createParams = (extraParams = {}) => ({
    start: startDate.value,
    end: endDate.value,
    month_start: startMonth.value,
    month_end: endMonth.value,
    interval: interval.value.toLowerCase(),
    ...extraParams
});

const filterData = () => {
    const params = createParams();
    getAll(params);
};

const optionValue = ref(null);

const onSubmitExport = () => {
    exportData(optionValue.value, {
        start: startDate.value,
        end: endDate.value,
        month_start: startMonth.value,
        month_end: endMonth.value,
        interval: interval.value.toLowerCase()
    });
};
</script>

<template>
    <ul class="list-none p-0 m-0">
        <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
        >
            <div>
                <h5 class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                    {{ mainStore.currentMap?.name }} - {{ mainStore.currentMap?.company_name }}
                </h5>
            </div>
        </li>
    </ul>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <div class="formgroup-inline">
                                <Dropdown
                                    :options="intervals"
                                    v-model="interval"
                                    :placeholder="$t('text.interval')"
                                    class="w-full md:w-14rem"
                                    :disabled="loading"
                                >
                                    <template #option="slotProps">
                                        <span class="capitalize">
                                            {{ slotProps.option }}
                                        </span>
                                    </template>
                                </Dropdown>
                                <Calendar
                                    class="w-full md:w-14rem ml-2"
                                    view="month"
                                    dateFormat="mm/yy"
                                    v-model="monthDate"
                                    placeholder="Filter Month"
                                    showIcon
                                    iconDisplay="input"
                                    selectionMode="range"
                                    :disabled="loading"
                                    :maxDate="new Date()"
                                    v-if="interval === 'Month'"
                                />
                                <Calendar
                                    v-else
                                    class="w-full md:w-14rem ml-2"
                                    dateFormat="dd/mm/yy"
                                    v-model="filterDate"
                                    placeholder="Filter Date"
                                    showIcon
                                    iconDisplay="input"
                                    selectionMode="range"
                                    :manualInput="true"
                                    :disabled="loading"
                                    :maxDate="new Date()"
                                />
                                <Button
                                    :disabled="disbaledButton"
                                    class="ml-2"
                                    :loading="loading"
                                    :label="$t('button.filter')"
                                    icon="pi pi-search"
                                    @click="filterData()"
                                />
                            </div>
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button
                            :loading="isDownloading"
                            v-tooltip.top="$t('button.download')"
                            icon="pi pi-download"
                            class="p-button-sm mr-1"
                            severity="success"
                            rounded
                            label="Download"
                            @click="confirmExportData()"
                            v-if="allData.length > 0"
                        />
                    </template>
                </Toolbar>

                <DataTable
                    v-if="allData.length > 0"
                    lazy
                    :loading="false"
                    ref="dt"
                    :value="allData"
                    dataKey="id"
                    responsiveLayout="scroll"
                    :resizableColumns="true"
                    scrollable
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
                        </div>
                    </template>

                    <!-- start table content -->

                    <Column field="mag_date" :sortable="false" headerStyle="min-width:20rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> mag date </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.mag_date }}
                            </span>
                        </template>
                    </Column>
                    <Column field="ph" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> PH </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.ph }}
                            </span>
                        </template>
                    </Column>
                    <Column field="cod" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> COD </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.cod }}
                            </span>
                        </template>
                    </Column>
                    <Column field="flowrate" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> flowrate </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.flowrate }}
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer_1" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer 1 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.totalizer_1 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer_2" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer 2 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.totalizer_2 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer_3" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer 3 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.totalizer_3 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="analog_1" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> analog 1 </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.analog_1 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="pressure" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Pressure </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.pressure }}
                            </span>
                        </template>
                    </Column>
                    <Column field="status_battery" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Status Battery </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.status_battery }}
                            </span>
                        </template>
                    </Column>

                    <Column field="bin_alarm" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Bin Alarm </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.bin_alarm }}
                            </span>
                        </template>
                    </Column>
                    <Column field="file_name" :sortable="false" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> File Name </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ slotProps.data.file_name }}
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
                                @editData="editData(slotProps.data)"
                                @confirmDestroyData="confirmDestroyData(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>
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
            <div class="field">
                <label class="font-bold capitalize" for="label">label</label>
                <InputText
                    id="label"
                    v-model.trim="form.label"
                    required="true"
                    :class="{ 'p-invalid': errors?.label }"
                />
                <small class="text-sm p-error" v-if="errors?.label">{{ errors?.label[0] }}</small>
            </div>

            <div class="field">
                <label class="font-bold capitalize" for="lower_limit">
                    Lower Limit <small class="lowercase">(m<sup>3</sup>)</small>
                </label>
                <InputNumber
                    id="lower_limit"
                    v-model.trim="form.lower_limit"
                    required="true"
                    :class="{ 'p-invalid': errors?.lower_limit }"
                    :minFractionDigits="0"
                    inputId="locale-id"
                    locale="id-ID"
                />

                <small class="text-sm p-error" v-if="errors?.lower_limit">{{
                    errors?.lower_limit[0]
                }}</small>
            </div>
            <div class="field">
                <label class="font-bold capitalize" for="upper_limit">
                    Upper Limit <small class="lowercase">(m<sup>3</sup>)</small>
                </label>
                <InputNumber
                    id="upper_limit"
                    v-model.trim="form.upper_limit"
                    required="true"
                    :class="{ 'p-invalid': errors?.upper_limit }"
                    :minFractionDigits="0"
                    inputId="locale-id"
                    locale="id-ID"
                />
                <small class="text-sm p-error" v-if="errors?.upper_limit">{{
                    errors?.upper_limit[0]
                }}</small>
            </div>
            <div class="field">
                <label class="font-bold capitalize" for="description">description</label>
                <Textarea
                    required
                    id="description"
                    v-model="form.description"
                    :class="{ 'p-invalid': errors.description }"
                    placeholder="description"
                    :rows="5"
                />
                <small class="text-sm p-error" v-if="errors?.description">{{
                    errors?.description[0]
                }}</small>
            </div>
        </template>
    </DialogFormInput>

    <!-- detail dialog -->
    <DialogDetail :show="detailDialog" @close="resetDialog()">
        <template #content>
            <ul class="list-none p-0 m-0">
                <ListDetail label="Lokasi" :value="item.location.name" />
                <ListDetail label="mag date" :value="item.mag_date" />
                <ListDetail label="flowrate" :value="item.flowrate" />
                <ListDetail label="totalizer 1" :value="item.totalizer_1" />
                <ListDetail label="totalizer 2" :value="item.totalizer_2" />
                <ListDetail label="totalizer 3" :value="item.totalizer_3" />
                <ListDetail label="analog 1" :value="item.analog_1" />
                <ListDetail label="pressure" :value="item.pressure" />
                <ListDetail label="status battery" :value="item.status_battery" />
                <ListDetail label="bin alarm" :value="item.bin_alarm" />
                <ListDetail label="file" :value="item.file_name" />
                <ListDetail label="PH" :value="item.ph" />
                <ListDetail label="COD" :value="item.cod" />
                <ListDetail label="Cond" :value="item.cond" />
                <ListDetail label="Level" :value="item.level" />
            </ul>
        </template>
    </DialogDetail>

    <DialogExport
        :header="title"
        :show="exportDialog"
        :loading="isDownloading"
        @close="resetDialog()"
    />

    <Dialog
        :visible="exportDialog"
        :style="{ width: '450px' }"
        :header="$t('header.export')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div v-for="option in ['csv', 'json', 'xls', 'xlsx']" :key="option" style="cursor: pointer">
            <div class="card flex align-items-center mb-3" @click="optionValue = option">
                <RadioButton v-model="optionValue" :inputId="option" :value="option" />
                <label :for="option" class="ml-2">
                    <b class="uppercase">{{ option }}</b>
                    <p v-if="error && option === optionValue" class="text-red-500">
                        {{ error }}
                    </p>
                </label>
            </div>
        </div>

        <template #footer>
            <Button
                :disabled="isDownloading"
                :label="$t('button.close')"
                icon="pi pi-times"
                text
                @click="resetDialog()"
            />
            <Button
                :disabled="isDownloading || optionValue == null"
                :loading="isDownloading"
                :label="$t('button.export')"
                icon="pi pi-download"
                severity="success"
                @click="onSubmitExport()"
            />
        </template>
    </Dialog>
</template>

<style scoped lang="scss"></style>
