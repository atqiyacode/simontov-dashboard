import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/plugins/axios';

export const useOptionStore = defineStore({
    id: 'option',
    state: () => ({
        permissions: ref([]),
        roles: ref([]),
        departments: ref([]),
        designations: ref([]),
        grades: ref([]),
        employees: ref([]),
        notificationTypes: ref([]),
        deviceTypes: ref([]),
        buildTypes: ref([]),
        appStatuses: ref([]),
        statuses: ref([]),
        loading: ref(false)
    }),
    actions: {
        async loadPermissions() {
            await axios
                .get('master/permission', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.permissions = res.data;
                })
                .catch(() => {
                    this.permissions = [];
                });
        },
        async loadRoles() {
            await axios
                .get('master/role', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.roles = res.data;
                })
                .catch(() => {
                    this.roles = [];
                });
        },
        async loadDepartments() {
            await axios
                .get('company/department', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.departments = res.data;
                })
                .catch(() => {
                    this.departments = [];
                });
        },
        async loadDesignation() {
            await axios
                .get('company/designation', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.designations = res.data;
                })
                .catch(() => {
                    this.designations = [];
                });
        },

        async loadGrade() {
            await axios
                .get('company/grade', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.grades = res.data;
                })
                .catch(() => {
                    this.grades = [];
                });
        },

        async loadEmployee(params) {
            this.loading = true;
            await axios
                .get('company/employee', {
                    params: params
                })
                .then((res) => {
                    this.loading = false;
                    this.employees = res.data.data;
                })
                .catch(() => {
                    this.loading = false;
                    this.employees = [];
                });
        },
        async loadNotificationType() {
            await axios
                .get('notification/notificationType', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.notificationTypes = res.data;
                })
                .catch(() => {
                    this.notificationTypes = [];
                });
        },
        async loadDeviceType() {
            await axios
                .get('mobile/mobileDeviceType', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.deviceTypes = res.data;
                })
                .catch(() => {
                    this.deviceTypes = [];
                });
        },
        async loadBuildType() {
            await axios
                .get('mobile/mobileBuildType', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.buildTypes = res.data;
                })
                .catch(() => {
                    this.buildTypes = [];
                });
        },
        async loadAppStatus() {
            await axios
                .get('mobile/mobileAppStatus', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.appStatuses = res.data;
                })
                .catch(() => {
                    this.appStatuses = [];
                });
        },
        async loadGlobalStatus() {
            await axios
                .get('master/masterStatus', {
                    params: {
                        all: true
                    }
                })
                .then((res) => {
                    this.statuses = res.data;
                })
                .catch(() => {
                    this.statuses = [];
                });
        }
    },
    persist: false
});
