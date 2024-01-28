<script setup>
import { onMounted, getCurrentInstance } from 'vue';
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

const { loading, errors } = storeToRefs(mainStore);
const { form } = storeToRefs(UserStore);

const route = useRoute();
const { proxy } = getCurrentInstance();

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

proxy.$pusher
    .subscribe('user-detail-channel-' + route.params.id)
    .bind('.user-detail-event', async (res) => {
        form.value = res.data;
    });
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
                <div class="card">
                    <ul class="list-none p-0 m-0">
                        <ListDetailBreak label="full name" :value="form.name" />
                        <ListDetailBreak label="username" :value="form.username" />
                        <ListDetailBreak label="email" :value="form.email" />
                        <li class="mb-4">
                            <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Roles
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.roles_name">
                                <template v-for="(item, index) in form.roles_name" :key="index">
                                    <Tag class="mr-2 mb-2" severity="info" :value="`${item}`"></Tag>
                                </template>
                            </div>
                            <!-- <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Permissions
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.permissions_name">
                                <template
                                    v-for="(item, index) in form.permissions_name"
                                    :key="index"
                                >
                                    <Tag
                                        class="mr-2 mb-2"
                                        severity="secondary"
                                        :value="`${item}`"
                                    ></Tag>
                                </template>
                            </div> -->
                            <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Locations
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.locations_name">
                                <template v-for="(item, index) in form.locations_name" :key="index">
                                    <Tag
                                        class="mr-2 mb-2"
                                        severity="primary"
                                        :value="`${item}`"
                                    ></Tag>
                                </template>
                            </div>
                            <div>
                                <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                                    Charts
                                </p>
                            </div>
                            <div class="mt-2" v-if="form.dashboardCharts_name">
                                <template
                                    v-for="(item, index) in form.dashboardCharts_name"
                                    :key="index"
                                >
                                    <Tag
                                        class="mr-2 mb-2"
                                        severity="success"
                                        :value="`${item}`"
                                    ></Tag>
                                </template>
                            </div>
                        </li>
                    </ul>
                </div>
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
                                :class="{ 'p-invalid': errors?.name }"
                            />
                            <small class="text-sm p-error" v-if="errors?.name">
                                {{ errors?.name[0] }}
                            </small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label class="font-bold capitalize" for="username">username</label>
                            <InputText
                                id="username"
                                type="text"
                                v-model="form.username"
                                placeholder="Username"
                                :class="{ 'p-invalid': errors?.username }"
                            />
                            <small class="text-sm p-error" v-if="errors?.username">
                                {{ errors?.username[0] }}
                            </small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label class="font-bold capitalize" for="email">Email</label>
                            <InputText
                                id="email"
                                type="text"
                                v-model="form.email"
                                placeholder="Email"
                                :class="{ 'p-invalid': errors?.email }"
                            />
                            <small class="text-sm p-error" v-if="errors?.email">
                                {{ errors?.email[0] }}
                            </small>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label class="font-bold capitalize" for="roles">Roles</label>
                            <MultiSelect
                                display="chip"
                                id="roles"
                                v-model="form.roles"
                                placeholder="Select roles"
                                :options="RoleStore.data"
                                optionLabel="name"
                                optionValue="id"
                                :class="{ 'p-invalid': errors?.roles }"
                            />
                            <small class="text-sm p-error" v-if="errors?.roles">
                                {{ errors?.roles[0] }}
                            </small>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label class="font-bold capitalize" for="permissions"
                                >permissions</label
                            >
                            <MultiSelect
                                display="chip"
                                id="permissions"
                                v-model="form.permissions"
                                placeholder="Select permissions"
                                :options="PermissionStore.data"
                                optionLabel="name"
                                optionValue="id"
                                :class="{ 'p-invalid': errors?.permissions }"
                            />
                            <small class="text-sm p-error" v-if="errors?.permissions">
                                {{ errors?.permissions[0] }}
                            </small>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Password">
                <div class="card">
                    <div class="p-fluid formgrid grid">
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
