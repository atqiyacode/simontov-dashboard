<script setup>
import { onMounted } from 'vue';
import CurrentMapPage from './CurrentMapPage.vue';
import { useMainStore } from '@/services/main.store';
import { useUserStore } from '@/services/user.store';
import { useChartStore } from '@/services/chart.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const chartStore = useChartStore();
const userStore = useUserStore();
const { dashboard } = storeToRefs(mainStore);
const {
    chartSeries,
    chartPHSeries,
    chartCODSeries,
    lastTimestamp,
    currentFlowrate,
    currentPressure,
    currentPH,
    currentCOD,
    currentCond,
    currentLevel
} = storeToRefs(chartStore);

const { user } = storeToRefs(userStore);

onMounted(() => {
    userStore.session();
});

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
            <!-- <div class="col-12 lg:col-12 xl:col-12">
                <RealtimeLineChartPage
                    title="Cond"
                    :chartSeries="chartCondSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div>
            <div class="col-12 lg:col-12 xl:col-12">
                <RealtimeLineChartPage
                    title="Level"
                    :chartSeries="chartLevelSeries"
                    :lastTimestamp="lastTimestamp"
                />
            </div> -->
        </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-4" v-if="dashboard.showMap">
        <CurrentMapPage />
    </div>
    <div class="col-12 lg:col-6 xl:col-6" v-if="checkAccessChart('radial-flowrate')">
        <RadialChartPage
            tag="l/s"
            title="Flowrate"
            colors="#247BA0"
            :name="['Flowrate']"
            :series="[currentFlowrate?.y]"
        />
    </div>
    <div class="col-12 lg:col-6 xl:col-6" v-if="checkAccessChart('radial-pressure')">
        <RadialChartPage
            tag="BAR"
            title="Pressure"
            colors="#FFBB5C"
            :name="['Pressure']"
            :series="[currentPressure?.y]"
        />
    </div>
    <div class="col-12 lg:col-6 xl:col-6" v-if="checkAccessChart('radial-cod')">
        <RadialChartPage
            tag=""
            title="COD"
            colors="#D0A2F7"
            :name="['COD']"
            :series="[currentCOD?.y]"
        />
    </div>
    <div class="col-12 lg:col-6 xl:col-6" v-if="checkAccessChart('radial-ph')">
        <RadialChartPage
            tag=""
            title="PH"
            colors="#0174BE"
            :name="['Ph']"
            :series="[currentPH?.y]"
        />
    </div>
    <div class="col-12 lg:col-6 xl:col-6" v-if="checkAccessChart('radial-cond')">
        <RadialChartPage
            tag=""
            title="Cond"
            colors="#C70039"
            :name="['Cond']"
            :series="[currentCond?.y]"
        />
    </div>
    <div class="col-12 lg:col-6 xl:col-6" v-if="checkAccessChart('radial-level')">
        <RadialChartPage
            tag=""
            title="Level"
            colors="#3D0C11"
            :name="['Level']"
            :series="[currentLevel?.y]"
        />
    </div>

    <!-- others chart -->
    <div class="col-12 lg:col-4 xl:col-4">
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
    <div class="col-12 lg:col-4 xl:col-4">
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
    <div class="col-12 lg:col-4 xl:col-4">
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
    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-center mb-3">
                <div class="text-center">
                    <h4 class="block font-medium mb-3">Flowrate Max</h4>
                    <div class="text-900 text-green-500 font-medium text-2xl">
                        152 <small>L/s</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-center mb-3">
                <div class="text-center">
                    <h4 class="block font-medium mb-3">Flowrate Min</h4>
                    <div class="text-900 text-red-500 font-medium text-2xl">
                        152 <small>L/s</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-center mb-3">
                <div class="text-center">
                    <h4 class="block font-medium mb-3">Pressure Max</h4>
                    <div class="text-900 text-green-500 font-medium text-2xl">
                        152 <small>Bar</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-center mb-3">
                <div class="text-center">
                    <h4 class="block font-medium mb-3">Pressure Min</h4>
                    <div class="text-900 text-red-500 font-medium text-2xl">
                        152 <small>Bar</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
