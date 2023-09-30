import { defineStore } from 'pinia';
import { useUserStore } from './user.store';
import { ref } from 'vue';
import axios from '@/plugins/axios';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './auth.store';
import { useToast } from 'vue-toastification';
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
        const server = import.meta.env.VITE_APP_SERVER;
        const isMaintenance = ref(false);
        const route = useRoute();
        const router = useRouter();
        const language = ref('id');
        const socketId = ref('');
        const message = ref('');
        const currentMap = ref(null);

        const sanctumCsrf = async () => {
            if (!document.cookie) {
                await axios.get(server + 'sanctum/csrf-cookie');
            }
        };

        const errorToast = (position = 'top-right', duration = 5000) => {
            toast.error(message.value, {
                position: position,
                timeout: duration,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: true,
                hideProgressBar: true,
                closeButton: false
            });
        };

        const successToast = (position = 'top-right', duration = 5000) => {
            toast.success(message.value, {
                position: position,
                timeout: duration,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: true,
                hideProgressBar: true,
                closeButton: false
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
            if (statusCode === 404) {
                router.push({ name: 'data-not-found' });
            }
            if (statusCode === 429) {
                // const alert = await alertController.create({
                //     header: i18n.t('header.information'),
                //     subHeader: i18n.t('text.please-wait'),
                //     message: i18n.t('text.please-wait-request'),
                //     buttons: [
                //         {
                //             text: i18n.t('button.close'),
                //             role: 'cancel'
                //         }
                //     ]
                // });
                // await alert.present();
            }
        };

        const clearCurrentSession = () => {
            userStore.$patch({
                accessToken: '',
                isLoggedIn: false,
                sessionId: null
            });
            localStorage.removeItem('access');
            localStorage.removeItem('user');
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
            server,
            isMaintenance,
            route,
            router,
            language,
            socketId,
            message,
            currentMap,
            // function
            sanctumCsrf,
            handleErrors,
            clearCurrentSession,
            clearGuestSession,
            removeError,
            errorToast,
            successToast
        };
    },
    {
        // persist: true,
        persist: {
            key: 'global',
            paths: ['language', 'socketId', 'currentMap']
        }
    }
);
