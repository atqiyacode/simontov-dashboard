import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { ref } from 'vue';
import { useUserStore } from './user.store';
import { useMainStore } from './main.store';
// import { useRouter } from 'vue-router';
export const useAuthStore = defineStore('auth', () => {
    // store
    const mainStore = useMainStore();
    const userStore = useUserStore();
    // const router = useRouter();

    // state
    const form = ref({
        email: '',
        password: ''
    });
    const hasCode = ref(false);
    const hasPhone = ref(false);
    const hasEmail = ref(false);
    // function
    const login = async () => {
        await axios
            .post(`login`, form.value)
            .then((res) => {
                mainStore.$patch({
                    authVerification: true
                });

                hasEmail.value = res.data.hasEmail;
                hasPhone.value = res.data.hasPhone;
                directLogin(res.data);
            })
            .catch(() => {
                mainStore.$patch({
                    authVerification: false
                });
            });
    };

    const forgotPassword = async () => {
        await axios
            .post(`forgot-password`, form.value)
            .then((res) => {
                mainStore.$patch({
                    message: res.data.message
                });
                mainStore.successToast();
            })
            .catch(() => {
                mainStore.$patch({
                    authVerification: false
                });
            });
    };

    const resetPassword = async () => {
        await axios
            .post(`reset-password`, form.value)
            .then((res) => {
                mainStore.$patch({
                    message: res.data.message
                });
                mainStore.successToast();
            })
            .catch(() => {
                mainStore.$patch({
                    authVerification: false
                });
            });
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    };

    const session = async () => {
        await axios
            .get(`session`)
            .then((res) => {
                userStore.$patch({
                    isLoggedIn: true,
                    isVerified: res.data.verified,
                    user: res.data,
                    sessionId: res.data.id,
                    form: {
                        whatsapp: res.data.phone,
                        email: res.data.email,
                        old_password: '',
                        password: '',
                        password_confirmation: ''
                    }
                });
            })
            .catch(() => {
                userStore.$patch({
                    isLoggedIn: false
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
                        isLoggedIn: true,
                        isVerified: res.data.user.verified
                    });
                    mainStore.clearGuestSession();
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const directLogin = (data) => {
        userStore.$patch({
            user: data.user,
            accessToken: data.token,
            isLoggedIn: true,
            isVerified: data.user.verified
        });
        mainStore.clearGuestSession();
        window.location.reload();
    };

    const verifyEmailAddress = async (url) => {
        await axios
            .get(url)
            .then((res) => {
                mainStore.$patch({
                    message: res.data.message
                });
            })
            .catch((err) => {
                if (err.status == 400) {
                    mainStore.$patch({
                        message: err.data.message
                    });
                }
                return err;
            });
    };

    const sendEmailVerification = async () => {
        await axios
            .post(`email/verification-notification`)
            .then((res) => {
                mainStore.$patch({
                    message: res.data.message
                });
                mainStore.successToast();
            })
            .catch((err) => {
                return err;
            });
    };

    const resend = async () => {
        await axios
            .post(`auth/generateTokenCode`, form.value)
            .then((res) => {
                mainStore.$patch({
                    message: res.data.message
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
                .post(`logout`)
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
        forgotPassword,
        resetPassword,
        verifyLogin,
        directLogin,
        resend,
        getTokenCode,
        logout,
        session,
        getCookie,
        sendEmailVerification,
        verifyEmailAddress
    };
});
