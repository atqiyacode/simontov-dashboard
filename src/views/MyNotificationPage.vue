<script setup>
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore();

const { notifications } = storeToRefs(mainStore);
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
    <div v-for="(notification, index) in notifications" :key="index" class="card mb-2 bg-red-400">
        <h4 class="text-white">
            <i class="pi pi-bell" style="font-size: 1.5rem"></i>
            {{ notification.message }}
        </h4>
        <p class="text-white">
            <i class="pi pi-calendar"></i>
            {{ notification.created_at }}
        </p>
    </div>
</template>
