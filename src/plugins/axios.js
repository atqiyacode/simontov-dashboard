import axios from 'axios';
import { useMainStore } from '@/services/main.store';
// import { useUserStore } from '@/services/user.store';

const instance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
    }
});

instance.interceptors.response.use(
    (response) => {
        const mainStore = useMainStore();
        mainStore.$patch({
            loading: false
        });
        return response;
    },
    (error) => {
        const mainStore = useMainStore();
        mainStore.handleErrors(error.response);
        mainStore.$patch({
            loading: false
        });
        return Promise.reject(error.response);
    }
);

instance.interceptors.request.use(
    (config) => {
        const mainStore = useMainStore();
        // const userStore = useUserStore();

        // remove error
        mainStore.removeError();
        mainStore.$patch({
            loading: true
        });

        // if (userStore.isLoggedIn) {
        //     config.headers.Authorization = `Bearer ${userStore.accessToken}`;
        // }
        config.headers.Language = `${mainStore.language}`;
        config.headers['X-Socket-Id'] = `${mainStore.socketId}`;
        return config;
    },
    (error) => {
        const mainStore = useMainStore();
        mainStore.$patch({
            loading: false
        });
        Promise.reject(error);
    }
);

export default instance;
