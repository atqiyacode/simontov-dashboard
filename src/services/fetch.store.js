import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { useToast } from 'vue-toastification';

export const useFetchStore = defineStore('fetch', () => {
    const toast = useToast();
    // fetch data
    const fetchData = async (url, params) => {
        return new Promise((resolve, reject) => {
            axios
                .get(`${url}`, {
                    params: params
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
    const createData = async (url, form) => {
        return new Promise((resolve, reject) => {
            axios
                .post(`${url}`, form)
                .then((res) => {
                    toast(res.data.message, {
                        type: 'success',
                        closeButton: false,
                        timeout: 3000
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
    const updateData = async (url, form) => {
        return new Promise((resolve, reject) => {
            axios
                .put(`${url}`, form)
                .then((res) => {
                    toast(res.data.message, {
                        type: 'success',
                        closeButton: false,
                        timeout: 3000
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    return {
        fetchData,
        createData,
        updateData
    };
});
