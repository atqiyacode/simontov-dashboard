<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'menu.home.index',
        items: [
            {
                label: 'menu.home.change-location',
                icon: 'pi pi-fw pi-map-marker',
                to: '/select-location'
            },
            {
                label: 'menu.home.realtime-chart',
                icon: 'pi pi-fw pi-chart-line',
                to: '/app/dashboard/realtime'
            },
            { label: 'Static', icon: 'pi pi-fw pi-chart-bar', to: '/app/dashboard/static' }
        ]
    },

    {
        label: 'menu.features.index',
        items: [
            {
                label: 'menu.features.mag-8000.index',
                items: [
                    {
                        label: 'menu.features.mag-8000.status-alarm',
                        to: '/app/feature/status-alarm'
                    },
                    {
                        label: 'menu.features.mag-8000.flow-meter',
                        to: '/app/feature/flowrate'
                    },
                    {
                        label: 'menu.features.mag-8000.topics',
                        to: '/app/feature/topic'
                    }
                ]
            },
            {
                label: 'menu.features.billing.index',
                items: [
                    {
                        label: 'menu.features.billing.range-type',
                        to: '/app/billing/range-type'
                    },
                    {
                        label: 'menu.features.billing.range-cost',
                        to: '/app/billing/range-cost'
                    }
                ]
            }
        ]
    },

    {
        label: 'menu.master-auth.index',
        items: [
            {
                label: 'menu.master-auth.permissions',
                icon: 'pi pi-fw pi-bookmark',
                to: '/app/master/permission'
            },
            {
                label: 'menu.master-auth.roles',
                icon: 'pi pi-fw pi-bookmark',
                to: '/app/master/role'
            }
        ]
    },
    {
        label: 'menu.master-data.index',
        items: [
            {
                label: 'menu.master-data.user',
                icon: 'pi pi-fw pi-users',
                to: '/app/master/user'
            },
            { label: 'Location', icon: 'pi pi-fw pi-map', to: '/app/master/location' },
            {
                label: 'menu.master-data.chart-type',
                icon: 'pi pi-fw pi-chart-bar',
                to: '/app/master/dashboard-chart'
            },
            {
                label: 'menu.master-data.tax',
                icon: 'pi pi-fw pi-cog',
                to: '/app/master/tax'
            }
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
