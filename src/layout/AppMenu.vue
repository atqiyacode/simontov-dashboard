<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Ganti Lokasi', icon: 'pi pi-fw pi-map-marker', to: '/select-location' },
            { label: 'Realtime', icon: 'pi pi-fw pi-chart-line', to: '/app/dashboard/realtime' },
            { label: 'Static', icon: 'pi pi-fw pi-chart-bar', to: '/app/dashboard/static' }
        ]
    },

    {
        label: 'Features',
        items: [
            {
                label: 'MAG 8000',
                items: [
                    {
                        label: 'Status Alarm',
                        to: '/app/feature/status-alarm'
                    },
                    { label: 'Flowrate', to: '/app/feature/flowrate' }
                ]
            },
            {
                label: 'Billing',
                items: [
                    { label: 'Range Type', to: '/app/billing/range-type' },
                    { label: 'Range Cost', to: '/app/billing/range-cost' }
                ]
            }
        ]
    },
    {
        label: 'Master Data',
        items: [
            {
                label: 'Permission',
                icon: 'pi pi-fw pi-bookmark',
                to: '/app/master/permission'
            },
            { label: 'Role', icon: 'pi pi-fw pi-bookmark', to: '/app/master/role' },
            { label: 'User', icon: 'pi pi-fw pi-users', to: '/app/master/user' },
            { label: 'Location', icon: 'pi pi-fw pi-map', to: '/app/master/location' },
            { label: 'Biaya Admin', icon: 'pi pi-fw pi-cog', to: '/app/master/tax' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu" style="padding: 0.5rem 1.5rem">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
