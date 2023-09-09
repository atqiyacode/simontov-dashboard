<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';
import router from '../../../router';
import { GoogleMap, Marker, MarkerCluster } from 'vue3-google-map';

const { proxy } = getCurrentInstance();

const store = useCrudStore();

const { hideDialog, getData, filterSearch, onChangePage, destroyData, showDetail, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, form, data, meta, rowsPerPage, loading, selected, tableBody, api, title } = storeToRefs(store);
const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;

// mounted
onMounted(() => {
    title.value = 'site location';
    api.value = '/feature/site';
    tableBody.value = [
        { label: 'code', value: 'code', type: 'text' },
        { label: 'name', value: 'name', type: 'text' }
    ];
    getData();
});

// onUnMounted
onUnmounted(() => {
    // store.$reset();
});

const onEdit = (val) => {
    form.value = val;
    form.value.longitude = val.lng;
    form.value.lattitude = val.lat;
    router.push({
        name: 'feature-location-edit',
        params: {
            id: val.id
        }
    });
};

const onCreate = () => {
    router.push({ name: 'feature-location-new' });
};

proxy.$pusher.channel('location-channel').listen('.location-event', () => {
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

    <!-- dialog detail -->
    <Dialog v-model:visible="detailDialog" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }" header="Detail" :modal="true" :closable="false">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="code" :value="selected.code" />
                <ListDetailBreak label="name" :value="selected.name" />
                <ListDetailBreak label="description" :value="selected.description" />
            </ul>
            <div v-if="selected">
                <GoogleMap :api-key="gmapApiKey" style="width: 100%; height: 300px" :center="{ lat: selected.lat, lng: selected.lng }" :zoom="15">
                    <MarkerCluster>
                        <Marker :options="{ position: { lat: selected.lat, lng: selected.lng } }"> </Marker>
                    </MarkerCluster>
                </GoogleMap>
            </div>
        </div>

        <template #footer>
            <Button :label="$t('button.close')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
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
