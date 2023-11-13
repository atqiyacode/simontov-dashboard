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
        const lastTimestamp = ref(
            new Date().toLocaleString('en-US', { timeZone: indonesiaTimeZone.value })
        );

        const currentFlowrate = ref(0);
        const currentPressure = ref(0);
        const currentPH = ref(0);
        const currentCOD = ref(0);
        const currentCond = ref(0);
        const currentLevel = ref(0);

        const getLastFlowrate = (id) => {
            let params = {};
            params.location_id = id;
            params.sorts = '-id';
            params.per_page = 20;
            return new Promise((resolve, reject) => {
                axios
                    .get(`flowrates`, {
                        params: params
                    })
                    .then((res) => {
                        const data = res.data.data;
                        data.forEach((element) => {
                            loadChart(element);
                            loadPHChart(element);
                            loadCODChart(element);
                            loadCondChart(element);
                            loadLevelChart(element);
                        });
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const loadChart = (data) => {
            const timestamp = data.created_at
                ? data.created_at
                : new Date().toLocaleString('en-US', {
                      timeZone: indonesiaTimeZone.value
                  });
            const newDataPoint1 = {
                x: timestamp,
                y: parseFloat(data.flowrate).toFixed(2)
            };
            const newDataPoint2 = {
                x: timestamp,
                y: parseFloat(data.totalizer_3).toFixed(2)
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
            lastTimestamp.value = timestamp;
        };

        const loadPHChart = (data) => {
            const timestamp = data.created_at
                ? data.created_at
                : new Date().toLocaleString('en-US', {
                      timeZone: indonesiaTimeZone.value
                  });

            const newDataPoint1 = {
                x: timestamp,
                y: parseFloat(data.ph).toFixed(2)
            };
            chartPHSeries.value[0].data.push(newDataPoint1);
            currentPH.value = newDataPoint1;
            // Remove older data points to limit the chart length
            if (chartPHSeries.value[0].data.length > 20) {
                chartPHSeries.value[0].data.shift();
            }
        };

        const loadCODChart = (data) => {
            const timestamp = data.created_at
                ? data.created_at
                : new Date().toLocaleString('en-US', {
                      timeZone: indonesiaTimeZone.value
                  });
            const newDataPoint1 = {
                x: timestamp,
                y: parseFloat(data.cod).toFixed(2)
            };
            chartCODSeries.value[0].data.push(newDataPoint1);
            currentCOD.value = newDataPoint1;
            // Remove older data points to limit the chart length
            if (chartCODSeries.value[0].data.length > 20) {
                chartCODSeries.value[0].data.shift();
            }
        };

        const loadCondChart = (data) => {
            const timestamp = data.created_at
                ? data.created_at
                : new Date().toLocaleString('en-US', {
                      timeZone: indonesiaTimeZone.value
                  });
            const newDataPoint1 = {
                x: timestamp,
                y: parseFloat(data.cond).toFixed(2)
            };
            chartCondSeries.value[0].data.push(newDataPoint1);
            currentCond.value = newDataPoint1;
            // Remove older data points to limit the chart length
            if (chartCondSeries.value[0].data.length > 20) {
                chartCondSeries.value[0].data.shift();
            }
        };

        const loadLevelChart = (data) => {
            const timestamp = data.created_at
                ? data.created_at
                : new Date().toLocaleString('en-US', {
                      timeZone: indonesiaTimeZone.value
                  });
            const newDataPoint1 = {
                x: timestamp,
                y: parseFloat(data.level).toFixed(2)
            };
            chartLevelSeries.value[0].data.push(newDataPoint1);
            currentLevel.value = newDataPoint1;
            // Remove older data points to limit the chart length
            if (chartLevelSeries.value[0].data.length > 20) {
                chartLevelSeries.value[0].data.shift();
            }
        };

        return {
            chartSeries,
            chartPHSeries,
            chartCODSeries,
            chartCondSeries,
            chartLevelSeries,
            lastTimestamp,
            currentFlowrate,
            currentPressure,
            currentPH,
            currentCOD,
            currentCond,
            currentLevel,
            indonesiaTimeZone,
            // fucntion
            getLastFlowrate,
            loadChart,
            loadPHChart,
            loadCODChart,
            loadCondChart,
            loadLevelChart
        };
    },
    {
        persist: true
    }
);
