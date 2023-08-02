<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
import { useOptionStore } from '@/services/option.store';
const { proxy } = getCurrentInstance();

const store = useCrudStore();
const optionStore = useOptionStore();

const { hideDialog, getData, filterSearch, onChangePage, processData, destroyData, onCreate, showEditDialog, showDetail, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

const { loadRangeTypes } = optionStore;
const { rangeTypes } = storeToRefs(optionStore);

// mounted
onMounted(() => {
    title.value = 'Range Cost';
    api.value = '/feature/rangeCost';
    tableBody.value = [
        { label: 'Type', value: 'type', type: 'object', object: 'label' },
        { label: 'Range Lower', value: 'type', type: 'object-volume', object: 'lower_limit' },
        { label: 'Range Upper', value: 'type', type: 'object-volume', object: 'upper_limit' },
        { label: 'value', value: 'value', type: 'currency' }
    ];
    getData();
    loadRangeTypes();
});

// onUnMounted
onUnmounted(() => {
    store.$reset();
});

const onEdit = (val) => {
    showEditDialog();
    store.$patch({
        form: {
            id: val.id,
            value: val.value,
            type: val.type.id
        }
    });
};

proxy.$pusher.channel('range-cost-channel').listen('.range-cost-event', () => {
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
        :canRestore="true"
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
    <Dialog v-model:visible="formDialog" :style="{ width: '640px' }" :header="formLabel" :modal="true" :closable="false" class="p-fluid">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <Dropdown :options="rangeTypes" v-model="form.type" :class="{ 'p-invalid': errors.type }" placeholder="type" optionValue="id" optionLabel="label">
                            <template #option="slotProps">
                                <span class="font-bold">
                                    {{ slotProps.option.label }}
                                </span>
                                (
                                {{ formatNumber(slotProps.option.lower_limit) }}
                                m<sup>3</sup>
                                -
                                {{ formatNumber(slotProps.option.lower_limit) }}
                                m<sup>3</sup>
                                )
                            </template>
                        </Dropdown>
                        <InputLabel value="type" />
                    </span>
                    <InputError :message="errors.type" />
                </div>
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputNumber mode="currency" currency="IDR" locale="id-ID" inputId="currency-id" required id="value" type="text" v-model="form.value" :class="{ 'p-invalid': errors.value }" placeholder="value" />
                        <InputLabel value="value" />
                    </span>
                    <InputError :message="errors.value" />
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
    <Dialog v-model:visible="detailDialog" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }" header="Detail" :modal="true" :closable="false">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="range label" :value="selected.type.label" />
                <ListDetailBreakVolume label="range lower" :value="formatNumber(selected.type.lower_limit)" />
                <ListDetailBreakVolume label="range upper" :value="formatNumber(selected.type.upper_limit)" />
                <ListDetailBreak label="value" :value="formatCurrency(selected.value)" />
            </ul>
        </div>

        <template #footer>
            <Button :label="$t('button.close')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
            <Button :label="$t('button.edit-data')" icon="pi pi-pencil" class="p-button-rounded p-button-warning" @click="onEdit(selected)" />
            <Button :label="$t('button.delete-data')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(selected)" />
        </template>
    </Dialog>
    <!-- end dialog detail -->
    <!-- delete dialog -->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <DeleteDialog :data="`${selected.type.name} - ${formatCurrency(selected.value)}`" />
        <template #footer>
            <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-text" @click="hideDialog()" />
            <Button :loading="loading" :label="$t('button.yes-delete')" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="destroyData(selected)" />
        </template>
    </Dialog>
    <!-- end delete dialog -->

    <!-- restore dialog -->
    <Dialog v-model:visible="restoreDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <RestoreDialog :data="`${selected.type.name} - ${formatCurrency(selected.value)}`" />
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
        <DeleteDialog :data="`${selected.type.name} - ${formatCurrency(selected.value)}`" />
        <template #footer>
            <form @submit.prevent="deleteData(selected)">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" :label="$t('button.yes-destroy')" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete permanent dialog -->
</template>
