<script setup>
import { ref } from 'vue';
defineProps({
    chartSeries: {
        type: Array
    }
});

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
    colors: ['#D0A2F7'],
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
            opposite: true,
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: true,
                color: '#D0A2F7'
            },
            labels: {
                style: {
                    colors: '#D0A2F7'
                }
            },
            title: {
                text: 'COD',
                style: {
                    color: '#D0A2F7'
                }
            }
        },
        {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#D0A2F7'
            },
            labels: {
                style: {
                    colors: '#D0A2F7'
                }
            },
            title: {
                text: 'COD',
                style: {
                    color: '#D0A2F7'
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
        horizontalAlign: 'left',
        offsetX: 40
    }
});
</script>
<template>
    <div class="card shadow-3" v-if="chartSeries">
        <p>COD Realtime Chart</p>
        <apexchart ref="realTimeChart" :options="chartOptions" :series="chartSeries" height="400"></apexchart>
    </div>
</template>
