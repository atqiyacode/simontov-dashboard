<script setup>
import { onMounted } from 'vue';

import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/services/auth.store';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const mainStore = useMainStore();

const router = useRouter();

const { form, hasCode, hasEmail } = storeToRefs(authStore);

const toast = useToast();

onMounted(() => {
    if (!mainStore.authVerification) {
        router.push({ name: 'login' });
    }
});

const handleOnComplete = (value) => {
    form.value.code = value;
    onSubmit();
};

const handleOnChange = () => {
    form.value.code = '';
    authStore.$patch({
        error: null
    });
};

const onSubmit = () => {
    authStore.verifyLogin();
};
const resendCode = (method) => {
    form.value.method = method;
    authStore.getTokenCode().then(() => {
        toast.add({
            severity: 'success',
            summary: 'Notification',
            detail: mainStore.message,
            life: 3000,
            closable: false
        });
    });
};
const onLogout = () => {
    authStore.$reset();
    mainStore.$reset();
    router.push({ name: 'login' });
};
</script>

<template>
    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
        <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Two Factor Authentication</div>

            <div class="w-full flex flex-wrap align-items-center justify-content-center" v-if="hasCode">
                <span class="text-600 font-small w-30rem">
                    <p class="mb-0">OTP Code has been sent.</p>
                    <span class="text-sm">please check your Whatsapp Message.</span>
                </span>
            </div>
            <div class="w-full flex flex-wrap align-items-center justify-content-center" v-else>
                <span class="text-600 font-small w-30rem">
                    <p class="mb-0">Get your OTP Code.</p>
                    <span class="text-sm">please choose your method to get OTP Token Code.</span>
                </span>
            </div>
        </div>
        
        <p class="text-center font-bold text-red-600" v-if="mainStore.errors['code']">
            {{ mainStore.errors['code'][0] }}
        </p>
        
        <form @submit.prevent="onSubmit" v-if="!authStore.locked">
            <div v-if="hasCode" class="flex flex-column md:flex-row md:align-items-center md:justify-content-center mb-5">
                <OtpInput ref="otpInput" input-classes="otp-input" separator=" " :num-inputs="6" :should-auto-focus="true" :is-input-num="true" @on-change="handleOnChange" @on-complete="handleOnComplete" />
            </div>
        </form>

        <div class="text-center mb-3" v-if="!authStore.locked">
            <div class="row">
                <!-- <div class="col" v-if="hasPhone">
                    <Button @click="resendCode('whatsapp')" label="Send Whatsapp verification Code" type="button" class="p-button-raised p-button-success" icon="pi pi-whatsapp"> </Button>
                </div> -->
                <div class="col" v-if="hasEmail">
                    <Button @click="resendCode('email')" label="Send email verification Code" type="button" class="p-button-raised p-button-info" icon="pi pi-envelope"> </Button>
                </div>
            </div>
        </div>

        <div class="col-12 text-center">
            <p class="text-muted mb-0">
                <Button @click="onLogout()" class="p-button-sm" icon="pi pi-arrow-left" label="Use another account"> </Button>
            </p>
        </div>
    </div>
</template>

<style>
.otp-input {
    width: 60px;
    height: 60px;
    padding: 1px;
    margin: 0 5px;
    font-size: 30px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
}
</style>
