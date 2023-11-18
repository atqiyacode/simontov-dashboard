<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/services/master/User.store';
import { useLocationStore } from '@/services/master/Location.store';
import { useDashboardChart } from '@/services/master/DashboardChart.store';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const UserStore = useUserStore();
const mainStore = useMainStore();
const LocationStore = useLocationStore();
const DashboardChart = useDashboardChart();

const { loading } = storeToRefs(mainStore);
const { form } = storeToRefs(UserStore);

const route = useRoute();

onMounted(() => {
    UserStore.getById(route.params.id);
    LocationStore.getAll();
    DashboardChart.getAll();
});

const saveData = () => {
    if (form.value.id) {
        UserStore.updateData();
    } else {
        UserStore.createData();
    }
};
</script>
<template>
    <div class="card">
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <router-link :to="{ name: 'master-user' }">
                        <Button
                            v-tooltip.top="`Kembali`"
                            icon="pi pi-arrow-left"
                            class="p-button-rounded p-button-sm p-button-success mr-2"
                        />
                    </router-link>
                </div>
            </template>

            <template v-slot:end>
                <Button
                    :disabled="loading"
                    :loading="loading"
                    :label="loading ? 'Loading' : 'Update'"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="saveData"
                />
            </template>
        </Toolbar>
        <TabView>
            <TabPanel header="Detail">
                <p class="m-0">
                    {{ form }}
                </p>
            </TabPanel>
            <TabPanel header="Account">
                <pre class="m-0">
                    {{ form }}
                </pre>
            </TabPanel>
            <TabPanel header="Location">
                <div class="grid">
                    <div
                        class="col-12 md:col-3"
                        v-for="location of LocationStore.allData"
                        :key="location.key"
                    >
                        <div class="field-checkbox mb-0">
                            <Checkbox
                                v-model="form.locations"
                                :inputId="location.key"
                                name="location"
                                :value="location.id"
                            />
                            <label :for="location.key" class="font-bold">{{ location.name }}</label>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Charts">
                <div class="grid">
                    <div
                        class="col-12 md:col-3"
                        v-for="item of DashboardChart.allData"
                        :key="item.id"
                    >
                        <div class="field-checkbox mb-0">
                            <Checkbox
                                v-model="form.dashboardCharts"
                                :inputId="item.id"
                                name="item"
                                :value="item.id"
                            />
                            <label :for="item.id" class="font-bold">{{ item.name }}</label>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>
