<script setup>
import { useCrudStore } from '@/services/crud.store';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const store = useCrudStore();
const route = useRoute();
const expandedRows = ref([]);

const { keyword, detailData } = storeToRefs(store);

onMounted(() => {
    store.$patch({
        title: 'Detail Job Vacancy Page',
        api: '/hr/jobVacancy'
    });
    store.get(route.params.id);
});
</script>

<template>
    <div className="grid" v-if="detailData">
        <div className="col-12">
            <div class="card mb-2">
                <Toolbar class="p-0">
                    <template v-slot:start>
                        <div class="my-0">
                            <h5>
                                {{ detailData?.title }}
                            </h5>
                            <p>{{ detailData.recruitment_count }} Pelamar</p>
                        </div>
                    </template>
                    <template v-slot:end>
                        <div class="flex justify-content-between">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" :placeholder="$t('header.search')" />
                            </span>
                        </div>
                    </template>
                </Toolbar>
            </div>

            <div class="card">
                <DataTable v-model:expandedRows="expandedRows" :value="detailData?.recruitments" dataKey="id" tableStyle="min-width: 60rem" stripedRows>
                    <Column expander style="width: 5rem" />
                    <Column header="Status">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status ? 'true' : 'false'" :severity="slotProps.data.status ? 'success' : 'warning'"> </Tag>
                        </template>
                    </Column>
                    <Column field="nik" header="NIK"></Column>
                    <Column field="name" header="Nama Lengkap"></Column>
                    <Column field="jenis_kelamin" header="Jenis Kelamin"></Column>
                    <Column field="age" header="Usia (th)"></Column>
                    <Column field="pendidikan_terakhir" header="Pendidikan terakhir"></Column>
                    <Column field="universitas" header="Universitas/Perguruan Tinggi"></Column>
                    <Column field="jurusan_pendidikan" header="Jurusan"></Column>
                    <Column field="total_pengalaman_kerja" header="Pengalaman (bulan)"></Column>
                    <Column class="text-center">
                        <template #header>
                            <div class="flex-1 text-center">{{ $t('table.action') }}</div>
                        </template>
                        <template #body="slotProps">
                            <Button class="p-button-sm p-button-rounded p-button-outlined mx-1 p-button-primary" icon="pi pi-check" v-tooltip.top="$t('button.process')" @click="$emit('restore', slotProps.data), (selectedData = false)" />
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <h5>Detail</h5>
                        <div class="grid">
                            <div class="col-12 md:col-6 lg:col-4">
                                <div class="p-3 card font-bold h-full">
                                    <ul class="list-none p-0 m-0">
                                        <ListDetailBreak label="NIK" :value="slotProps.data.nik" />
                                        <ListDetailBreak label="Nama Lengkap" :value="slotProps.data.name" />
                                        <ListDetailBreak label="Agama" :value="slotProps.data.agama" />
                                        <ListDetailBreak label="Usia" :value="slotProps.data.agama" />
                                        <ListDetailBreak label="Tempat Lahir" :value="slotProps.data.tempat_lahir" />
                                        <ListDetailBreak label="Tanggal Lahir" :value="slotProps.data.tanggal_lahir" />
                                        <ListDetailBreak label="Alamat (KTP)" :value="slotProps.data.alamat_ktp" />
                                        <ListDetailBreak label="Alamat (Domisili)" :value="slotProps.data.alamat_domisili" />
                                    </ul>
                                </div>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4">
                                <div class="p-3 card font-bold h-full">
                                    <ul class="list-none p-0 m-0">
                                        <ListDetailBreak label="Pendidikan Terakhir" :value="slotProps.data.pendidikan_terakhir" />
                                        <ListDetailBreak label="Jurusan Pendidikan" :value="slotProps.data.jurusan_pendidikan" />
                                        <ListDetailBreak label="PTN/PTS" :value="slotProps.data.ptn_pts" />
                                        <ListDetailBreak label="Universitas" :value="slotProps.data.universitas" />
                                        <ListDetailBreak label="NPM" :value="slotProps.data.npm" />
                                        <ListDetailBreak label="IPK" :value="slotProps.data.ipk" />
                                        <ListDetailBreak label="Tahun Masuk D3" :value="slotProps.data.tahun_masuk_kuliah_d3" />
                                        <ListDetailBreak label="Tahun Lulus D3" :value="slotProps.data.tahun_lulus_kuliah_d3" />
                                        <ListDetailBreak label="Tahun Masuk S1" :value="slotProps.data.tahun_masuk_kuliah_s1" />
                                        <ListDetailBreak label="Tahun Lulus S1" :value="slotProps.data.tahun_lulus_kuliah_s1" />
                                    </ul>
                                </div>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4">
                                <div class="p-3 card font-bold h-full">
                                    <ul class="list-none p-0 m-0">
                                        <ListDetailBreak label="jumlah pengalaman lulus d3 dengan surat referensi" :value="slotProps.data.jumlah_pengalaman_lulus_d3_dengan_surat_referensi" />
                                        <ListDetailBreak label="jumlah pengalaman lulus d3 tanpa surat referensi" :value="slotProps.data.jumlah_pengalaman_lulus_d3_tanpa_surat_referensi" />
                                        <ListDetailBreak label="jumlah pengalaman lulus s1 dengan surat referensi" :value="slotProps.data.jumlah_pengalaman_lulus_s1_dengan_surat_referensi" />
                                        <ListDetailBreak label="jumlah pengalaman lulus s1 tanpa surat referensi" :value="slotProps.data.jumlah_pengalaman_lulus_s1_tanpa_surat_referensi" />
                                        <ListDetailBreak label="total pengalaman kerja" :value="slotProps.data.total_pengalaman_kerja" />
                                    </ul>
                                </div>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4" v-if="slotProps.data.others_field">
                                <div class="p-3 card font-bold">
                                    <h5>others</h5>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataTable>
                <Toast />
            </div>
        </div>
    </div>
</template>
