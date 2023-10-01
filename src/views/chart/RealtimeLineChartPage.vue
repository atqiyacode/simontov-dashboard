<script setup>
import { ref } from 'vue';
defineProps({
    chartSeries: {
        type: Array
    },
    lastTimestamp: {
        type: String
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
    colors: ['#FFBB5C', '#247BA0'],
    markers: {
        size: 0,
        hover: {
            sizeOffset: 6
        }
    },
    xaxis: {
        type: 'datetime',
        // labels: {
        //     format: 'HH:mm:ss'
        // },
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
            columnWidth: '20%'
        }
    },
    legend: {
        show: false
    }
});
</script>
<template>
    <div class="card shadow-3">
        <apexchart ref="realTimeChart" :options="chartOptions" :series="chartSeries" height="400"></apexchart>
    </div>
</template>
