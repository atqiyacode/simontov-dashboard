<script setup>
import { useAuthStore } from '@/services/auth.store';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/services/user.store';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';

const { layoutConfig, contextPath } = useLayout();

const router = useRouter();
const authStore = useAuthStore();
const mainStore = useMainStore();
const userStore = useUserStore();

const { sendEmailVerification } = authStore;

const { loading } = storeToRefs(mainStore);

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
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5 px-6">
                        <div class="text-900 text-3xl font-medium mb-3">Verification Account</div>
                        <span class="text-600 font-medium">Silahkan Verifikasi email anda untuk mengaktifkan akun anda.</span>
                    </div>
                    <form @submit.prevent="sendEmailVerification()">
                        <Button type="submit" :loading="loading" :label="loading ? 'Processing' : 'Send Email Verification'" class="w-full p-3 text-xl"></Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
