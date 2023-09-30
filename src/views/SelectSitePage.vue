<script setup>
import { onMounted } from 'vue';
import { GoogleMap, Marker, InfoWindow, MarkerCluster } from 'vue3-google-map';
import { useMainStore } from '../services/main.store';
import { useOptionStore } from '../services/option.store';
import { useRouter } from 'vue-router';

const mainStore = useMainStore();
const optionStore = useOptionStore();
const router = useRouter();
onMounted(() => {
    optionStore.loadSites();
});

const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;

const center = { lat: -6.177915895055959, lng: 106.8185290963413 };

const onSelectMap = (location) => {
    mainStore.$patch({
        currentMap: location
    });

    router.push({
        name: 'dashboard'
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12 h-22rem">
            <GoogleMap :api-key="gmapApiKey" :center="center" :zoom="10" class="map">
                <MarkerCluster>
                    <Marker v-for="(location, i) in optionStore.sites" :options="{ position: location }" :key="i">
                        <InfoWindow class="max-w-20rem" :options="{ position: location, disableAutoPan: true }">
                            <ul class="list-none p-0 m-0 my-2">
                                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"> Kode </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.code }}
                                        </span>
                                    </div>
                                </li>
                                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"> Name </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.name }}
                                        </span>
                                    </div>
                                </li>
                                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"> Longitude </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.lng }}
                                        </span>
                                    </div>
                                </li>
                                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span class="font-bold mr-2 mb-1 md:mb-0 capitalize text-gray-500"> Lattitude </span>
                                    </div>
                                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <span class="font-medium text-black-alpha-90">
                                            {{ location.lat }}
                                        </span>
                                    </div>
                                </li>
                                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4" v-if="location.description">
                                    {{ location.description }}
                                </li>
                                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <Button @click="onSelectMap(location)" class="w-full" icon="pi pi-search" severity="warning" label="Pilih lokasi ini" size="small"></Button>
                                </li>
                            </ul>
                        </InfoWindow>
                    </Marker>
                </MarkerCluster>
            </GoogleMap>
        </div>
    </div>
</template>

<style scoped>
.map {
    /* position: relative; */
    width: 100%;
    height: 720px;
}
</style>
