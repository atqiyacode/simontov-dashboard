<script setup>
import { onMounted, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import { GoogleMap, Marker, InfoWindow, MarkerCluster } from 'vue3-google-map';
import { useMainStore } from '../services/main.store';
import { useOptionStore } from '../services/option.store';
import { storeToRefs } from 'pinia';
import RealtimeChartPage from './chart/RealtimeChartPage.vue';
const { isDarkTheme } = useLayout();

const products = ref(null);
const mainStore = useMainStore();
const optionStore = useOptionStore();

const lineOptions = ref(null);
const productService = new ProductService();
const { currentMap } = storeToRefs(mainStore);
onMounted(() => {
    optionStore.loadSites();
    productService.getProductsSmall().then((data) => (products.value = data));
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;
</script>

<template>
    <h5>
        <i class="pi pi-map-marker"></i> Lokasi : <span class="font-bold text-blue-500">{{ currentMap?.name }}</span>
    </h5>
    <div class="grid">
        <RealtimeChartPage />
        <div class="col-12 lg:col-6 xl:col-6">
            <div class="card shadow-5 mb-0" v-if="currentMap">
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
            </div>
        </div>
    </div>
</template>
