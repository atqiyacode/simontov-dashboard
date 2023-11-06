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
    colors: ['#F875AA'],
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
                color: '#F875AA'
            },
            labels: {
                style: {
                    colors: '#F875AA'
                }
            },
            title: {
                text: 'Ph',
                style: {
                    color: '#F875AA'
                }
            }
        },
        {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#F875AA'
            },
            labels: {
                style: {
                    colors: '#F875AA'
                }
            },
            title: {
                text: 'Ph',
                style: {
                    color: '#F875AA'
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
        show: true
    }
});
</script>
<template>
    <div class="card shadow-3" v-if="chartSeries">
        <p>Ph Realtime Chart</p>
        <apexchart ref="realTimeChart" :options="chartOptions" :series="chartSeries" height="400"></apexchart>
    </div>
</template>
