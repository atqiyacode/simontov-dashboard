<script setup>
import moment from 'moment';
import { format } from 'date-fns';
import { onUnmounted, ref, watch } from 'vue';
import { useMainStore } from '../services/main.store';
import { useStaticChartStore } from '../services/static.store';
import { useUserStore } from '@/services/user.store';

import { storeToRefs } from 'pinia';
const userStore = useUserStore();

const dates = ref();
const mainStore = useMainStore();
const staticChartStore = useStaticChartStore();

const { loading } = storeToRefs(mainStore);
const {
    form,
    chartSeries,
    chartPHSeries,
    chartCODSeries,
    chartCondSeries,
    chartLevelSeries,
    chartDOSeries,
    interval,
    title,
    intervals,
    final_billing
} = storeToRefs(staticChartStore);
const { user } = storeToRefs(userStore);

const lastTimestamp = ref();

const totFirst = ref(null);
const totLast = ref(null);

onUnmounted(() => {
    staticChartStore.$reset();
});

watch(dates, (value) => {
    form.value = {
        start: formatDate(value[0]),
        end: formatDate(value[1])
    };
});

const formatDate = (date) => {
    const inputDate = new Date(date);
    const formattedDate = format(inputDate, 'yyyy-MM-dd');
    return formattedDate;
};

const loadChart = () => {
    staticChartStore
        .getFlorateRange(mainStore.currentMap.id, form.value)
        .then((res) => {
            if (res.data.result.length > 0) {
                totFirst.value = parseFloat(
                    res.data.result[res.data.result.length - 1].totalizer_1
                );
                totLast.value = parseFloat(res.data.result[0].totalizer_1);
                chartFilterData(res);
                getBilling();
            } else {
                staticChartStore.resetValue();
                totFirst.value = 0;
                totLast.value = 0;
            }
        })
        .catch(() => {
            staticChartStore.resetValue();
            totFirst.value = 0;
            totLast.value = 0;
        });
};

const chartFilterData = (res) => {
    const list = res.data.result;
    let count = 0;
    const start = moment(res.data.start_date);
    const end = moment(res.data.end_date);
    const minutes = end.diff(start, 'minutes');
    for (let i = 0; i < minutes; i++) {
        count += parseInt(interval.value);
        check(count, res, list);
    }
};

const check = (count, res, list) => {
    const date = moment(res.data.start_date).add(count, 'minutes');
    const getDate = date.format('YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < list.length; i++) {
        const val = list[i];
        if (val.mag_date_chart === getDate) {
            staticChartStore.loadTotalizer(val);
            staticChartStore.loadChart(val);
            staticChartStore.loadPHChart(val);
            staticChartStore.loadCODChart(val);
            staticChartStore.loadCondChart(val);
            staticChartStore.loadLevelChart(val);
            staticChartStore.loadDOChart(val);
        }
    }
};

const checkAccessChart = (code) => {
    return chartSeries.value[0].data.length > 0 && user.value.dashboardCharts.includes(code);
};

const getBilling = () => {
    const final = Number.parseFloat(totFirst.value - totLast.value).toFixed(2);
    staticChartStore.getBilling(mainStore.currentMap.id, final);
};
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-12 xl:col-12">
            <div class="card shadow-5">
                <h5 v-if="title && !loading">
                    {{ $t('text.report-static', { date: title, interval: interval }) }}
                </h5>
                <p>({{ $t('text.interval') }}: {{ $t('text.minutes', { count: interval }) }})</p>
                <div class="formgroup-inline mt-5">
                    <div class="field mb-5">
                        <span class="p-float-label">
                            <Calendar
                                dateFormat="dd/mm/yy"
                                v-model="dates"
                                selectionMode="range"
                                :manualInput="true"
                                showIcon
                                :placeholder="$t('button.search')"
                                :disabled="loading"
                                :maxDate="new Date()"
                            />
                            <InputLabel for="minutes" :value="$t('button.search')" />
                        </span>
                    </div>
                    <div class="field mb-5">
                        <span class="p-float-label">
                            <Dropdown
                                :options="intervals"
                                v-model="interval"
                                :placeholder="$t('text.interval')"
                                class="w-full md:w-14rem"
                                :disabled="loading"
                            >
                                <template #option="slotProps">
                                    {{ $t('text.minutes', { count: slotProps.option }) }}
                                </template>
                            </Dropdown>
                            <InputLabel for="minutes" value="minutes" />
                        </span>
                    </div>
                    <Button
                        :loading="loading"
                        :label="$t('button.search')"
                        icon="pi pi-search"
                        @click="loadChart()"
                    />
                </div>
                <Message v-if="!totFirst && !loading" severity="error">
                    {{ $t('alert.no-data-found') }}
                </Message>
            </div>
        </div>
        <div class="col-12 lg:col-12 xl:col-12" v-if="totFirst && !loading">
            <div class="card shadow-5 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <h4 class="block text-500 font-medium mb-3">
                            {{ $t('totalizer.result') }} - {{ final_billing }}
                        </h4>
                        <div class="text-900 font-bold text-2xl text-green-500">
                            {{ formatFLowrate(totFirst - totLast) }} m<sup>3</sup>
                            <span class="text-blue-500 text-xl">
                                ({{ formatCurrency(final_billing) }})
                            </span>
                        </div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-green-100 border-round"
                        style="width: 4rem; height: 4rem"
                    >
                        <i class="pi pi-thumbs-up text-green-500 text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-6" v-if="totFirst && !loading">
            <div class="card shadow-5 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <h4 class="block text-500 font-medium mb-3">{{ $t('totalizer.last') }}</h4>
                        <div class="text-900 font-bold text-2xl">
                            {{ formatFLowrate(totFirst) }} m<sup>3</sup>
                        </div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 4rem; height: 4rem"
                    >
                        <i class="pi pi-arrow-up text-blue-500 text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-6" v-if="totFirst && !loading">
            <div class="card shadow-5 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <h4 class="block text-500 font-medium mb-3">{{ $t('totalizer.first') }}</h4>
                        <div class="text-900 font-bold text-2xl">
                            {{ formatFLowrate(totLast) }} m<sup>3</sup>
                        </div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-yellow-100 border-round"
                        style="width: 4rem; height: 4rem"
                    >
                        <i class="pi pi-database text-yellow-500 text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="col-12 lg:col-12 xl:col-12"
            v-if="checkAccessChart('realtime-flowrate-pressure')"
        >
            <DualLineChartPage
                title="Flowrate and Pressure"
                :colors="['#FFBB5C', '#247BA0']"
                :chartSeries="chartSeries"
                :lastTimestamp="lastTimestamp"
            />
        </div>
        <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-cod')">
            <LineChartPage
                title="COD"
                :colors="['#5B0888']"
                :chartSeries="chartCODSeries"
                :lastTimestamp="lastTimestamp"
            />
        </div>
        <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-ph')">
            <LineChartPage
                title="PH"
                :colors="['#E55604']"
                :chartSeries="chartPHSeries"
                :lastTimestamp="lastTimestamp"
            />
        </div>
        <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-cond')">
            <LineChartPage
                title="COND"
                :colors="['#E1AA74']"
                :chartSeries="chartCondSeries"
                :lastTimestamp="lastTimestamp"
            />
        </div>
        <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-level')">
            <LineChartPage
                title="LEVEL"
                :colors="['#B6339A']"
                :chartSeries="chartLevelSeries"
                :lastTimestamp="lastTimestamp"
            />
        </div>
        <div class="col-12 lg:col-12 xl:col-12" v-if="checkAccessChart('realtime-do')">
            <LineChartPage
                title="DO"
                :colors="['#A7D397']"
                :chartSeries="chartDOSeries"
                :lastTimestamp="lastTimestamp"
            />
        </div>
    </div>
</template>
