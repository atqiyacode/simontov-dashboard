<script setup>
import { useCrudStore } from '@/services/crudStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const store = useCrudStore();
const route = useRoute();
const expandedRows = ref([]);

const { keyword } = storeToRefs(store);
onMounted(() => {
    store.$patch({
        title: 'Detail Job Vacancy Page',
        api: '/hr/jobVacancy'
    });
    store.get(route.params.id);
});
</script>

<template>
    <div className="grid">
        <div className="col-12">
            <div class="card mb-2">
                <Toolbar class="p-0">
                    <template v-slot:start>
                        <div class="my-0">
                            <h5>
                                {{ store.selected.title }}
                            </h5>
                        </div>
                    </template>
                    <template v-slot:end>
                        <div class="flex justify-content-between">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" placeholder="Keyword Search" />
                            </span>
                        </div>
                    </template>
                </Toolbar>
            </div>

            <div class="card" v-if="store.selected">
                <DataTable v-model:expandedRows="expandedRows" :value="store.selected.recruitments" dataKey="id" tableStyle="min-width: 60rem" stripedRows>
                    <Column expander style="width: 5rem" />
                    <Column field="nik" header="NIK"></Column>
                    <Column field="agama" header="Agama"></Column>
                    <Column field="nik" header="NIK"></Column>
                    <Column field="nik" header="NIK"></Column>
                    <Column field="nik" header="NIK"></Column>
                    <Column field="nik" header="NIK"></Column>
                    <Column field="nik" header="NIK"></Column>
                    <template #expansion="slotProps">
                        <div class="card bg-blue-400">
                            <h5>Detail</h5>
                            <p>
                                Agama : <span class="font-bold">{{ slotProps.data.agama }}</span>
                            </p>
                            <p>
                                Agama : <span class="font-bold">{{ slotProps.data.agama }}</span>
                            </p>
                            <p>
                                Agama : <span class="font-bold">{{ slotProps.data.agama }}</span>
                            </p>
                            <p>
                                Agama : <span class="font-bold">{{ slotProps.data.agama }}</span>
                            </p>
                        </div>
                    </template>
                </DataTable>
                <Toast />
            </div>
        </div>
    </div>
</template>
