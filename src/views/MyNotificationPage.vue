<script setup>
import { ref } from 'vue';

const tabs = ref([
    { title: 'Title 1', content: 'Content 1' },
    { title: 'Title 2', content: 'Content 2' },
    { title: 'Title 3', content: 'Content 3' }
]);
</script>

<template>
    <div class="card">
        <Accordion :activeIndex="0">
            <AccordionTab v-for="tab in tabs" :key="tab.title" :header="tab.title" class="mb-3">
                <p class="m-0">{{ tab.content }}</p>
            </AccordionTab>
        </Accordion>

        <Panel
            toggleable
            v-for="(item, index) in 10"
            :key="index"
            class="mb-3 shadow-3"
            :collapsed="true"
        >
            <template #header>
                <div class="flex align-items-center gap-2">
                    <span class="font-bold"> Notification title </span>
                </div>
            </template>
            <template #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                    <div class="flex align-items-center gap-2">
                        <Button icon="pi pi-user" rounded text></Button>
                        <Button icon="pi pi-bookmark" severity="secondary" rounded text></Button>
                    </div>
                    <span class="p-text-secondary">Updated 2 hours ago</span>
                </div>
            </template>
            <template #icons>
                <Menu ref="menu" id="config_menu" :model="items" popup />
            </template>
            <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>
        </Panel>

        <Message
            :closable="false"
            severity="warn"
            class="shadow-3"
            v-for="(item, index) in 10"
            :key="index"
        >
            <template #messageicon>
                <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
            </template>
            <span class="ml-2">How may I help you?</span>
        </Message>
    </div>
    <ul class="list-none p-0">
        <ListDetailBreak label="1." value="Data tidak masuk dalam 3 menit" />
        <ListDetailBreak label="2." value="Nilai totalizer tidak ada perubahan dalam 12 jam" />
        <ListDetailBreak label="3." value="Nilai COD diatas 90 mg/l" />
        <ListDetailBreak label="4." value="Nilai PH dibawah 6 atau diatas 9" />
        <ListDetailBreak label="5." value="Listrik menggunkan UPS" />
    </ul>
</template>
