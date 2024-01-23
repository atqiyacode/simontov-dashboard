<script setup>
import { ref, onMounted } from 'vue';
import RealtimeChartPage from './chart/RealtimeChartPage.vue';
import CurrentMapPage from '@/views/chart/CurrentMapPage.vue';
import { useMainStore } from '@/services/main.store';
import { useChartStore } from '@/services/chart.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const chartStore = useChartStore();
const { currentMap } = storeToRefs(mainStore);
const { chartLength } = storeToRefs(chartStore);
const formDialog = ref(false);
const mapDialog = ref(false);
const chartLengthOptions = ref([
    {
        id: 5
    },
    {
        id: 10
    },
    {
        id: 15
    },
    {
        id: 20
    },
    {
        id: 30
    },
    {
        id: 50
    },
    {
        id: 100
    }
]);
onMounted(() => {
    chartStore.getLastFlowrate(currentMap.value.id);
});
</script>

<template>
    <ul class="list-none p-0 m-0">
        <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
        >
            <div>
                <h5 class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                    {{ currentMap?.name }} - {{ currentMap?.company_name }}
                </h5>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <Button class="mx-1" icon="pi pi-cog" severity="info" @click="formDialog = true" />
                <Button
                    class="mx-1"
                    icon="pi pi-map"
                    severity="warning"
                    @click="mapDialog = true"
                />
            </div>
        </li>
    </ul>
    <div class="grid">
        <RealtimeChartPage />
    </div>

    <Dialog
        v-model:visible="formDialog"
        :style="{ width: '640px' }"
        header="Setting"
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
            <label class="font-bold capitalize" for="value"> Length Line Chart </label>
            <Dropdown
                v-model="chartLength"
                :options="chartLengthOptions"
                optionLabel="id"
                optionValue="id"
                placeholder="Select Length Line Chart"
                @change="chartStore.getLastFlowrate(currentMap.id)"
            />
        </div>

        <template #footer>
            <Button
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-rounded p-button-text"
                @click="formDialog = false"
            />
        </template>
    </Dialog>

    <Dialog
        v-model:visible="mapDialog"
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
        class="p-fluid"
    >
        <CurrentMapPage />

        <template #footer>
            <Button
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-rounded p-button-text"
                @click="mapDialog = false"
            />
        </template>
    </Dialog>
</template>
