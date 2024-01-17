import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import _ from 'lodash';
import axios from '@/plugins/axios';
import { useMainStore } from '@/services/main.store';
export const useGlobalStore = defineStore(
    'GlobalStore',
    () => {
        const mainStore = useMainStore();
        const toast = useToast();

        const dt = ref(null);
        const apiUrl = ref('');
        const title = ref('');

        const keyword = ref('');

        const isDownloading = ref(false);

        const permissions = {
            canShow: ref(true),
            canCreate: ref(true),
            canEdit: ref(true),
            canUpload: ref(false),
            canRestore: ref(true),
            canRestoreMultiple: ref(true),
            canDestroy: ref(true),
            canDestroyMultiple: ref(true),
            canDelete: ref(true),
            canDeleteMultiple: ref(true),
            canExport: ref(true),
            canSearch: ref(true),
            canMultiSelectData: ref(true),
            canSelectField: ref(true),
            actionColumn: ref(true)
        };

        const tableData = {
            searchData: ref([]),
            data: ref([]),
            allData: ref([]),
            links: ref({}),
            meta: ref({
                current_page: 1,
                from: 1,
                last_page: 1,
                links: [],
                path: '',
                per_page: 10,
                to: 10,
                total: 0
            }),
            rowsPerPage: ref([5, 10, 20, 50, 100]),
            sortField: ref('-id')
        };

        const formData = {
            form: ref({}),
            item: ref(null),
            selectedData: ref([]),
            selectedFields: ref([])
        };

        const dialogs = {
            formDialog: ref(false),
            uploadDialog: ref(false),
            detailDialog: ref(false),
            destroyDataDialog: ref(false),
            destroySelectedDialog: ref(false),
            restoreDataDialog: ref(false),
            restoreSelectedDialog: ref(false),
            destroyPermanentDialog: ref(false),
            destroyPermanentSelectedDialog: ref(false),
            selectFieldDialog: ref(false),
            exportDialog: ref(false)
        };

        const debounceTime = 500;

        const setLoadingState = (isLoading) => {
            mainStore.$patch({ loading: isLoading });
        };

        const resetTable = () => {
            tableData.searchData.value = [];
            tableData.data.value = [];
            tableData.allData.value = [];
            tableData.links.value = {};
            tableData.meta.value = {
                current_page: 1,
                from: 1,
                last_page: 1,
                links: [],
                path: '',
                per_page: 10,
                to: 10,
                total: 0
            };
        };

        watch(
            keyword,
            _.debounce((value) => {
                if (value.length >= 3 || value.length === 0) {
                    keyword.value = value;
                    getData({
                        search: keyword.value,
                        sorts: tableData.sortField.value
                    });
                }
            }, debounceTime)
        );

        const resetDialog = () => {
            mainStore.removeError();
            formData.item.value = null;
            formData.form.value = {};
            [
                dialogs.formDialog,
                dialogs.detailDialog,
                dialogs.destroyDataDialog,
                dialogs.restoreDataDialog,
                dialogs.destroyPermanentDialog,
                dialogs.destroySelectedDialog,
                dialogs.restoreSelectedDialog,
                dialogs.destroyPermanentSelectedDialog,
                dialogs.selectFieldDialog,
                dialogs.uploadDialog,
                dialogs.exportDialog
            ].forEach((dialog) => (dialog.value = false));
        };

        const reloadData = () => {
            getData({
                page: tableData.meta.value.current_page,
                per_page: tableData.meta.value.per_page,
                search: keyword.value,
                sorts: tableData.sortField.value
            });
        };

        const onChangePage = (val) => {
            formData.selectedData.value = null;
            getData({
                page: val.page + 1,
                per_page: val.rows,
                search: keyword.value,
                sorts: tableData.sortField.value
            });
        };

        const onSortData = (val) => {
            formData.selectedData.value = null;
            tableData.sortField.value =
                Math.sign(val.sortOrder) === -1 ? `-${val.sortField}` : val.sortField;
            getData({
                search: keyword.value,
                per_page: tableData.meta.value.per_page,
                sorts: tableData.sortField.value
            });
        };

        const handleRequest = (url, method, params = null) => {
            setLoadingState(true);
            return axios[method](url, { params })
                .then((res) => {
                    setLoadingState(false);
                    return res;
                })
                .catch((err) => {
                    setLoadingState(false);
                    throw err;
                });
        };

        const getAll = async (params) => {
            params.all = true;
            params.sorts = tableData.sortField.value;
            const res = await handleRequest(apiUrl.value, 'get', params);
            tableData.allData.value = res.data;
            return res;
        };

        const getData = async (params) => {
            // tableData.data.value = [];
            if (params) {
                params.sorts = tableData.sortField.value;
            }
            const res = await handleRequest(apiUrl.value, 'get', params);
            tableData.data.value = res.data.data;
            tableData.links.value = res.data.links;
            tableData.meta.value = res.data.meta;
            resetDialog();
            return res;
        };

        const getById = async (id, params) => {
            const res = await handleRequest(`${apiUrl.value}/${id}`, 'get', params);
            formData.form.value = res.data.data;
            formData.item.value = res.data.data;
            return res;
        };

        // get data section

        const handleDataOperation = (method, id = null) => {
            setLoadingState(true);
            return new Promise((resolve, reject) => {
                let requestData;
                if (method === 'createFormData' || method === 'updateFormData') {
                    requestData = new FormData();
                    Object.entries(formData.form.value).forEach(([key, value]) => {
                        requestData.append(key, value);
                    });
                } else {
                    requestData = formData.form.value;
                }

                const url = id ? `${apiUrl.value}/${id}` : apiUrl.value;
                const requestConfig = {
                    headers: method.includes('FormData')
                        ? { 'Content-Type': 'multipart/form-data' }
                        : null
                };

                axios[method](url, requestData, requestConfig)
                    .then((res) => {
                        setLoadingState(false);
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: tableData.meta.value?.per_page,
                            search: keyword.value,
                            sorts: tableData.sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        setLoadingState(false);
                        reject(err);
                    });
            });
        };

        const createData = () => handleDataOperation('post');
        const createFormData = () => handleDataOperation('postFormData');
        const updateData = () => handleDataOperation('put', formData.form.value.id);
        const updateFormData = () => handleDataOperation('putFormData', formData.form.value.id);

        // delete restore single action

        const handleDataAction = (id, action) => {
            setLoadingState(true);
            return new Promise((resolve, reject) => {
                const requestConfig =
                    action === 'force-delete'
                        ? { method: 'delete', url: `${apiUrl.value}/${id}/force-delete` }
                        : {
                              method: action === 'restore' ? 'get' : 'delete',
                              url:
                                  action === 'restore'
                                      ? `${apiUrl.value}/${id}/restore`
                                      : `${apiUrl.value}/${id}`
                          };

                axios(requestConfig)
                    .then((res) => {
                        setLoadingState(false);
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: tableData.meta.value.per_page,
                            search: keyword.value,
                            sorts: tableData.sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        setLoadingState(false);
                        reject(err);
                    });
            });
        };

        const destroyData = (id) => handleDataAction(id, 'delete');
        const restoreData = (id) => handleDataAction(id, 'restore');
        const deleteData = (id) => handleDataAction(id, 'force-delete');

        // multiple action

        const handleMultipleAction = (action) => {
            let data = formData.selectedData.value.map((val) => val.id);
            setLoadingState(true);
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiUrl.value}/${action}-multiple`, {
                        ids: data
                    })
                    .then((res) => {
                        setLoadingState(false);
                        formData.selectedData.value = null;
                        toast(res.data.message, {
                            type: 'success',
                            closeButton: false,
                            timeout: 3000
                        });
                        getData({
                            per_page: tableData.meta.value.per_page,
                            search: keyword.value,
                            sorts: tableData.sortField.value
                        });
                        resetDialog();
                        resolve(res);
                    })
                    .catch((err) => {
                        setLoadingState(false);
                        reject(err);
                    });
            });
        };

        const destroyMultiple = () => handleMultipleAction('destroy');
        const restoreMultiple = () => handleMultipleAction('restore');
        const deleteMultiple = () => handleMultipleAction('force-delete');

        // upload section

        const uploadFile = (file, url = 'upload/temporary') => {
            setLoadingState(true);

            const formData = new FormData();
            formData.append('file', file);

            return axios
                .post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((res) => {
                    setLoadingState(false);
                    return res;
                })
                .catch((err) => {
                    setLoadingState(false);
                    throw err;
                });
        };

        // export section

        const handleLoadingAndErrorDownload = (promise) => {
            isDownloading.value = true;
            return promise.finally(() => {
                isDownloading.value = false;
            });
        };

        const makeApiExportRequest = (url, responseType, params) => {
            return axios.get(url, { responseType, params });
        };

        const exportData = (type, params) => {
            return handleLoadingAndErrorDownload(
                makeApiExportRequest(`${apiUrl.value}/export/${type}`, 'blob', params)
                    .then((res) => {
                        const blob = new Blob([res.data]);
                        downloadBlobFile(blob, type);
                        return res;
                    })
                    .catch((err) => {
                        throw err;
                    })
            );
        };

        const downloadBlobFile = (blob, ext) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `data-${title.value}.${ext}`;
            a.click();
            window.URL.revokeObjectURL(url);
        };

        // dialogs

        const clearFormAndSelection = () => {
            formData.selectedData.value = [];
            formData.form.value = {};
        };

        const newData = () => {
            clearFormAndSelection();
            dialogs.formDialog.value = true;
        };

        const newUpload = () => {
            dialogs.uploadDialog.value = true;
        };

        const submitData = () => {
            formData.form.value.id ? updateData() : createData();
        };

        const submitFormData = () => {
            formData.form.value.id ? updateFormData() : createFormData();
        };

        const showData = (data) => {
            formData.item.value = { ...data };
            dialogs.detailDialog.value = true;
        };

        const editData = (data) => {
            formData.form.value = { ...data };
            dialogs.formDialog.value = true;
            formData.selectedData.value = [];
        };

        const confirmDestroyData = (data) => {
            formData.item.value = data;
            dialogs.destroyDataDialog.value = true;
            formData.selectedData.value = [];
        };

        const confirmRestoreData = (data) => {
            formData.item.value = data;
            dialogs.restoreDataDialog.value = true;
        };

        const confirmDeletePermanentData = (data) => {
            formData.item.value = data;
            dialogs.destroyPermanentDialog.value = true;
        };

        const confirmDeleteSelected = () => {
            dialogs.destroySelectedDialog.value = true;
        };

        const confirmRestoreSelected = () => {
            dialogs.restoreSelectedDialog.value = true;
        };

        const confirmDeletePermanentSelectedDialog = () => {
            dialogs.destroyPermanentSelectedDialog.value = true;
        };

        const confirmSelectField = () => {
            dialogs.selectFieldDialog.value = true;
        };

        const confirmExportData = () => {
            dialogs.exportDialog.value = true;
        };

        const checkEnableColumn = (field) => {
            const matchingItem = formData.selectedFields.value.find((item) => item.field === field);
            return matchingItem ? matchingItem.enable : true;
        };

        return {
            // trigger
            newData,
            submitData,
            showData,
            editData,
            confirmDestroyData,
            confirmRestoreData,
            confirmDeletePermanentData,
            confirmDeleteSelected,
            confirmRestoreSelected,
            confirmDeletePermanentSelectedDialog,
            confirmSelectField,
            confirmExportData,
            checkEnableColumn,

            onChangePage,
            onSortData,
            reloadData,
            getAll,
            getData,
            getById,
            createData,
            updateData,
            destroyData,
            restoreData,
            deleteData,
            destroyMultiple,
            restoreMultiple,
            deleteMultiple,

            uploadFile,
            // dialog
            resetDialog,
            newUpload,

            submitFormData,
            updateFormData,
            createFormData,

            exportData,

            resetTable,

            // state
            isDownloading,
            dt,
            apiUrl,
            title,
            permissions,
            tableData,
            formData,
            dialogs,

            keyword,
            debounceTime
        };
    },
    {
        persist: false
    }
);
