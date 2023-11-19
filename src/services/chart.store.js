import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/plugins/axios';
export const useChartStore = defineStore(
    'ChartStore',
    () => {
        const indonesiaTimeZone = ref('Asia/Jakarta');
        // store
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
        const chartPHSeries = ref([
            {
                name: 'PH',
                data: []
            }
        ]);
        const chartCODSeries = ref([
            {
                name: 'COD',
                data: []
            }
        ]);
        const chartCondSeries = ref([
            {
                name: 'Cond',
                data: []
            }
        ]);
        const chartLevelSeries = ref([
            {
                name: 'Level',
                data: []
            }
        ]);
        const chartDOSeries = ref([
            {
                name: 'DO',
                data: []
            }
        ]);
        const lastTimestamp = ref(
            new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone.value })
        );

        const chartLength = ref(15);

        const currentFlowrate = ref(0);
        const currentPressure = ref(0);
        const currentPH = ref(0);
        const currentCOD = ref(0);
        const currentCond = ref(0);
        const currentLevel = ref(0);
        const currentDO = ref(0);

        const resetValue = () => {
            chartSeries.value = [
                {
                    name: 'Flowrate',
                    data: []
                },
                {
                    name: 'Pressure',
                    data: [],
                    yAxis: 1 // Assign this series to the second Y-axis
                }
            ];
            chartPHSeries.value = [
                {
                    name: 'PH',
                    data: []
                }
            ];
            chartCODSeries.value = [
                {
                    name: 'COD',
                    data: []
                }
            ];
            chartCondSeries.value = [
                {
                    name: 'Cond',
                    data: []
                }
            ];
            chartLevelSeries.value = [
                {
                    name: 'Level',
                    data: []
                }
            ];
            chartDOSeries.value = [
                {
                    name: 'DO',
                    data: []
                }
            ];
        };

        const getLastFlowrate = (id) => {
            resetValue();
            let params = {};
            params.per_page = chartLength.value;
            params.sorts = '-id';
            params.location_id = id;
            return new Promise((resolve, reject) => {
                axios
                    .get(`flowrates`, {
                        params: params
                    })
                    .then(async (res) => {
                        const data = res.data.data;
                        const promises = data.reverse().map(async (element) => {
                            await Promise.all([
                                loadChart(element),
                                loadPHChart(element),
                                loadCODChart(element),
                                loadCondChart(element),
                                loadLevelChart(element),
                                loadDOChart(element)
                            ]);
                        });
                        await Promise.all(promises);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const loadChart = (data) => {
            const timestamp = data.mag_date;

            const newFlowrate = {
                x: timestamp,
                y: parseFloat(data.flowrate).toFixed(2)
            };
            const newPressure = {
                x: timestamp,
                y: parseFloat(data.totalizer_3).toFixed(2)
            };
            chartSeries.value[0].data.push(newFlowrate);
            chartSeries.value[1].data.push(newPressure);
            currentFlowrate.value = newFlowrate;
            currentPressure.value = newPressure;
            // Remove older data points to limit the chart length
            if (chartSeries.value[0].data.length > chartLength.value) {
                chartSeries.value[0].data.shift();
                chartSeries.value[1].data.shift();
            }
        };

        const loadPHChart = (data) => {
            const timestamp = data.mag_date;

            const newPH = {
                x: timestamp,
                y: parseFloat(data.ph).toFixed(2)
            };
            chartPHSeries.value[0].data.push(newPH);
            currentPH.value = newPH;
            // Remove older data points to limit the chart length
            if (chartPHSeries.value[0].data.length > chartLength.value) {
                chartPHSeries.value[0].data.shift();
            }
        };

        const loadCODChart = (data) => {
            const timestamp = data.mag_date;

            const newCOD = {
                x: timestamp,
                y: parseFloat(data.cod).toFixed(2)
            };
            chartCODSeries.value[0].data.push(newCOD);
            currentCOD.value = newCOD;
            // Remove older data points to limit the chart length
            if (chartCODSeries.value[0].data.length > chartLength.value) {
                chartCODSeries.value[0].data.shift();
            }
        };

        const loadCondChart = (data) => {
            const timestamp = data.mag_date;

            const newCond = {
                x: timestamp,
                y: parseFloat(data.cond).toFixed(2)
            };
            chartCondSeries.value[0].data.push(newCond);
            currentCond.value = newCond;
            // Remove older data points to limit the chart length
            if (chartCondSeries.value[0].data.length > chartLength.value) {
                chartCondSeries.value[0].data.shift();
            }
        };

        const loadLevelChart = (data) => {
            const timestamp = data.mag_date;

            const newLevel = {
                x: timestamp,
                y: parseFloat(data.level).toFixed(2)
            };
            chartLevelSeries.value[0].data.push(newLevel);
            currentLevel.value = newLevel;
            // Remove older data points to limit the chart length
            if (chartLevelSeries.value[0].data.length > chartLength.value) {
                chartLevelSeries.value[0].data.shift();
            }
        };

        const loadDOChart = (data) => {
            const timestamp = data.mag_date;

            const newDO = {
                x: timestamp,
                y: parseFloat(data.do).toFixed(2)
            };
            chartDOSeries.value[0].data.push(newDO);
            currentDO.value = newDO;
            // Remove older data points to limit the chart length
            if (chartDOSeries.value[0].data.length > chartLength.value) {
                chartDOSeries.value[0].data.shift();
            }
        };

        return {
            chartLength,
            chartSeries,
            chartPHSeries,
            chartCODSeries,
            chartCondSeries,
            chartLevelSeries,
            chartDOSeries,
            lastTimestamp,
            currentFlowrate,
            currentPressure,
            currentPH,
            currentCOD,
            currentCond,
            currentLevel,
            currentDO,
            indonesiaTimeZone,
            // fucntion
            getLastFlowrate,
            loadChart,
            loadPHChart,
            loadCODChart,
            loadCondChart,
            loadLevelChart,
            loadDOChart,
            resetValue
        };
    },
    {
        persist: {
            storage: sessionStorage
        }
    }
);
