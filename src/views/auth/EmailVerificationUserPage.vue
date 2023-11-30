<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/services/auth.store';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { layoutConfig, contextPath } = useLayout();

onMounted(() => {
    if (!route.query.url) {
        router.push({ name: 'login' });
    } else {
        authStore.verifyEmail(route.query.url).then(() => {
            setTimeout(() => {
                router.push({ name: 'dashboard' });
            }, 3000);
        });
    }
});

const logoUrl = computed(() => {
    return `${contextPath}logo/${
        layoutConfig.darkTheme.value
            ? 'simontov-logo-horizontal-white-text'
            : 'simontov-logo-horizontal'
    }.png`;
});
</script>

<template>
    <ConfirmDialog
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '50vw' }"
    />
    <Toast position="top-center" />
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden shadow-5"
    >
        <div class="flex flex-column align-items-center justify-content-center w-full">
            <router-link to="/">
                <img :src="logoUrl" alt="main-logo" class="mb-5 w-15rem flex-shrink-0" />
            </router-link>
            <i class="pi pi-spin pi-spinner m-5 text-blue-800" style="font-size: 10rem"></i>
        </div>
    </div>
    <AppConfig simple />
</template>
