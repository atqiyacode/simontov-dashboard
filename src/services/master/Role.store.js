import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

import _ from 'lodash';
import axios from '@/plugins/axios';
export const useRoleStore = defineStore(
    'RoleStore',
    () => {
        const toast = useToast();

        const apiUrl = 'roles';

        const title = ref('role');
        const searchData = ref([]);
        const data = ref([]);
        const allData = ref([]);
        const links = ref({});
        const meta = ref({
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: '',
            per_page: 10,
            to: 10,
            total: 0
        });
        const rowsPerPage = ref([5, 10, 20, 50, 100]);
        const form = ref({});
        const item = ref(null);
        const keyword = ref('');
        const selectedData = ref([]);
        const sortField = ref('-id');

        const formDialog = ref(false);
        const destroyDataDialog = ref(false);
        const destroySelectedDialog = ref(false);

        const restoreDataDialog = ref(false);
        const restoreSelectedDialog = ref(false);

        const destroyPermanentDialog = ref(false);
        const destroyPermanentSelectedDialog = ref(false);

        watch(
            keyword,
            _.debounce((value) => {
                console.log(value);
                let length = value.length;
                if (length >= 3 || length == 0) {
                    keyword.value = value;
                    getData({
                        search: keyword.value,
                        sorts: sortField.value
                    });
                }
            }, 500)
        );

        const onSearch = _.debounce((val) => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}`, {
                        params: {
                            search: val.value
                        }
                    })
                    .then((res) => {
                        searchData.value = res.data.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }, 500);

        const resetDialog = () => {
            formDialog.value = false;
            destroyDataDialog.value = false;
            restoreDataDialog.value = false;
            destroyPermanentDialog.value = false;
            destroySelectedDialog.value = false;
            restoreSelectedDialog.value = false;
            destroyPermanentSelectedDialog.value = false;
        };

        const onChangePage = (val) => {
            selectedData.value = null;
            getData({
                page: val.page + 1,
                per_page: val.rows,
                search: keyword.value,
                sorts: sortField.value
            });
        };

        const onSortData = (val) => {
            selectedData.value = null;
            sortField.value = Math.sign(val.sortOrder) === -1 ? `-${val.sortField}` : val.sortField;
            getData({
                search: keyword.value,
                per_page: meta.value.per_page,
                sorts: sortField.value
            });
        };

        const getAll = () => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}`, {
                        params: {
                            all: true
                        }
                    })
                    .then((res) => {
                        allData.value = res.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const getData = (params) => {
            if (params) {
                params.sorts = sortField.value;
            }
            return new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}`, {
                        params: params
                    })
                    .then((res) => {
                        data.value = res.data.data;
                        links.value = res.data.links;
                        meta.value = res.data.meta;
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const createData = () => {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiUrl}`, form.value)
                    .then((res) => {
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
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
                    .put(`${apiUrl}/${form.value.id}`, form.value)
                    .then((res) => {
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const destroyData = (id) => {
            return new Promise((resolve, reject) => {
                axios
                    .delete(`${apiUrl}/${id}`)
                    .then((res) => {
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const restoreData = (id) => {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiUrl}/${id}/restore`)
                    .then((res) => {
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const deleteData = (id) => {
            return new Promise((resolve, reject) => {
                axios
                    .delete(`${apiUrl}/${id}/force-delete`)
                    .then((res) => {
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const destroyMultiple = () => {
            let data = [];
            selectedData.value.map((val) => {
                data.push(val.id);
            });
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiUrl}/destroy-multiple`, {
                        ids: data
                    })
                    .then((res) => {
                        selectedData.value = null;
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const restoreMultiple = () => {
            let data = [];
            selectedData.value.map((val) => {
                data.push(val.id);
            });
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiUrl}/restore-multiple`, {
                        ids: data
                    })
                    .then((res) => {
                        selectedData.value = null;
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const deleteMultiple = () => {
            let data = [];
            selectedData.value.map((val) => {
                data.push(val.id);
            });
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiUrl}/force-delete-multiple`, {
                        ids: data
                    })
                    .then((res) => {
                        selectedData.value = null;
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: meta.value.per_page,
                            search: keyword.value,
                            sorts: sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const exportCSV = () => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}/export/csv`, {
                        responseType: 'blob'
                    })
                    .then((res) => {
                        const blob = new Blob([res.data]);
                        downloadBlobFile(blob, 'csv');
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };
        const exportExcel = () => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}/export/excel`, {
                        responseType: 'blob'
                    })
                    .then((res) => {
                        const blob = new Blob([res.data]);
                        downloadBlobFile(blob, 'xlsx');
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        const downloadBlobFile = (blob, ext) => {
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a link to trigger the file download
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.value}.${ext}`; // Specify the desired file name

            // Trigger the download
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
        };

        return {
            title,
            searchData,
            onSearch,
            data,
            allData,
            links,
            meta,
            rowsPerPage,
            keyword,
            selectedData,
            form,
            item,
            sortField,
            getAll,
            getData,
            onChangePage,
            onSortData,
            createData,
            updateData,
            restoreData,
            destroyData,
            deleteData,
            destroyMultiple,
            restoreMultiple,
            deleteMultiple,
            exportCSV,
            exportExcel,
            // dialog
            resetDialog,
            formDialog,
            destroyDataDialog,
            destroySelectedDialog,
            restoreDataDialog,
            restoreSelectedDialog,
            destroyPermanentDialog,
            destroyPermanentSelectedDialog
        };
    },
    {
        persist: {
            storage: sessionStorage,
            paths: ['data', 'meta', 'links']
        }
    }
);
