<script setup>
import { ref, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const realTimeChart = ref(null);

// Define initial data for the chart
const chartOptions = ref({
    chart: {
        id: 'realtime',
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        },
        zoom: {
            enabled: true
        }
    },
    colors: ['#FFBB5C', '#247BA0'],
    xaxis: {
        type: 'datetime',
        labels: {
            format: 'HH:mm:ss'
        }
    },
    yaxis: [
        {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#FFBB5C'
            },
            labels: {
                style: {
                    colors: '#FFBB5C'
                }
            },
            title: {
                text: 'l/s',
                style: {
                    color: '#FFBB5C'
                }
            }
        },
        {
            opposite: true,
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#247BA0'
            },
            labels: {
                style: {
                    colors: '#247BA0'
                }
            },
            title: {
                text: 'BAR',
                style: {
                    color: '#247BA0'
                }
            }
        }
    ],
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 3,
        dashArray: 0
    },
    plotOptions: {
        bar: {
            columnWidth: '20%'
        }
    },
    legend: {
        show: false
    }
});

const chartSeries = ref([
    {
        name: 'Series 1',
        data: []
    },
    {
        name: 'Series 2',
        data: [],
        yAxis: 1 // Assign this series to the second Y-axis
    }
]);

const lastTimestamp = ref(Date.now());
const currentFlowrate = ref(0);
const currentPressure = ref(0);

onMounted(() => {
    setInterval(() => {
        const timestamp = Date.now();
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
        // realTimeChart.value.updateSeries(chartSeries.value);
        lastTimestamp.value = timestamp;
        console.log({
            Flowrate: currentFlowrate.value.y,
            Pressure: currentPressure.value.y
        });
    }, 1000);
});

// Watch for changes in the chart data and update the chart
watch(chartSeries, () => {
    // realTimeChart.value.updateSeries(chartSeries.value);
});
</script>
<template>
    <div class="col-12 lg:col-12 xl:col-12">
        <div class="card shadow-5">
            <VueApexCharts ref="realTimeChart" :options="chartOptions" :series="chartSeries" height="450"></VueApexCharts>
        </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6">
        <div class="grid">
            <div class="col-12 lg:col-6 xl:col-6">
                <div class="parent">
                    <div class="card shadow-5 mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <h3 class="block text-500 font-medium mb-3">Flowrate</h3>
                                <div class="text-900 font-medium text-xl">{{ currentFlowrate?.y }} <small>l/s</small></div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-chart-line text-blue-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-6">
                <div class="parent">
                    <div class="card shadow-5 mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <h3 class="block text-500 font-medium mb-3">Pressure</h3>
                                <div class="text-900 font-medium text-xl">
                                    <span class="font-bold mx-2">
                                        {{ currentPressure?.y }}
                                    </span>
                                    <small>l/s</small>
                                </div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-yellow-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-chart-line text-yellow-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
