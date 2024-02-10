import axios from '@/plugins/axios';
import { defineStore } from 'pinia';
import { useUserStore } from './user.store';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './auth.store';
import { useToast } from 'vue-toastification';
import { i18n } from '@/plugins/i18n';
import router from '@/router';

export const useMainStore = defineStore(
    'main',
    () => {
        const toast = useToast();
        // store
        const userStore = useUserStore();
        const authStore = useAuthStore();
        // state
        const error = ref({});
        const loading = ref(false);
        const errors = ref([]);
        const dashboard = ref({});
        const registerVerification = ref(false);
        const authVerification = ref(false);
        const isMaintenance = ref(false);
        const route = useRoute();

        const language = ref(import.meta.env.VITE_APP_I18N_LOCALE);

        const socketId = ref('');
        const message = ref('');
        const currentMap = ref(null);

        const notifications = ref([]);
        const oldMapId = ref(null);

        watch(language, (value) => {
            i18n.locale.value = value;
        });

        const sanctumCsrf = async () => {
            if (!document.cookie) {
                await fetch(`${import.meta.env.VITE_APP_SERVER}/sanctum/csrf-cookie`, {
                    credentials: 'include'
                });
            }
        };

        const loadNotifications = () => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`locationNotifications`, {
                        params: {
                            location_id: currentMap.value.id
                        }
                    })
                    .then((res) => {
                        notifications.value = res.data.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const updateNotifications = (item) => {
            const index = notifications.value.findIndex(
                (notification) =>
                    notification.alert_notification_type_id === item.alert_notification_type_id
            );

            if (index !== -1) {
                // Item with the same id found, remove it from notifications
                notifications.value.splice(index, 1);
            } else {
                // Item not found, add it to notifications
                notify(item.message, 'warning');
                notifications.value.push(item);
            }
        };

        const countNotification = () => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`locationNotifications/count/${currentMap.value.id}`)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const handleErrors = async (err) => {
            const statusCode = err.status;
            if (statusCode === 503) {
                isMaintenance.value = true;
            }
            if (statusCode === 500) {
                error.value = err.statusText;
            }
            if (statusCode === 422) {
                errors.value = err.data.errors;
            }
            if (statusCode === 401) {
                clearCurrentSession();
            }
            // if (statusCode === 404) {
            //     notify('API Route Not Found', 'error');
            // }
            if (statusCode === 429) {
                notify(i18n.t('text.please-wait-request'), 'error');
            }
        };

        const notify = (message, type = 'success') => {
            if (message) {
                toast(message, {
                    type: type,
                    closeButton: false,
                    timeout: 5000
                });
            }
        };

        const clearCurrentSession = () => {
            currentMap.value = null;
            userStore.$reset();
            userStore.$patch({
                isLoggedIn: false
            });
            router.push({ name: 'login' });
            sessionStorage.removeItem(['LocationStore', 'ChartStore']);
        };

        const clearGuestSession = () => {
            registerVerification.value = false;
            authVerification.value = false;
            authStore.$reset();
        };

        const removeError = () => {
            errors.value = {};
            error.value = null;
        };

        return {
            error,
            loading,
            errors,
            dashboard,
            registerVerification,
            authVerification,
            isMaintenance,
            route,
            router,
            language,
            socketId,
            message,
            currentMap,
            notifications,
            oldMapId,
            // function
            sanctumCsrf,
            handleErrors,
            clearCurrentSession,
            clearGuestSession,
            removeError,
            notify,
            countNotification,
            loadNotifications,
            updateNotifications
        };
    },
    {
        // persist: true,
        persist: {
            storage: sessionStorage,
            key: 'Main',
            paths: ['language', 'socketId', 'currentMap', 'oldMapId']
        }
    }
);
