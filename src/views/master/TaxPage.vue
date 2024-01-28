<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted, getCurrentInstance } from 'vue';

import { useMainStore } from '@/services/main.store';
import { useTaxStore } from '@/services/master/Tax.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const TaxStore = useTaxStore();
const { title, data, meta, selectedData, form, formDialog } = storeToRefs(TaxStore);
const { loading, errors } = storeToRefs(mainStore);
const { onChangePage, onSortData, getData, createData, updateData } = TaxStore;

const dt = ref(null);

const { proxy } = getCurrentInstance();
proxy.$pusher.subscribe('tax-channel').bind('.tax-event', () => {
    //
});

onBeforeMount(() => {
    getData({
        per_page: meta.value.per_page
    });
});
onMounted(() => {
    //
});

onUnmounted(() => {
    // TaxStore.$reset();
});

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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
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
                        </div>
                    </template>

                    <Column class="text-center" field="value" headerStyle="min-width:15rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Biaya Pajak </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                                {{ formatCurrency(slotProps.data.value) }}
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
                                v-if="!slotProps.data.trashed"
                                v-tooltip.top="$t('button.edit-data')"
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-sm p-button-success mr-2"
                                @click="editData(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <!-- form dialog -->
    <Dialog
        v-model:visible="formDialog"
        :style="{ width: '450px' }"
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
        <div class="field">
            <label class="font-bold" for="value"> Biaya Pajak </label>
            <InputNumber
                mode="currency"
                currency="IDR"
                locale="id-ID"
                inputId="currency-id"
                required
                id="value"
                type="text"
                v-model="form.value"
                :class="{ 'p-invalid': errors.value }"
                placeholder="Biaya Pajak"
            />
            <small class="text-sm p-error" v-if="errors?.value">{{ errors?.value[0] }}</small>
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
</template>

<style scoped lang="scss"></style>
