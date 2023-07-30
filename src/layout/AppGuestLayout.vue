<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted } from 'vue';
import { useUserStore } from '../services/user.store';
import AppConfig from '@/layout/AppConfig.vue';
import router from '../router';

const { layoutConfig, contextPath } = useLayout();

const userStore = useUserStore();

onMounted(() => {
    if (userStore.isLoggedIn && userStore.isVerified) {
        router.push({ name: 'dashboard' });
    }
});

const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'vepro' : 'vepro'}.png`;
});
</script>

<template>
    <ConfirmDialog :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '50vw' }" />
    <Toast position="top-center" />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center w-full">
            <router-link to="/">
                <img :src="logoUrl" alt="vepro" class="mb-5 w-15rem flex-shrink-0" />
            </router-link>
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
