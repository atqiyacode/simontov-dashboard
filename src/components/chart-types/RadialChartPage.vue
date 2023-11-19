<script setup>
const props = defineProps({
    title: {
        type: String
    },
    name: {
        type: String
    },
    series: {
        type: Number
    },
    tag: {
        type: String
    },
    colors: {
        type: String,
        default: '#ff5d9e'
    }
});

const options = {
    chart: {
        type: 'radialBar',
        toolbar: {
            show: false
        },
        offsetX: 0,
        offsetY: 10
    },

    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            size: 120,
            imageWidth: 50,
            imageHeight: 50,
            dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                bottom: 0,
                blur: 3,
                opacity: 1
            },
            dataLabels: {
                name: {
                    fontSize: '16px',
                    color: undefined,
                    offsetY: 30
                },
                hollow: {
                    size: '60%'
                },
                value: {
                    offsetY: -10,
                    fontSize: '20px',
                    color: props.colors,
                    formatter: function (val) {
                        return `${val} ${props.tag}`;
                    }
                }
            }
        }
    },
    colors: [props.colors],
    fill: {
        // type: 'gradient',
        // gradient: {
        //     shade: 'gradient',
        //     type: 'horizontal',
        //     shadeIntensity: 0.5,
        //     gradientToColors: ['#ff5d9e'],
        //     inverseColors: !0,
        //     opacityFrom: 1,
        //     opacityTo: 1,
        //     stops: [0, 100]
        // }
    },
    stroke: {
        dashArray: 4
    },
    labels: props.name
};
</script>
<template>
    <div class="card shadow-3">
        <h5 class="font-bold uppercase">{{ title }}</h5>
        <apexchart :options="options" :series="series" height="300"></apexchart>
    </div>
</template>
