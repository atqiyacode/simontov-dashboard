<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/services/user.store';
import AppMenuItem from './AppMenuItem.vue';
const userStore = useUserStore();
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
            { label: 'Static', icon: 'pi pi-fw pi-chart-bar', to: '/app/dashboard/static' },
            {
                icon: 'pi pi-fw pi-bookmark',
                label: 'menu.features.mag-8000.flow-meter',
                to: '/app/feature/flowrate'
            }
        ]
    },

    {
        label: 'menu.features.index',
        roles: ['superman'],
        items: [
            {
                label: 'menu.features.mag-8000.index',
                items: [
                    {
                        label: 'menu.features.mag-8000.status-alarm',
                        to: '/app/feature/status-alarm'
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
        roles: ['superman'],
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
                roles: ['superman'],
                label: 'menu.master-data.user',
                icon: 'pi pi-fw pi-users',
                to: '/app/master/user'
            },
            {
                roles: ['superman'],
                label: 'Location',
                icon: 'pi pi-fw pi-map',
                to: '/app/master/location'
            },
            {
                roles: ['superman'],
                label: 'menu.master-data.chart-type',
                icon: 'pi pi-fw pi-chart-bar',
                to: '/app/master/dashboard-chart'
            },
            {
                roles: ['superman'],
                label: 'Alert Type',
                icon: 'pi pi-fw pi-bell',
                to: '/app/master/alert-notification-type'
            },
            {
                roles: ['superman'],
                label: 'Location Notification',
                icon: 'pi pi-fw pi-bell',
                to: '/app/master/location-notification'
            },
            {
                roles: ['superman'],
                label: 'menu.master-data.tax',
                icon: 'pi pi-fw pi-cog',
                to: '/app/master/tax'
            },
            {
                roles: ['superman'],
                label: 'Invoice Template',
                icon: 'pi pi-fw pi-book',
                to: '/app/master/invoice-template'
            }
        ]
    }
]);

const shouldRenderItem = (item) => {
    if (!item.roles || userStore.hasAnyRole(item.roles)) {
        if (item.items) {
            // Check if any of the sub-menu items should be rendered
            return item.items.some((subItem) => shouldRenderItem(subItem));
        } else if (item.to) {
            // Render the item if it's a leaf node (has a "to" property)
            return true;
        }
    }
    // If roles are defined and the user doesn't have the necessary roles, or if roles are not defined, don't render the item
    return false;
};
</script>

<template>
    <ul class="layout-menu" style="padding: 0.5rem 1.5rem">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="shouldRenderItem(item)" :item="item" :index="i"></app-menu-item>
            <!-- <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item> -->
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
