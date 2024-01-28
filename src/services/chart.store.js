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
        const chartFlowrateSeries = ref([
            {
                name: 'FLowrate',
                data: []
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

        const totalizer_1 = ref(0);
        const totalizer_2 = ref(0);
        const totalizer_3 = ref(0);

        const pln_stat = ref(true);
        const panel_stat = ref(true);
        const codAlert = ref(false);
        const phAlert = ref('NORMAL');

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
            chartFlowrateSeries.value = [
                {
                    name: 'Flowrate',
                    data: []
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
                                loadFlowrateChart(element),
                                loadStat(element),
                                loadTotalizer(element),
                                loadChart(element),
                                loadPHChart(element),
                                loadCODChart(element),
                                loadCondChart(element),
                                loadLevelChart(element),
                                loadDOChart(element),
                                loadStat(element),
                                checkCod(element),
                                checkPh(element)
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

        const getFlorateRange = (id, params) => {
            params.sorts = '-id';
            params.location_id = id;
            return new Promise((resolve, reject) => {
                axios
                    .get(`flowrates/${id}/range`, {
                        params: params
                    })
                    .then(async (res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const loadChart = (data) => {
            const timestamp = data.created_at;

            const newFlowrate = {
                x: timestamp,
                y: parseFloat(data.flowrate).toFixed(2)
            };
            const newPressure = {
                x: timestamp,
                y: parseFloat(data.pressure).toFixed(2)
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

        const loadFlowrateChart = (data) => {
            const timestamp = data.created_at;

            const newFlowrate = {
                x: timestamp,
                y: parseFloat(data.flowrate).toFixed(2)
            };
            chartFlowrateSeries.value[0].data.push(newFlowrate);
            currentPH.value = newFlowrate;
            // Remove older data points to limit the chart length
            if (chartFlowrateSeries.value[0].data.length > chartLength.value) {
                chartFlowrateSeries.value[0].data.shift();
            }
        };

        const loadPHChart = (data) => {
            const timestamp = data.created_at;

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
            const timestamp = data.created_at;

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
            const timestamp = data.created_at;

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
            const timestamp = data.created_at;

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
            const timestamp = data.created_at;

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

        const loadTotalizer = (data) => {
            totalizer_1.value = data.totalizer_1;
            totalizer_2.value = data.totalizer_2;
            totalizer_3.value = data.totalizer_3;
        };

        const loadStat = (data) => {
            panel_stat.value = data.panel_stat;
            pln_stat.value = data.pln_stat;
        };

        const checkCod = (data) => {
            if (data.cod > 90) {
                codAlert.value = true;
            } else {
                codAlert.value = false;
            }
        };

        const checkPh = (data) => {
            if (parseFloat(data.cod) > 9) {
                phAlert.value = 'HIGH';
            }
            if (parseFloat(data.cod) < 6) {
                phAlert.value = 'LOW';
            }
            if (parseFloat(data.cod) >= 6 && parseFloat(data.cod) <= 9) {
                phAlert.value = 'NORMAL';
            }
        };

        return {
            chartLength,
            chartSeries,
            chartFlowrateSeries,
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
            totalizer_1,
            totalizer_2,
            totalizer_3,
            pln_stat,
            panel_stat,
            indonesiaTimeZone,
            codAlert,
            phAlert,
            // fucntion
            getLastFlowrate,
            loadFlowrateChart,
            loadChart,
            loadPHChart,
            loadCODChart,
            loadCondChart,
            loadLevelChart,
            loadDOChart,
            loadTotalizer,
            loadStat,
            resetValue,
            getFlorateRange,
            checkCod,
            checkPh
        };
    },
    {
        persist: {
            storage: sessionStorage
        }
    }
);
