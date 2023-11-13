<script setup>
import { ref } from 'vue';

const url = import.meta.env.VITE_APP_API;
const mainUrl = url.split(['/']);

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Master Data',
        items: [
            {
                label: 'Authentication',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { label: 'Permission', to: '/app/master/main/permission' },
                    { label: 'Role', to: '/app/master/main/role' },
                    {
                        label: 'Verification Code Type',
                        to: '/app/master/main/verification-code-type'
                    },
                    { label: 'Auth Method', to: '/app/master/main/auth-verification-method' },
                    { label: 'Global Status', to: '/app/master/main/global-status' },
                    { label: 'Notification Type', to: '/app/master/main/notification-type' },
                    { label: 'Department', to: '/app/master/main/department' }
                ]
            },
            {
                label: 'Mobile App',
                icon: 'pi pi-fw pi-mobile',
                items: [
                    { label: 'App Server Status', to: '/app/master/mobile/server-status' },
                    { label: 'Device Type', to: '/app/master/mobile/device-type' },
                    { label: 'App Version', to: '/app/master/mobile/version' },
                    { label: 'App Menu', to: '/app/master/mobile/menu' }
                ]
            },
            {
                label: 'Account',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'User Verification Code',
                        to: '/app/master/account/user-verification-code'
                    },
                    { label: 'User', to: '/app/master/account/user' }
                ]
            },
            {
                label: 'Level of Education',
                icon: 'pi pi-fw pi-user',
                to: '/app/master/level-of-education'
            },
            {
                label: 'Religion',
                icon: 'pi pi-fw pi-book',
                to: '/app/master/religion'
            },
            {
                label: 'Gender',
                icon: 'pi pi-fw pi-user-plus',
                to: '/app/master/gender'
            },
            {
                label: 'Recruitment Step',
                icon: 'pi pi-fw pi-briefcase',
                to: '/app/master/recruitment-step'
            },
            {
                label: 'Company Information',
                icon: 'pi pi-fw pi-building',
                to: '/app/master/company-information'
            },
            {
                label: 'Golongan',
                icon: 'pi pi-fw pi-sitemap',
                to: '/app/master/golongan'
            },
            {
                label: 'Employee Unit',
                icon: 'pi pi-fw pi-building',
                to: '/app/master/employee-unit'
            }
        ]
    },
    {
        label: 'Modules',
        items: [
            {
                label: 'HR SDM',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    { label: 'Position', to: '/app/master/hr/position' },
                    { label: 'Employee', to: '/app/master/hr/employee' },
                    { label: 'Employee Contract', to: '/app/master/hr/employee-contract' },

                    {
                        label: 'Recruitment',
                        items: [
                            { label: 'Applicant', to: '/app/master/hr/recruitment/applicant' },
                            { label: 'Project', to: '/app/master/hr/recruitment/project' },
                            { label: 'Job vacancy', to: '/app/master/hr/recruitment/job-vacancy' },
                            {
                                label: 'Question Pra Registration',
                                to: '/app/master/hr/recruitment/question-pra-registration'
                            }
                        ]
                    },
                    {
                        label: 'Permit',
                        items: [
                            { label: 'Type of Permit', to: '/app/master/hr/permit/type' },
                            {
                                label: 'Child of Type Permit',
                                to: '/app/master/hr/permit/type-child'
                            },
                            {
                                label: 'Permit Apply Status',
                                to: '/app/master/hr/permit/application-status'
                            }
                        ]
                    },
                    { label: 'Employee Permit', to: '/app/master/hr/permit/employee' },
                    {
                        label: 'Employee Permit Structure',
                        to: '/app/master/hr/permit/employee-permit-structure'
                    }
                ]
            }
        ]
    },
    {
        label: 'Developer',
        items: [
            {
                label: 'Tools',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Laravel ERD',
                        icon: 'pi pi-fw pi-book',
                        url: `${mainUrl[0]}//${mainUrl[2]}/erd`,
                        target: '_blank'
                    },
                    {
                        label: 'Prequel DB',
                        icon: 'pi pi-fw pi-database',
                        url: `${mainUrl[0]}//${mainUrl[2]}/prequel`,
                        target: '_blank'
                    },
                    {
                        label: 'Route List',
                        icon: 'pi pi-fw pi-link',
                        url: `${mainUrl[0]}//${mainUrl[2]}/routes`,
                        target: '_blank'
                    },
                    {
                        label: 'Logs Viewer',
                        icon: 'pi pi-fw pi-server',
                        url: `${mainUrl[0]}//${mainUrl[2]}/log-viewer`,
                        target: '_blank'
                    },
                    {
                        label: 'User Activity',
                        icon: 'pi pi-fw pi-history',
                        url: `${mainUrl[0]}//${mainUrl[2]}/admin/user-activity`,
                        target: '_blank'
                    },
                    {
                        label: 'Telescope',
                        icon: 'pi pi-fw pi-history',
                        url: `${mainUrl[0]}//${mainUrl[2]}/telescope`,
                        target: '_blank'
                    }
                ]
            }
        ]
    },
    {
        label: 'Others',
        items: [
            {
                label: 'FAQ',
                icon: 'pi pi-fw pi-cog',
                to: '/app/master/others/faq'
            },
            {
                label: 'Terms & Conditions',
                icon: 'pi pi-fw pi-info-circle',
                to: '/app/master/others/terms-and-conditions'
            },
            {
                label: 'Privacy & Policy',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/app/master/others/privacy-and-policy'
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
