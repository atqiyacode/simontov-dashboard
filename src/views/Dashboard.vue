<script setup>
import { ref } from 'vue';
import RealtimeChartPage from './chart/RealtimeChartPage.vue';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const { currentMap, dashboard } = storeToRefs(mainStore);
const formDialog = ref(false);
</script>

<template>
    <ul class="list-none p-0 m-0">
        <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
        >
            <div>
                <h5
                    class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize"
                    :class="styleLabel"
                >
                    {{ currentMap?.name }}
                </h5>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <Button
                    icon="pi pi-cog"
                    severity="info"
                    label="Settings"
                    @click="formDialog = true"
                />
            </div>
        </li>
    </ul>
    <div class="grid">
        <RealtimeChartPage />
    </div>

    <Dialog
        v-model:visible="formDialog"
        :style="{ width: '640px' }"
        :header="Setting"
        :modal="true"
        :closable="false"
        class="p-fluid"
    >
        <div class="card">
            <ul class="list-none p-0 m-0">
                <li
                    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                >
                    <div>
                        <span
                            class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize"
                            :class="styleLabel"
                        >
                            Show Map Location
                        </span>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                        <InputSwitch v-model="dashboard.showMap" />
                    </div>
                </li>
            </ul>
        </div>

        <template #footer>
            <Button
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-rounded p-button-text"
                @click="formDialog = false"
            />
        </template>
    </Dialog>
</template>
