<script setup>
import { useAuthStore } from '@/services/auth.store';
import { useMainStore } from '@/services/main.store';
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/services/user.store';
import AppConfig from '@/layout/AppConfig.vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const { layoutConfig, contextPath } = useLayout();

const route = useRoute();
const authStore = useAuthStore();
const mainStore = useMainStore();
const userStore = useUserStore();

const { verifyEmailAddress } = authStore;
const { loading, message } = storeToRefs(mainStore);

onMounted(() => {
    if (userStore.isLoggedIn && userStore.isVerified) {
        // mainStore.router.push({ name: 'dashboard' });
    } else {
        //
    }
    verifyEmailAddress(route.query.url);
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
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                        <div class="text-center mb-5 px-6">
                            <div class="text-900 text-3xl font-medium mb-3 capitalize text-green-400" v-if="message">{{ message }}</div>
                            <div class="col-12 mt-5 text-center">
                                <router-link to="/" class="p-button p-button-help">
                                    <i class="pi pi-home mr-3"></i>
                                    Dashboard
                                </router-link>
                            </div>
                        </div>
                        <div class="text-center mb-5 px-6" v-if="loading">
                            <p class="text-600 font-medium">Checking Your Email Address Account Status.</p>
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
