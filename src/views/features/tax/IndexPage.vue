<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
const { proxy } = getCurrentInstance();

const store = useCrudStore();

const { hideDialog, getData, processData, showEditDialog } = store;

const { keyword, formDialog, errors, form, data, meta, rowsPerPage, loading, formLabel, tableBody, api, title } = storeToRefs(store);

// mounted
onMounted(() => {
    title.value = 'Pengaturan Biaya Administrasi';
    api.value = '/feature/masterTax';
    tableBody.value = [{ label: 'Jumlah (Rp)', value: 'value', type: 'currency' }];
    getData();
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
            value: val.value
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
        :canCreate="false"
        :canSearch="false"
        :canDestroy="false"
        :canShow="false"
        @edit="onEdit($event)"
    />
    <!-- dialog form -->
    <Dialog v-model:visible="formDialog" :style="{ width: '640px' }" :header="formLabel" :modal="true" :closable="false" class="p-fluid">
        <div class="card">
            <div class="p-fluid formgrid grid">
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
</template>
