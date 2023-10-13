<script setup>
import { onMounted, ref } from 'vue';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const { dashboard } = storeToRefs(mainStore);
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
    loadChart();
});

const loadChart = () => {
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
        if (chartSeries.value[0].data.length > 40) {
            chartSeries.value[0].data.shift();
            chartSeries.value[1].data.shift();
        }

        // Update the chart
        lastTimestamp.value = timestamp;
    }, dashboard.value.timeoutChart * 1000);
};

const realTimeChart = ref(null);
// Define initial data for the chart
const chartOptions = ref({
    chart: {
        type: 'line',
        toolbar: {
            show: false
        },
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        }
    },
    colors: ['#FFBB5C', '#247BA0'],
    markers: {
        size: 0,
        hover: {
            sizeOffset: 6
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            // formatter: (value) => new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
            formatter: function (e) {
                const date = new Date(e);

                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                const ltsTime = `${hours}:${minutes}:${seconds}`;
                return ltsTime;
                // return moment(e).format('LLLL');
            }
        }
    },
    yaxis: [
        {
            axisTicks: {
                show: false
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
    tooltip: {
        // shared: !1,
        y: {
            formatter: function (e) {
                return e;
            }
        },
        x: {
            formatter: function (e) {
                return new Date(e).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                // return moment(e).format('LLLL');
            }
        }
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 4,
        dashArray: 0
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    legend: {
        show: false
    }
});
</script>

<template>
    <div class="grid">
        <div class="col-12"></div>
        <div class="col-12">
            <div class="card">
                <apexchart ref="realTimeChart" :options="chartOptions" :series="chartSeries" height="400"></apexchart>
            </div>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-4 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <h4 class="block text-500 font-medium mb-3">Totalizer 1</h4>
                        <div class="text-900 font-medium text-2xl">152 m<sup>3</sup></div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width: 4rem; height: 4rem">
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
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 4rem; height: 4rem">
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
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 4rem; height: 4rem">
                        <i class="pi pi-database text-cyan-500 text-3xl"></i>
                    </div>
                </div>
                <span class="text-500">Hasil : </span>
                <span class="text-green-500 font-medium text-xl">24 m<sup>3</sup> </span>
            </div>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h4 class="block font-medium mb-3">Flowrate Max</h4>
                        <div class="text-900 text-green-500 font-medium text-2xl">152 <small>L/s</small></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h4 class="block font-medium mb-3">Flowrate Min</h4>
                        <div class="text-900 text-red-500 font-medium text-2xl">152 <small>L/s</small></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h4 class="block font-medium mb-3">Pressure Max</h4>
                        <div class="text-900 text-green-500 font-medium text-2xl">152 <small>Bar</small></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h4 class="block font-medium mb-3">Pressure Min</h4>
                        <div class="text-900 text-red-500 font-medium text-2xl">152 <small>Bar</small></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
