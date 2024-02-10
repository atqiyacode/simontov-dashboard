<script setup>
import { onMounted } from 'vue';

import { useMainStore } from '@/services/main.store';
import { useInvoiceStore } from '@/services/master/Invoice.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const InvoiceStore = useInvoiceStore();

const { invoice, title } = storeToRefs(InvoiceStore);

const { loading, errors } = storeToRefs(mainStore);

const { getData, updateData } = InvoiceStore;

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-fluid">
                <Toolbar class="mb-3">
                    <template v-slot:start>
                        <div class="my-0">
                            <h5>
                                {{ title }}
                            </h5>
                        </div>
                    </template>
                    <template v-slot:end>
                        <div class="my-0">
                            <Button
                                @click="updateData()"
                                label="Save"
                                :loading="loading"
                                v-tooltip.top="$t('button.save')"
                                icon="pi pi-check"
                                class="p-button-sm mr-1"
                                severity="success"
                            />
                        </div>
                    </template>
                </Toolbar>
                <div class="field">
                    <label class="font-bold" for="value"> Company name </label>
                    <InputText
                        required
                        id="value"
                        type="text"
                        v-model="invoice.company_name"
                        :class="{ 'p-invalid': errors.company_name }"
                        placeholder="Company name"
                    />
                    <small class="text-sm p-error" v-if="errors?.company_name">{{
                        errors?.company_name[0]
                    }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> Company address </label>
                    <InputText
                        required
                        id="value"
                        type="text"
                        v-model="invoice.company_address"
                        :class="{ 'p-invalid': errors.company_address }"
                        placeholder="Company address"
                    />
                    <small class="text-sm p-error" v-if="errors?.company_address">{{
                        errors?.company_address[0]
                    }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> Company phone </label>
                    <InputText
                        required
                        id="value"
                        type="text"
                        v-model="invoice.phone"
                        :class="{ 'p-invalid': errors.phone }"
                        placeholder="Company phone"
                    />
                    <small class="text-sm p-error" v-if="errors?.phone">{{
                        errors?.phone[0]
                    }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> Company fax </label>
                    <InputText
                        required
                        id="value"
                        type="text"
                        v-model="invoice.fax"
                        :class="{ 'p-invalid': errors.fax }"
                        placeholder="Company fax"
                    />
                    <small class="text-sm p-error" v-if="errors?.fax">{{ errors?.fax[0] }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> Company npwp </label>
                    <InputText
                        required
                        id="value"
                        type="text"
                        v-model="invoice.npwp"
                        :class="{ 'p-invalid': errors.npwp }"
                        placeholder="Company npwp"
                    />
                    <small class="text-sm p-error" v-if="errors?.npwp">{{ errors?.npwp[0] }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> Company Manager Name </label>
                    <InputText
                        required
                        id="value"
                        type="text"
                        v-model="invoice.manager_name"
                        :class="{ 'p-invalid': errors.manager_name }"
                        placeholder="Company Manager Name"
                    />
                    <small class="text-sm p-error" v-if="errors?.manager_name">{{
                        errors?.manager_name[0]
                    }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> additional section </label>
                    <Editor
                        required
                        id="value"
                        type="text"
                        v-model="invoice.additional_section"
                        :class="{ 'p-invalid': errors.additional_section }"
                        placeholder="Company additional_section"
                    />
                    <small class="text-sm p-error" v-if="errors?.additional_section">{{
                        errors?.additional_section[0]
                    }}</small>
                </div>
                <div class="field">
                    <label class="font-bold" for="value"> note </label>
                    <Editor
                        required
                        id="value"
                        type="text"
                        v-model="invoice.note"
                        :class="{ 'p-invalid': errors.note }"
                        placeholder="Company note"
                    />
                    <small class="text-sm p-error" v-if="errors?.note">{{ errors?.note[0] }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
