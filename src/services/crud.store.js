import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import _ from 'lodash';
import axios from '@/plugins/axios';
import { useMainStore } from './main.store';
import { useToast } from 'primevue/usetoast';
import { i18n } from '@/plugins/i18n';

export const useCrudStore = defineStore('crud', () => {
    const toast = useToast();
    const mainStore = useMainStore();
    // state
    const title = ref('title page');
    const api = ref('');
    const data = ref([]);
    const selected = ref({});
    const detailData = ref(null);
    // datatable
    const rows = ref(10);
    const page = ref(1);
    const sortField = ref('id');
    const sortOrder = ref('DESC');
    const meta = ref({});
    const links = ref([]);
    const rowsPerPage = ref([5, 10, 20, 50, 100]);
    const keyword = ref('');
    // form
    const errors = ref({});
    const form = ref({});
    const formLabel = ref('New Data');

    const loading = ref(true);
    // daialog
    const formDialog = ref(false);
    const detailDialog = ref(false);
    const deleteDialog = ref(false);
    const destroyDialog = ref(false);
    const restoreDialog = ref(false);
    const successMessage = ref(null);
    const errorMessage = ref(null);
    const tableBody = ref(null);

    // load data
    const load = (params) => {
        errors.value = {};
        loading.value = true;
        return new Promise((resolve, reject) => {
            axios
                .get(`${api.value}`, {
                    params: params
                })
                .then((res) => {
                    loading.value = false;
                    data.value = res.data.data;
                    links.value = res.data.links;
                    meta.value = res.data.meta;
                    page.value = res.data.meta?.current_page;
                    rows.value = res.data.meta?.per_page;
                    hideDialog();
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    hideDialog();
                    errors.value = err.response.data.errors;
                    reject(err);
                });
        });
    };

    // get single data
    const get = (id, params) => {
        errors.value = {};
        loading.value = true;
        return new Promise((resolve, reject) => {
            axios
                .get(`${api.value}/${id}`, {
                    params: params
                })
                .then((res) => {
                    detailData.value = res.data.data;
                    loading.value = false;
                    hideDialog();
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    if (err.status == 422) {
                        errors.value = err.data.errors;
                    }
                    if (err.status == 403) {
                        errorMessage.value = err.data.message;
                    }
                    reject(err);
                });
        });
    };

    // save data
    const save = () => {
        loading.value = true;
        errors.value = {};
        return new Promise((resolve, reject) => {
            axios
                .post(`${api.value}`, form.value)
                .then((res) => {
                    loading.value = false;
                    load();
                    hideDialog();
                    successMessage.value = res.data.message;
                    notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    if (err.status == 422) {
                        errors.value = err.data.errors;
                    }
                    if (err.status == 403) {
                        errorMessage.value = err.data.message;
                    }
                    reject(err);
                });
        });
    };

    const update = () => {
        loading.value = true;
        errors.value = {};
        return new Promise((resolve, reject) => {
            axios
                .put(`${api.value}/${form.value.id}`, form.value)
                .then((res) => {
                    loading.value = false;
                    load({
                        search: keyword.value,
                        page: page.value,
                        rows: rows.value
                    });
                    hideDialog();
                    successMessage.value = res.data.message;
                    notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    if (err.status == 422) {
                        errors.value = err.data.errors;
                    }
                    if (err.status == 403) {
                        errorMessage.value = err.data.message;
                    }
                    reject(err);
                });
        });
    };

    const destroy = (id) => {
        loading.value = true;
        errors.value = {};
        return new Promise((resolve, reject) => {
            axios
                .delete(`${api.value}/${id}`)
                .then((res) => {
                    loading.value = false;
                    load({
                        search: keyword.value,
                        page: page.value,
                        rows: rows.value
                    });
                    hideDialog();
                    successMessage.value = res.data.message;
                    notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    if (err.status == 422) {
                        errors.value = err.data.errors;
                    }
                    if (err.status == 403) {
                        errorMessage.value = err.data.message;
                    }
                    reject(err);
                });
        });
    };

    const restore = (id) => {
        loading.value = true;
        errors.value = {};
        return new Promise((resolve, reject) => {
            axios
                .post(`${api.value}/restore/${id}`)
                .then((res) => {
                    loading.value = false;
                    load({
                        search: keyword.value,
                        page: page.value,
                        rows: rows.value
                    });
                    hideDialog();
                    successMessage.value = res.data.message;
                    notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    errors.value = err.data.errors;
                    reject(err);
                });
        });
    };

    const deletePermanent = (id) => {
        loading.value = true;
        errors.value = {};
        return new Promise((resolve, reject) => {
            axios
                .delete(`${api.value}/delete/${id}`)
                .then((res) => {
                    loading.value = false;
                    load({
                        search: keyword.value,
                        page: page.value,
                        rows: rows.value
                    });
                    hideDialog();
                    successMessage.value = res.data.message;
                    notify(res.data.message);
                    resolve(res);
                })
                .catch((err) => {
                    loading.value = false;
                    errors.value = err.data.errors;
                    reject(err);
                });
        });
    };

    // front action
    watch(
        keyword,
        _.debounce((value) => {
            console.log(value);
            let length = value.length;
            if (length >= 3 || length == 0) {
                keyword.value = value;
                getData();
            }
        }, 500)
    );
    const filterSearch = (value) => {
        keyword.value = value;
    };

    const onChangePage = (val) => {
        load({
            page: val.page + 1,
            rows: val.rows
        });
    };

    // axios
    const getData = () => {
        const params = {};
        keyword.value ? (params.search = keyword.value) : null;
        load(params);
    };

    const processData = () => {
        if (form.value.id) {
            update();
        } else {
            save();
        }
    };

    const destroyData = (params) => {
        destroy(params.id);
    };

    const restoreData = (params) => {
        restore(params.id);
    };

    const deleteData = (params) => {
        deletePermanent(params.id);
    };

    // dialog
    const onCreate = () => {
        formLabel.value = i18n.t('button.new-data');
        selected.value = {};
        form.value = {};
        formDialog.value = true;
    };

    const showEditDialog = () => {
        formLabel.value = i18n.t('button.edit-data');
        formDialog.value = true;
        detailDialog.value = false;
    };
    const showDetail = (val) => {
        selected.value = val;
        detailDialog.value = true;
    };
    const confirmDelete = (val) => {
        selected.value = val;
        detailDialog.value = false;
        deleteDialog.value = true;
    };

    const onRestore = (val) => {
        selected.value = val;
        restoreDialog.value = true;
        deleteDialog.value = false;
        detailDialog.value = false;
    };

    const onDestroy = (val) => {
        selected.value = val;
        destroyDialog.value = true;
    };

    // hide all dialog
    const hideDialog = () => {
        form.value = {};
        errors.value = {};
        selected.value = {};
        loading.value = false;
        formDialog.value = false;
        detailDialog.value = false;
        deleteDialog.value = false;
        restoreDialog.value = false;
        destroyDialog.value = false;
        mainStore.removeError();
    };

    const notify = (message, type = 'success') => {
        if (message) {
            toast.add({
                severity: type,
                summary: i18n.t('message.notification'),
                detail: message,
                life: 5000,
                closable: true
            });
        }
    };

    return {
        title,
        api,
        data,
        selected,
        detailData,
        // datatable
        rows,
        page,
        sortField,
        sortOrder,
        meta,
        links,
        rowsPerPage,
        keyword,
        // form
        errors,
        form,
        formLabel,

        loading,
        // daialog
        formDialog,
        detailDialog,
        deleteDialog,
        destroyDialog,
        restoreDialog,
        successMessage,
        errorMessage,
        tableBody,
        // function
        load,
        get,
        save,
        update,
        destroy,
        restore,
        deletePermanent,
        hideDialog,
        notify,

        getData,
        filterSearch,
        onChangePage,
        processData,
        destroyData,
        onCreate,
        showEditDialog,
        showDetail,
        confirmDelete,
        onRestore,
        onDestroy,
        restoreData,
        deleteData
    };
});
