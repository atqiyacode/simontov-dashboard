import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { ref } from 'vue';
import { useUserStore } from './user.store';
import { useMainStore } from './main.store';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
    // store
    const mainStore = useMainStore();
    const userStore = useUserStore();

    // state
    const form = ref({
        email: '',
        password: ''
    });
    const hasCode = ref(false);
    const hasPhone = ref(false);
    const hasEmail = ref(false);
    // function
    const login = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/login`, form.value)
                .then((res) => {
                    mainStore.$patch({
                        authVerification: true
                    });

                    hasEmail.value = res.data.hasEmail;
                    hasPhone.value = res.data.hasPhone;
                    if (res.data.token) {
                        directLogin(res.data);
                    } else {
                        router.push({ name: 'auth-verification' });
                    }
                    resolve(res);
                })
                .catch((err) => {
                    mainStore.$patch({
                        authVerification: false
                    });
                    reject(err);
                });
        });
    };
    const verifyLogin = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/login/verify`, form.value)
                .then((res) => {
                    userStore.$patch({
                        user: res.data.user,
                        accessToken: res.data.token,
                        isLoggedIn: true
                    });
                    directLogin(res.data);
                    mainStore.clearGuestSession();
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const directLogin = (data) => {
        if (data.user.is_verified) {
            userStore.$patch({
                user: data.user,
                accessToken: data.token,
                isLoggedIn: true
            });
            mainStore.clearGuestSession();
            router.push({
                name: 'select-location'
            });
        } else {
            userStore.$patch({
                user: data.user,
                accessToken: data.token,
                isLoggedIn: true
            });
            mainStore.clearGuestSession();
            router.push({
                name: 'verify-email'
            });
        }
    };

    const sendLinkEmailVerification = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/email/verification-notification`)
                .then((res) => {
                    mainStore.$patch({
                        message: res.data.message
                    });
                    mainStore.notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const sendLinkForgotPassword = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/forgot-password`, form.value)
                .then((res) => {
                    mainStore.$patch({
                        message: res.data.message
                    });
                    mainStore.notify(res.data.message);

                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const resetPassword = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/reset-password`, form.value)
                .then((res) => {
                    mainStore.$patch({
                        message: res.data.message
                    });
                    mainStore.notify(res.data.message);

                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const verifyEmail = (url) => {
        return new Promise((resolve, reject) => {
            axios
                .get(url)
                .then((res) => {
                    mainStore.$patch({
                        message: res.data.message
                    });
                    mainStore.notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    mainStore.$patch({
                        message: err.data.message
                    });
                    mainStore.errorToast();
                    reject(err);
                });
        });
    };

    const resend = async () => {
        await axios
            .post(`auth/generateTokenCode`, form.value)
            .then((res) => {
                mainStore.$patch({
                    message: res.data.success
                });
            })
            .catch((err) => {
                return err;
            });
    };

    const getTokenCode = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/generateTokenCode`, form.value)
                .then((res) => {
                    mainStore.$patch({
                        message: res.data.message
                    });
                    hasCode.value = true;
                    resolve(res);
                })
                .catch((err) => {
                    hasCode.value = false;
                    reject(err);
                });
        });
    };

    const logout = () => {
        return new Promise((resolve, reject) => {
            axios
                .post(`auth/logout`)
                .then((res) => {
                    mainStore.clearCurrentSession();
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
    return {
        form,
        hasCode,
        hasPhone,
        hasEmail,
        // function
        login,
        verifyLogin,
        directLogin,
        sendLinkEmailVerification,
        sendLinkForgotPassword,
        resetPassword,
        verifyEmail,
        resend,
        getTokenCode,
        logout
    };
});
