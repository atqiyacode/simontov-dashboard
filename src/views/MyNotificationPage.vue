<script setup>
import { ref } from 'vue';
import { useMainStore } from '@/services/main.store';
const mainStore = useMainStore();
const tabs = ref([
    { title: 'Title 1', content: 'Content 1' },
    { title: 'Title 2', content: 'Content 2' },
    { title: 'Title 3', content: 'Content 3' }
]);
</script>

<template>
    <ul class="list-none p-0 m-0">
        <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
        >
            <div>
                <h5 class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize">
                    {{ mainStore.currentMap?.name }} - {{ mainStore.currentMap?.company_name }}
                </h5>
            </div>
        </li>
    </ul>
    <Card
        v-for="tab in tabs"
        :key="tab.title"
        :header="tab.title"
        class="mb-3 shadow-3 bg-yellow-200"
    >
        <template #title>
            <i class="pi pi-bell" style="font-size: 1.5rem"></i>
            NOTIFICATION
        </template>
        <template #subtitle> Card subtitle </template>
        <template #content>
            <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam
                nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
            </p>
        </template>
        <template #footer>
            <Button icon="pi pi-check" label="Save" />
            <Button
                icon="pi pi-times"
                label="Cancel"
                severity="secondary"
                style="margin-left: 0.5em"
            />
        </template>
    </Card>

    <ul class="list-none p-0">
        <ListDetailBreak label="1." value="Data tidak masuk dalam 3 menit" />
        <ListDetailBreak label="2." value="Nilai totalizer tidak ada perubahan dalam 12 jam" />
        <ListDetailBreak label="3." value="Nilai COD diatas 90 mg/l" />
        <ListDetailBreak label="4." value="Nilai PH dibawah 6 atau diatas 9" />
        <ListDetailBreak label="5." value="Listrik menggunkan UPS" />
    </ul>
</template>
