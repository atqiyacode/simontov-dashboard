<script setup>
import { ref, onMounted, watch } from 'vue';
import RadialChartPage from './RadialChartPage.vue';

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
        // console.log({
        //     Flowrate: currentFlowrate.value.y,
        //     Pressure: currentPressure.value.y
        // });
    }, 1000);
});

// Watch for changes in the chart data and update the chart
watch(chartSeries, () => {
    // realTimeChart.value.updateSeries(chartSeries.value);
});
</script>
<template>
    <div class="col-12 lg:col-6 xl:col-9">
        <div class="card shadow-5">
            <apexchart ref="realTimeChart" :options="chartOptions" :series="chartSeries" height="400"></apexchart>
        </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-3">
        <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
                <RadialChartPage tag="l/s" colors="#247BA0" :name="['Flowrate']" :series="[currentFlowrate?.y]" />
            </div>
            <div class="col-12 lg:col-12 xl:col-12">
                <RadialChartPage tag="BAR" colors="#FFBB5C" :name="['Pressure']" :series="[currentPressure?.y]" />
            </div>
        </div>
    </div>
</template>
