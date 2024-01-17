<script setup>
import { ref } from 'vue';
import { useGlobalStore } from '@/services/global.store';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/services/main.store';

const GlobalStore = useGlobalStore();
const MainStore = useMainStore();

const props = defineProps({
    header: {
        default: 'No Header',
        type: String
    },
    show: {
        default: false,
        type: Boolean
    },
    options: {
        default: () => ['csv', 'json', 'xls', 'xlsx'],
        type: Array
    },
    loading: Boolean
});
defineEmits(['close']);

const { exportData } = GlobalStore;
const { error } = storeToRefs(MainStore);

const optionValue = ref(null);

const onSubmitExport = () => {
    exportData(optionValue.value);
};
</script>

<template>
    <Dialog
        :visible="props.show"
        :style="{ width: '450px' }"
        :header="$t('header.export')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div v-for="option in props.options" :key="option" style="cursor: pointer">
            <div class="card flex align-items-center mb-3" @click="optionValue = option">
                <RadioButton v-model="optionValue" :inputId="option" :value="option" />
                <label :for="option" class="ml-2">
                    <b class="uppercase">{{ option }}</b>
                    <p v-if="error && option === optionValue" class="text-red-500">
                        {{ error }}
                    </p>
                </label>
            </div>
        </div>

        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.close')"
                icon="pi pi-times"
                text
                @click="$emit('close', $event), (optionValue = null)"
            />
            <Button
                :disabled="loading || optionValue == null"
                :loading="loading"
                :label="$t('button.export')"
                icon="pi pi-download"
                severity="success"
                @click="onSubmitExport()"
            />
        </template>
    </Dialog>
</template>
