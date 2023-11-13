<script setup>
import { ref } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    chartSeries: {
        type: Array
    },
    colors: {
        type: Array,
        default: () => ['#D0A2F7']
    }
});

const realTimeChart = ref(null);
// Define initial data for the chart
const chartOptions = ref({
    chart: {
        type: 'area',
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
    colors: props.colors,
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
                color: props.colors[0]
            },
            labels: {
                style: {
                    colors: props.colors[0]
                }
            },
            title: {
                text: props.title,
                style: {
                    color: props.colors[0]
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
        <h5 class="font-bold">{{ title }}</h5>
        <apexchart
            ref="realTimeChart"
            :options="chartOptions"
            :series="chartSeries"
            height="400"
        ></apexchart>
    </div>
</template>
