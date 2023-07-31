<script setup>
import { ref } from 'vue';

const url = import.meta.env.VITE_APP_API;
const mainUrl = url.split(['/']);

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Master Data',
        items: [
            {
                label: 'Authentication',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    { label: 'Permission', to: '/master/main/permission' },
                    { label: 'Role', to: '/master/main/role' }
                ]
            },
            {
                label: 'Account',
                icon: 'pi pi-fw pi-bookmark',
                items: [{ label: 'User', to: '/master/account/user' }]
            }
        ]
    },
    {
        label: 'Features',
        items: [
            { label: 'Status Alarm', to: '/feature/status-alarm' },
            { label: 'Flowrate', to: '/feature/flowrate' }
        ]
    },
    {
        label: 'Developer',
        items: [
            {
                label: 'Tools',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    { label: 'Laravel ERD', icon: 'pi pi-fw pi-book', url: `${mainUrl[0]}//${mainUrl[2]}/erd`, target: '_blank' },
                    { label: 'Prequel DB', icon: 'pi pi-fw pi-database', url: `${mainUrl[0]}//${mainUrl[2]}/prequel`, target: '_blank' },
                    { label: 'Route List', icon: 'pi pi-fw pi-link', url: `${mainUrl[0]}//${mainUrl[2]}/routes`, target: '_blank' },
                    { label: 'Logs Viewer', icon: 'pi pi-fw pi-server', url: `${mainUrl[0]}//${mainUrl[2]}/log-viewer`, target: '_blank' },
                    { label: 'User Activity', icon: 'pi pi-fw pi-history', url: `${mainUrl[0]}//${mainUrl[2]}/admin/user-activity`, target: '_blank' },
                    { label: 'Telescope', icon: 'pi pi-fw pi-history', url: `${mainUrl[0]}//${mainUrl[2]}/telescope`, target: '_blank' }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
