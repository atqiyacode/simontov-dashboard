import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

import axios from '@/plugins/axios';
import { i18n } from '@/plugins/i18n';
export const useInvoiceStore = defineStore(
    'InvoiceStore',
    () => {
        const toast = useToast();

        const apiUrl = 'invoiceTemplates';

        const title = ref(i18n.t('page.invoice'));

        const invoice = ref({});

        const getData = (params) => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}`, {
                        params: params
                    })
                    .then((res) => {
                        invoice.value = res.data.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const updateData = () => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`${apiUrl}/${invoice.value.id}`, invoice.value)
                    .then((res) => {
                        invoice.value = res.data.data;
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
            title,
            invoice,
            //
            getData,
            updateData
        };
    },
    {
        persist: false
    }
);
