import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { ref } from 'vue';
import { useMainStore } from '@/services/main.store';
export const useUserStore = defineStore(
    'user',
    () => {
        const mainStore = useMainStore();

        const user = ref({});
        const firebaseToken = ref('');
        const isLoggedIn = ref(false);
        const accessToken = ref(null);
        const form = ref({});
        const isLoading = ref(false);

        const hasAnyRole = (roles) => {
            return roles.some((role) => user.value && user.value.roles.includes(role));
        };

        const setFirebaseToken = (token) => {
            return new Promise((resolve, reject) => {
                axios
                    .post(`auth/firebaseToken`, {
                        token: token
                    })
                    .then((res) => {
                        firebaseToken.value = token;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };
        const session = async () => {
            await mainStore.sanctumCsrf();
            await axios
                .get(`auth/session`)
                .then((res) => {
                    isLoggedIn.value = true;
                    user.value = res.data;
                    form.value = {
                        whatsapp: res.data.phone,
                        email: res.data.email,
                        old_password: '',
                        password: '',
                        password_confirmation: ''
                    };
                })
                .catch(() => {
                    isLoggedIn.value = false;
                });
        };
        const updateEmail = () => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`update-email`, form.value)
                    .then((res) => {
                        user.value = res.data;
                        form.value = {
                            whatsapp: res.data.phone,
                            email: res.data.email,
                            old_password: '',
                            password: '',
                            password_confirmation: ''
                        };
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const updatePassword = () => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`update-password`, form.value)
                    .then((res) => {
                        user.value = res.data;
                        form.value = {
                            whatsapp: res.data.phone,
                            email: res.data.email,
                            old_password: '',
                            password: '',
                            password_confirmation: ''
                        };
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };
        const updateWhatsapp = () => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`update-whatsapp`, form.value)
                    .then((res) => {
                        user.value = res.data;
                        form.value = {
                            whatsapp: res.data.phone,
                            email: res.data.email,
                            old_password: '',
                            password: '',
                            password_confirmation: ''
                        };
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        return {
            hasAnyRole,
            setFirebaseToken,
            session,
            updateEmail,
            updatePassword,
            updateWhatsapp,

            user,
            firebaseToken,
            isLoggedIn,
            accessToken,
            form,
            isLoading
        };
    },
    {
        persist: false
        // persist: {
        //     key: 'user',
        //     paths: ['accessToken', 'isLoggedIn', 'user']
        // }
    }
);
