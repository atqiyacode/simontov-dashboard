<script setup>
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCrudStore } from '@/services/crud.store';

const store = useCrudStore();

const { hideDialog, getData, filterSearch, onChangePage, processData, destroyData, onCreate, showDetail, confirmDelete, onRestore, onDestroy, restoreData, deleteData } = store;

const { keyword, deleteDialog, detailDialog, restoreDialog, destroyDialog, formDialog, errors, form, data, meta, rowsPerPage, loading, selected, formLabel, tableBody, api, title } = storeToRefs(store);

// mounted
onMounted(() => {
    title.value = 'User Verification Code Page';
    api.value = '/master/userVerificationCode';
    tableBody.value = [
        { label: 'verification type', value: 'verification_code_type', type: 'object', object: 'name', sort: true },
        { label: 'token', value: 'token_code', type: 'text', sort: true },
        { label: 'username', value: 'user', type: 'object', object: 'username', sort: true }
    ];
    getData();
});

// onUnMounted
onUnmounted(() => {
    store.$reset();
});
</script>

<template>
    <CustomDataTable
        :label="title"
        :loading="loading"
        :data="data"
        :meta="meta"
        :rowsPerPage="rowsPerPage"
        :keyword="keyword"
        :tableBody="tableBody"
        :canSelectMultiple="false"
        :canRestore="true"
        :canCreate="false"
        :canEdit="false"
        @search="filterSearch($event)"
        @create="onCreate()"
        @show="showDetail($event)"
        @edit="onEdit($event)"
        @destroy="confirmDelete($event)"
        @changePage="onChangePage($event)"
        @restore="onRestore($event)"
        @deletePermanent="onDestroy($event)"
    />
    <!-- dialog form -->
    <Dialog v-model:visible="formDialog" :style="{ width: '640px' }" :header="formLabel" :modal="true" :closable="false" class="p-fluid">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <div class="mb-4 field col-12">
                    <span class="p-float-label">
                        <InputText required id="name" type="text" v-model="form.name" :class="{ 'p-invalid': errors.name }" placeholder="Name" />
                        <InputLabel value="name" />
                    </span>
                    <InputError :message="errors.name" />
                </div>
            </div>
        </div>

        <template #footer>
            <form @submit.prevent="processData">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog" />
                <Button :loading="loading" type="submit" :label="$t('button.process')" icon="pi pi-check" class="p-button-rounded p-button-success" />
            </form>
        </template>
    </Dialog>
    <!-- end dialog form -->
    <!-- dialog detail -->
    <Dialog v-model:visible="detailDialog" :style="{ width: '640px' }" header="Detail" :modal="true" :closable="false" class="p-fluid">
        <div class="card" v-if="selected">
            <ul class="list-none p-0 m-0">
                <ListDetailBreak label="name" :value="selected.user.name" />
                <ListDetailBreak label="email" :value="selected.user.email" />
                <ListDetailBreak label="username" :value="selected.user.username" />
                <ListDetailBreak label="verification code type" :value="selected.verification_code_type.name" />
                <ListDetailBreak label="token" :value="selected.token_code" />
                <ListDetailBreak label="created" :value="selected.created_at.full_date" />
                <ListDetailBreak label="expired" :value="selected.expired_at.full_date" />
                <li class="mb-4">
                    <div>
                        <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">Status</p>
                    </div>
                    <div class="mt-2">
                        <Tag :severity="selected.is_expired ? 'danger' : 'primary'" :value="selected.is_expired ? 'Expired' : 'Active'"></Tag>
                    </div>
                </li>
            </ul>
        </div>

        <template #footer>
            <Button :label="$t('button.close')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
            <Button :label="$t('button.delete-data')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(selected)" />
        </template>
    </Dialog>
    <!-- end dialog detail -->
    <!-- delete dialog -->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <DeleteDialog :data="selected.token_code" />
        <template #footer>
            <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-text" @click="hideDialog()" />
            <Button :loading="loading" :label="$t('button.yes-delete')" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="destroyData(selected)" />
        </template>
    </Dialog>
    <!-- end delete dialog -->

    <!-- restore dialog -->
    <Dialog v-model:visible="restoreDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <RestoreDialog :data="selected.token_code" />
        <template #footer>
            <form @submit.prevent="restoreData(selected)">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" :label="$t('button.yes-restore')" icon="pi pi-check" class="p-button-rounded p-button-warning" />
            </form>
        </template>
    </Dialog>
    <!-- end restore dialog -->
    <!-- delete permanent dialog -->
    <Dialog v-model:visible="destroyDialog" :style="{ width: '450px' }" :header="$t('alert.confirmation')" :modal="true" :closable="false">
        <DeleteDialog :data="selected.token_code" />
        <template #footer>
            <form @submit.prevent="deleteData(selected)">
                <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-text" @click="hideDialog()" />
                <Button :loading="loading" type="submit" :label="$t('button.yes-destroy')" icon="pi pi-check" class="p-button-rounded p-button-danger" />
            </form>
        </template>
    </Dialog>
    <!-- end delete permanent dialog -->
</template>
