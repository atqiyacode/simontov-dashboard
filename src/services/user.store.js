import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { ref } from 'vue';
import { useMainStore } from './main.store';
export const useUserStore = defineStore(
    'user',
    () => {
        const mainStore = useMainStore();
        const user = ref({});
        const sessionId = ref('');
        const firebaseToken = ref('');
        const isLoggedIn = ref(false);
        const isVerified = ref(false);
        const accessToken = ref(null);
        const form = ref({});
        const isLoading = ref(false);

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
            await axios
                .get(`user`)
                .then((res) => {
                    isLoggedIn.value = true;
                    user.value = res.data;
                    sessionId.value = res.data.id;
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
        const cancelNewEmailUser = (val) => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`master/user/clearPendingEmail/${val.id}`)
                    .then((res) => {
                        mainStore.$patch({
                            message: res.data.message
                        });
                        mainStore.successToast();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };
        const resendPendingEmailVerificationMail = (val) => {
            return new Promise((resolve, reject) => {
                axios
                    .post(`master/user/resendPendingEmailVerificationMail/${val.id}`)
                    .then((res) => {
                        mainStore.$patch({
                            message: res.data.message
                        });
                        mainStore.successToast();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
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
            setFirebaseToken,
            session,
            cancelNewEmailUser,
            resendPendingEmailVerificationMail,
            updateEmail,
            updatePassword,
            updateWhatsapp,

            user,
            firebaseToken,
            isLoggedIn,
            isVerified,
            accessToken,
            form,
            isLoading
        };
    },
    {
        // persist: true,
        persist: {
            key: 'user',
            paths: ['accessToken', 'isLoggedIn', 'sessionId']
        }
    }
);
