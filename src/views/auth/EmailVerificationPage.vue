<script setup>
import { useAuthStore } from '@/services/auth.store';
const authStore = useAuthStore();
const { sendLinkEmailVerification } = authStore;
</script>

<template>
    <div class="w-full surface-card py-8 px-5 sm:px-8 shadow-5" style="border-radius: 53px">
        <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Silahkan verifikasi alamat anda</div>

            <div class="w-full flex flex-wrap align-items-center justify-content-center">
                <span class="text-600 font-small w-30rem">
                    <span class="text-sm"
                        >Jika belum mendapatkan email verifikasi, anda dapat mengirim ulang ke
                        alamat email anda lagi.</span
                    >
                </span>
            </div>
        </div>
        <Button
            @click="sendLinkEmailVerification"
            type="button"
            :loading="loading"
            :label="loading ? $t('button.process') : 'Kirim verifikasi email'"
            class="w-full p-3 text-xl"
        ></Button>
    </div>
</template>

<style></style>
