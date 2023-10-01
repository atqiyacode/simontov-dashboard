<script setup>
import { onMounted, ref } from 'vue';
import RadialChartPage from './RadialChartPage.vue';
import RealtimeLineChartPage from './RealtimeLineChartPage.vue';
import CurrentMapPage from './CurrentMapPage.vue';
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
const lastTimestamp = ref(new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone }));
const currentFlowrate = ref(0);
const currentPressure = ref(0);

onMounted(() => {
    setInterval(() => {
        const timestamp = new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone });
        const newDataPoint1 = {
            x: timestamp,
            y: (Math.random() * 100).toFixed(2)
        };
        const newDataPoint2 = {
            x: timestamp,
            y: (Math.random() * 100).toFixed(2)
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
    }, 5000);
});
</script>
<template>
    <div class="col-12 lg:col-6 xl:col-8">
        <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
                <RealtimeLineChartPage :chartSeries="chartSeries" :lastTimestamp="lastTimestamp" />
            </div>
            <div class="col-12 lg:col-12 xl:col-6">
                <RadialChartPage tag="l/s" colors="#247BA0" :name="['Flowrate']" :series="[currentFlowrate?.y]" />
            </div>
            <div class="col-12 lg:col-12 xl:col-6">
                <RadialChartPage tag="BAR" colors="#FFBB5C" :name="['Pressure']" :series="[currentPressure?.y]" />
            </div>
        </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-4">
        <CurrentMapPage />
    </div>
</template>
