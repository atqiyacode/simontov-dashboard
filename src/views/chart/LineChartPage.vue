<script setup>
const options = {
    chart: {
        height: 350,
        type: 'line',
        stacked: false
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#FF1654', '#247BA0'],
    series: [
        {
            name: 'Series A',
            data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
        },
        {
            name: 'Series B',
            data: [20, 29, 37, 36, 44, 45, 50, 58]
        }
    ],
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
    xaxis: {
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
    },
    yaxis: [
        {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#FF1654'
            },
            labels: {
                style: {
                    colors: '#FF1654'
                }
            },
            title: {
                text: 'Series A',
                style: {
                    color: '#FF1654'
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
                text: 'Series B',
                style: {
                    color: '#247BA0'
                }
            }
        }
    ],
    tooltip: {
        shared: false,
        intersect: true,
        x: {
            show: false
        }
    },
    legend: {
        horizontalAlign: 'left',
        offsetX: 40
    }
};
const series = [
    {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
    },
    {
        name: 'series-2',
        data: [10, 30, 55, 70, 49, 90, 20, 31]
    }
];
</script>
<template>
    <apexchart type="line" :options="options" :series="series"></apexchart>
</template>
