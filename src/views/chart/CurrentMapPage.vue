<script setup>
import { onMounted } from 'vue';
import { GoogleMap, Marker, InfoWindow, MarkerCluster } from 'vue3-google-map';
import { useMainStore } from '@/services/main.store';
import { useOptionStore } from '@/services/option.store';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore();
const optionStore = useOptionStore();

const { currentMap } = storeToRefs(mainStore);

onMounted(() => {
    optionStore.loadSites();
});

const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;
</script>

<template>
    <div class="card shadow-3 mb-0" v-if="currentMap">
        <GoogleMap :api-key="gmapApiKey" style="width: 100%; height: 500px" :center="{ lat: currentMap.lat, lng: currentMap.lng }" :zoom="10">
            <MarkerCluster>
                <Marker :options="{ position: { lat: currentMap.lat, lng: currentMap.lng } }">
                    <InfoWindow class="" :options="{ position: { lat: currentMap.lat, lng: currentMap.lng }, disableAutoPan: true }">
                        <ul class="list-none p-0 m-0 my-2">
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"> Kode </span>
                                </div>
                                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <span class="font-medium text-black-alpha-90">
                                        {{ currentMap.code }}
                                    </span>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"> Name </span>
                                </div>
                                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <span class="font-medium text-black-alpha-90">
                                        {{ currentMap.name }}
                                    </span>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4" v-if="currentMap.description">
                                {{ currentMap.description }}
                            </li>
                        </ul>
                    </InfoWindow>
                </Marker>
            </MarkerCluster>
        </GoogleMap>
        <div class="card mt-3">
            <ul class="list-none p-0 m-0">
                <ListDetail label="Kode" :value="currentMap.code" />
                <ListDetail label="Lokasi" :value="currentMap.name" />
                <ListDetail label="Longitude" :value="currentMap.lng" />
                <ListDetail label="Latitude" :value="currentMap.lat" />
                <ListDetailBreak label="description" :value="currentMap.description" />
            </ul>
        </div>
    </div>
</template>
