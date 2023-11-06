<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue';
import RadialChartPage from './RadialChartPage.vue';
import RealtimeLineChartPage from './RealtimeLineChartPage.vue';
import RealtimePHLineChartPage from './RealtimePHLineChartPage.vue';
import RealtimeCODLineChartPage from './RealtimeCODLineChartPage.vue';
import CurrentMapPage from './CurrentMapPage.vue';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const { dashboard } = storeToRefs(mainStore);
const { proxy } = getCurrentInstance();
const indonesiaTimeZone = 'Asia/Jakarta';
const chartSeries = ref([
    {
        name: 'Flowrate',
        data: []
    },
    {
        name: 'Pressure',
        data: [],
        yAxis: 1 // Assign this series to the second Y-axis
    }
]);
const chartPHSeries = ref([
    {
        name: 'PH',
        data: []
    }
]);
const chartCODSeries = ref([
    {
        name: 'COD',
        data: []
    }
]);
const lastTimestamp = ref(new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone }));
const currentFlowrate = ref(0);
const currentPressure = ref(0);
const currentPH = ref(0);
const currentCOD = ref(0);

onMounted(() => {
    // loadChart();
});

const loadChart = (data) => {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone });
    const newDataPoint1 = {
        x: timestamp,
        y: parseFloat(data.flowrate).toFixed(2)
    };
    const newDataPoint2 = {
        x: timestamp,
        y: parseFloat(data.totalizer_3).toFixed(2)
    };
    chartSeries.value[0].data.push(newDataPoint1);
    chartSeries.value[1].data.push(newDataPoint2);
    currentFlowrate.value = newDataPoint1;
    currentPressure.value = newDataPoint2;
    // Remove older data points to limit the chart length
    if (chartSeries.value[0].data.length > 20) {
        chartSeries.value[0].data.shift();
        chartSeries.value[1].data.shift();
    }

    // Update the chart
    lastTimestamp.value = timestamp;
};

const loadPHChart = (data) => {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone });
    const newDataPoint1 = {
        x: timestamp,
        y: parseFloat(data.ph).toFixed(2)
    };
    chartPHSeries.value[0].data.push(newDataPoint1);
    currentPH.value = newDataPoint1;
    // Remove older data points to limit the chart length
    if (chartPHSeries.value[0].data.length > 20) {
        chartPHSeries.value[0].data.shift();
        chartPHSeries.value[1].data.shift();
    }
};

const loadCODChart = (data) => {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone });
    const newDataPoint1 = {
        x: timestamp,
        y: parseFloat(data.cod).toFixed(2)
    };
    chartCODSeries.value[0].data.push(newDataPoint1);
    currentCOD.value = newDataPoint1;
    // Remove older data points to limit the chart length
    if (chartCODSeries.value[0].data.length > 20) {
        chartCODSeries.value[0].data.shift();
        chartCODSeries.value[1].data.shift();
    }
};

proxy.$pusher.channel('flowrate-channel').listen('.flowrate-event', (res) => {
    const data = res.data.data;
    loadChart(data);
    loadPHChart(data);
    loadCODChart(data);
});
</script>
<template>
    <div :class="dashboard.showMap ? 'col-12 lg:col-6 xl:col-8' : 'col-12 '">
        <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
                <RealtimeLineChartPage :chartSeries="chartSeries" :lastTimestamp="lastTimestamp" />
            </div>
            <div class="col-12 lg:col-6 xl:col-6">
                <RealtimeCODLineChartPage :chartSeries="chartCODSeries" :lastTimestamp="lastTimestamp" />
            </div>
            <div class="col-12 lg:col-6 xl:col-6">
                <RealtimePHLineChartPage :chartSeries="chartPHSeries" :lastTimestamp="lastTimestamp" />
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <RadialChartPage tag="l/s" colors="#247BA0" :name="['Flowrate']" :series="[currentFlowrate?.y]" />
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <RadialChartPage tag="BAR" colors="#FFBB5C" :name="['Pressure']" :series="[currentPressure?.y]" />
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <RadialChartPage tag="" colors="#D0A2F7" :name="['COD']" :series="[currentCOD?.y]" />
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <RadialChartPage tag="" colors="#F875AA" :name="['Ph']" :series="[currentPH?.y]" />
            </div>
        </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-4">
        <CurrentMapPage v-if="dashboard.showMap" />
    </div>
</template>
