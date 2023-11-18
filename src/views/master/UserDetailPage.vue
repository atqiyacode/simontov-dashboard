<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/services/master/User.store';
import { useLocationStore } from '@/services/master/Location.store';
import { useRoleStore } from '@/services/master/Role.store';
import { usePermissionStore } from '@/services/master/Permission.store';
import { useDashboardChart } from '@/services/master/DashboardChart.store';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const UserStore = useUserStore();
const mainStore = useMainStore();
const LocationStore = useLocationStore();
const RoleStore = useRoleStore();
const PermissionStore = usePermissionStore();
const DashboardChart = useDashboardChart();

const { loading } = storeToRefs(mainStore);
const { form } = storeToRefs(UserStore);

const route = useRoute();

onMounted(() => {
    UserStore.getById(route.params.id);
    LocationStore.getAll();
    DashboardChart.getAll();
    RoleStore.getData();
    PermissionStore.getData();
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
        <h5>{{ form.name }}</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <router-link :to="{ name: 'master-user' }">
                        <Button
                            v-tooltip.top="`Kembali`"
                            icon="pi pi-arrow-left"
                            label="Kembali"
                            class="p-button-rounded p-button-sm p-button-info mr-2"
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
                <pre class="m-0">
                    {{ form }}
                </pre>
            </TabPanel>
            <TabPanel header="Account">
                <div class="card">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label class="font-bold capitalize" for="name">Name</label>
                            <InputText
                                id="name"
                                type="text"
                                v-model="form.name"
                                placeholder="Full Name"
                            />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label class="font-bold capitalize" for="username">username</label>
                            <InputText
                                id="username"
                                type="text"
                                v-model="form.username"
                                placeholder="Username"
                            />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label class="font-bold capitalize" for="email">Email</label>
                            <InputText
                                id="email"
                                type="text"
                                v-model="form.email"
                                placeholder="Email"
                            />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label class="font-bold capitalize" for="password">password</label>
                            <Password
                                :toggle-mask="true"
                                :feedback="true"
                                id="password"
                                v-model="form.password"
                                placeholder="New Password"
                            />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label class="font-bold capitalize" for="password_confirmation"
                                >password confirmation</label
                            >
                            <Password
                                :toggle-mask="true"
                                :feedback="false"
                                id="password_confirmation"
                                v-model="form.password_confirmation"
                                placeholder="Confirm New Password"
                            />
                        </div>
                        <div class="field col-12 md:col-12">
                            <label class="font-bold capitalize" for="roles">Roles</label>
                            <MultiSelect
                                id="roles"
                                v-model="form.roles"
                                placeholder="Select roles"
                                :options="RoleStore.data"
                                optionLabel="name"
                                optionValue="id"
                            />
                        </div>
                        <div class="field col-12 md:col-12">
                            <label class="font-bold capitalize" for="permissions"
                                >permissions</label
                            >
                            <MultiSelect
                                id="permissions"
                                v-model="form.permissions"
                                placeholder="Select permissions"
                                :options="PermissionStore.data"
                                optionLabel="name"
                                optionValue="id"
                            />
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Location">
                <div class="card">
                    <div class="grid">
                        <div
                            class="col-12 md:col-4"
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
                                <label :for="location.key" class="font-bold">{{
                                    location.name
                                }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Charts">
                <div class="card">
                    <div class="grid">
                        <div
                            class="col-12 md:col-4"
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
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>
