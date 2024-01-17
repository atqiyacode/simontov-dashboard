<script setup>
const props = defineProps({
    selectedFields: {
        type: Array,
        default: null
    },
    show: {
        default: false,
        type: Boolean
    },
    loading: Boolean
});
defineEmits(['close']);
</script>

<template>
    <Dialog
        :visible="props.show"
        :style="{ width: '450px' }"
        header="Tampilan Data"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <template v-for="(item, index) in selectedFields" :key="index">
            <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-between my-5"
            >
                <label for="index">
                    {{ removeUnderscore(item.field) }}
                </label>
                <InputSwitch inputId="index" v-model="item.enable" value="{{ item.enable }}" />
            </div>
        </template>
        <template #footer>
            <Button
                :disabled="loading"
                :label="$t('button.close')"
                icon="pi pi-times"
                text
                @click="$emit('close', $event)"
            />
        </template>
    </Dialog>
</template>
