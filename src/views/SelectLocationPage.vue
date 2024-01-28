<script setup>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { GoogleMap, Marker, InfoWindow, MarkerCluster } from 'vue3-google-map';
import { useMainStore } from '@/services/main.store';
import { useChartStore } from '@/services/chart.store';
import { useLocationStore } from '@/services/master/Location.store';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
const { proxy } = getCurrentInstance();

const mainStore = useMainStore();
const chartStore = useChartStore();
const LocationStore = useLocationStore();
const router = useRouter();

const { currentMap } = storeToRefs(mainStore);
const { sessionLocation } = storeToRefs(LocationStore);
const { getBySession } = LocationStore;

const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;

// const center = { lat: -6.177915895055959, lng: 106.8185290963413 };

const center = ref({ lat: 3.6626168, lng: 98.7212061 });

onMounted(async () => {
    await getBySession();
    center.value = {
        lat: LocationStore.sessionLocation[0].lattitude,
        lng: LocationStore.sessionLocation[0].longitude
    };
    listenFlowrate();
});

onUnmounted(() => {
    if (currentMap.value.id) {
        stoplistenFlowrate(currentMap.value.id);
    }
});

const isOutOfRangePH = (value) => {
    return value < 6 || value > 9;
};

const isOutOfRangeCOD = (value) => {
    return value > 900;
};

const electricityStatus = (value) => {
    if (value) {
        return 'text-green-500 font-bold';
    } else {
        return 'text-red-500 font-bold';
    }
};

const onSelectMap = async (location) => {
    chartStore.$reset();
    mainStore.$patch({
        currentMap: location,
        oldMapId: currentMap.value.id,
        notifications: []
    });
    router.push({
        name: 'dashboard'
    });
};
const active = ref(null);

const listenFlowrate = () => {
    sessionLocation.value.forEach((element) => {
        proxy.$pusher.subscribe('flowrate-channel-' + element.id).bind('.flowrate-event', (res) => {
            active.value = res.data.location_id;

            const matchedLocation = sessionLocation.value.find((data) => data.id === active.value);

            if (matchedLocation) {
                matchedLocation.flowrates = res.data;
            }
        });
    });
};
const stoplistenFlowrate = (location) => {
    sessionLocation.value.forEach((element) => {
        if (element.id !== location.id) {
            proxy.$pusher.subscribe('flowrate-channel-' + element.id).unbind('.flowrate-event');
        }
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <GoogleMap :api-key="gmapApiKey" :center="center" :zoom="14" class="map">
                <MarkerCluster>
                    <Marker
                        v-for="(location, i) in sessionLocation"
                        :options="{
                            position: {
                                lat: location.lattitude,
                                lng: location.longitude
                            }
                        }"
                        :key="i"
                    >
                        <InfoWindow
                            class="max-w-20rem"
                            :options="{
                                position: {
                                    lat: location.lattitude,
                                    lng: location.longitude
                                },
                                disableAutoPan: true
                            }"
                        >
                            <ul class="list-none p-0 m-0 my-2">
                                <li
                                    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                                >
                                    <div>
                                        <span
                                            class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"
                                        >
                                            {{ $t('location.code') }}
                                        </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.code }}
                                        </span>
                                    </div>
                                </li>
                                <li
                                    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                                >
                                    <div>
                                        <span
                                            class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"
                                        >
                                            {{ $t('location.tenant') }}
                                        </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.company_name }}
                                        </span>
                                    </div>
                                </li>
                                <li
                                    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                                >
                                    <div>
                                        <span
                                            class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"
                                        >
                                            {{ $t('location.name') }}
                                        </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.name }}
                                        </span>
                                    </div>
                                </li>
                                <li
                                    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                                    v-if="location.description"
                                >
                                    {{ location.description }}
                                </li>
                                <li
                                    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                                >
                                    <Button
                                        @click="onSelectMap(location)"
                                        class="w-full"
                                        icon="pi pi-search"
                                        severity="warning"
                                        :label="$t('location.select-location')"
                                        size="small"
                                    ></Button>
                                </li>
                            </ul>
                        </InfoWindow>
                    </Marker>
                </MarkerCluster>
            </GoogleMap>
            <div class="card my-3 shadow-3">
                <DataTable
                    :value="sessionLocation"
                    responsiveLayout="scroll"
                    paginator
                    :rows="5"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                >
                    <Column field="code" :sortable="false" headerStyle="min-width:3rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> Code </span>
                        </template>
                        <template #body="slotProps">
                            <span>
                                {{ slotProps.data.code }}
                            </span>
                        </template>
                    </Column>
                    <Column field="company_name" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> company name </span>
                        </template>
                        <template #body="slotProps">
                            <span>
                                {{ slotProps.data.company_name }}
                            </span>
                        </template>
                    </Column>
                    <Column field="flowrate" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> flowrate </span>
                        </template>
                        <template #body="slotProps">
                            <span>
                                {{
                                    formatFlowrate(
                                        parseFloat(slotProps.data.flowrates?.flowrate || 0)
                                    )
                                }}
                                m<sup>3</sup>/h
                            </span>
                        </template>
                    </Column>
                    <Column field="totalizer" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> totalizer </span>
                        </template>
                        <template #body="slotProps">
                            <span>
                                {{
                                    formatFlowrate(
                                        parseFloat(slotProps.data.flowrates?.totalizer_1 || 0)
                                    )
                                }}
                                m<sup>3</sup>
                            </span>
                        </template>
                    </Column>

                    <Column field="ph" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> ph </span>
                        </template>
                        <template #body="slotProps">
                            <span
                                :class="{
                                    'text-red-500 font-bold': isOutOfRangePH(
                                        numberFloat(slotProps.data.flowrates?.ph || 0)
                                    )
                                }"
                            >
                                {{ numberFloat(slotProps.data.flowrates?.ph || 0) }}
                            </span>
                        </template>
                    </Column>
                    <Column field="cod" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> cod </span>
                        </template>
                        <template #body="slotProps">
                            <span
                                :class="{
                                    'text-red-500 font-bold': isOutOfRangeCOD(
                                        numberFloat(slotProps.data.flowrates?.cod || 0)
                                    )
                                }"
                            >
                                {{ numberFloat(slotProps.data.flowrates?.cod || 0) }}
                            </span>
                        </template>
                    </Column>
                    <Column field="pln_stat" :sortable="false" headerStyle="min-width:10rem;">
                        <template #header>
                            <span class="flex-1 uppercase py-2 font-bold"> electricity </span>
                        </template>
                        <template #body="slotProps">
                            <span :class="electricityStatus(slotProps.data.flowrates?.pln_stat)">
                                {{ slotProps.data.flowrates?.pln_stat ? 'PLN' : 'UPS' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="cod" :sortable="false" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button
                                @click="onSelectMap(slotProps.data)"
                                icon="pi pi-search"
                                severity="warning"
                                size="small"
                            ></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
.map {
    /* position: relative; */
    width: 100%;
    height: 520px;
}
</style>
