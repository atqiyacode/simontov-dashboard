<script setup>
import { onMounted } from 'vue';
import CurrentMapPage from './CurrentMapPage.vue';
import { useMainStore } from '@/services/main.store';
import { useUserStore } from '@/services/user.store';
import { useChartStore } from '@/services/chart.store';
import { storeToRefs } from 'pinia';
import router from '@/router';
const mainStore = useMainStore();
const chartStore = useChartStore();
const userStore = useUserStore();
const { dashboard, currentMap } = storeToRefs(mainStore);
const {
    chartSeries,
    chartPHSeries,
    chartCODSeries,
    chartCondSeries,
    chartLevelSeries,
    chartDOSeries,
    lastTimestamp,
    currentFlowrate,
    currentPressure,
    currentPH,
    currentCOD,
    currentCond,
    currentLevel,
    currentDO
} = storeToRefs(chartStore);

const { user } = storeToRefs(userStore);

onMounted(() => {
    userStore.session();
    checkAccessLocation();
});

const checkAccessLocation = () => {
    if (!user.value.locations.includes(currentMap.value.id)) {
        router.push({
            name: 'select-location'
        });
    }
};

const checkAccessChart = (code) => {
    return user.value.dashboardCharts.includes(code);
};
</script>
<template>
    <div :class="dashboard.showMap ? 'col-12 lg:col-6 xl:col-8' : 'col-12 '">
        <div class="grid">
            <div
                class="col-12 lg:col-12 xl:col-12"
                v-if="checkAccessChart('realtime-flowrate-pressure')"
            >
                <RealtimeDualLineChartPage
                    title="Flowrate and Pressure"
                    :colors="['#FFBB5C', '#247BA0']"
                    :chartSeries="chartSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
            <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-cod')">
                <RealtimeLineChartPage
                    title="COD"
                    :colors="['#5B0888']"
                    :chartSeries="chartCODSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
            <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-ph')">
                <RealtimeLineChartPage
                    title="PH"
                    :colors="['#E55604']"
                    :chartSeries="chartPHSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
            <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-cond')">
                <RealtimeLineChartPage
                    title="COND"
                    :colors="['#E1AA74']"
                    :chartSeries="chartCondSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
            <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-level')">
                <RealtimeLineChartPage
                    title="LEVEL"
                    :colors="['#B6FFFA']"
                    :chartSeries="chartLevelSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
            <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-do')">
                <RealtimeLineChartPage
                    title="DO"
                    :colors="['#A7D397']"
                    :chartSeries="chartDOSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
        </div>
    </div>

    <template v-if="currentMap.id">
        <div class="col-12 lg:col-6 xl:col-4" v-if="dashboard.showMap">
            <CurrentMapPage />
        </div>

        <div class="col-12">
            <div class="grid">
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-flowrate')">
                    <NewRadialChartPage
                        tag="l/s"
                        title="Flowrate"
                        colors="#247BA0"
                        :name="['Flowrate']"
                        :series="[currentFlowrate?.y]"
                    />
                </div>
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-pressure')">
                    <NewRadialChartPage
                        tag="BAR"
                        title="Pressure"
                        colors="#FFBB5C"
                        :name="['Pressure']"
                        :series="[currentPressure?.y]"
                    />
                </div>
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-cod')">
                    <NewRadialChartPage
                        tag=""
                        title="COD"
                        colors="#5B0888"
                        :name="['COD']"
                        :series="[currentCOD?.y]"
                    />
                </div>
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-ph')">
                    <NewRadialChartPage
                        tag=""
                        title="PH"
                        colors="#E55604"
                        :name="['Ph']"
                        :series="[currentPH?.y]"
                    />
                </div>
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-cond')">
                    <NewRadialChartPage
                        tag=""
                        title="Cond"
                        colors="#E1AA74"
                        :name="['Cond']"
                        :series="[currentCond?.y]"
                    />
                </div>
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-level')">
                    <NewRadialChartPage
                        tag=""
                        title="Level"
                        colors="#B6FFFA"
                        :name="['Level']"
                        :series="[currentLevel?.y]"
                    />
                </div>
                <div class="col-12 lg:col-6 xl:col-4" v-if="checkAccessChart('radial-do')">
                    <NewRadialChartPage
                        tag=""
                        title="DO"
                        colors="#A7D397"
                        :name="['DO']"
                        :series="[currentDO?.y]"
                    />
                </div>
            </div>
        </div>

        <!-- others chart -->
        <div class="col-12">
            <div class="grid">
                <div class="col-12 lg:col-4 xl:col-4" v-if="checkAccessChart('totalizer-1')">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <h4 class="block text-500 font-medium mb-3">Totalizer 1</h4>
                                <div class="text-900 font-medium text-2xl">152 m<sup>3</sup></div>
                            </div>
                            <div
                                class="flex align-items-center justify-content-center bg-red-100 border-round"
                                style="width: 4rem; height: 4rem"
                            >
                                <i class="pi pi-database text-red-500 text-3xl"></i>
                            </div>
                        </div>
                        <span class="text-500">Akhir : </span>
                        <span class="text-green-500 font-medium text-xl">24 m<sup>3</sup> </span>
                    </div>
                </div>
                <div class="col-12 lg:col-4 xl:col-4" v-if="checkAccessChart('totalizer-2')">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <h4 class="block text-500 font-medium mb-3">Totalizer 2</h4>
                                <div class="text-900 font-medium text-2xl">2.100 m<sup>3</sup></div>
                            </div>
                            <div
                                class="flex align-items-center justify-content-center bg-orange-100 border-round"
                                style="width: 4rem; height: 4rem"
                            >
                                <i class="pi pi-database text-orange-500 text-3xl"></i>
                            </div>
                        </div>
                        <span class="text-500">Awal : </span>
                        <span class="text-green-500 font-medium text-xl">24 m<sup>3</sup> </span>
                    </div>
                </div>
                <div class="col-12 lg:col-4 xl:col-4" v-if="checkAccessChart('totalizer-3')">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <h4 class="block text-500 font-medium mb-3">Totalizer 3</h4>
                                <div class="text-900 font-medium text-2xl">28441 m<sup>3</sup></div>
                            </div>
                            <div
                                class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                                style="width: 4rem; height: 4rem"
                            >
                                <i class="pi pi-database text-cyan-500 text-3xl"></i>
                            </div>
                        </div>
                        <span class="text-500">Hasil : </span>
                        <span class="text-green-500 font-medium text-xl">24 m<sup>3</sup> </span>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
