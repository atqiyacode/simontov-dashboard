<script setup>
import { useAuthStore } from '@/services/auth.store';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

localStorage.removeItem('register');

const authStore = useAuthStore();
const mainStore = useMainStore();

const { sendLinkForgotPassword } = authStore;

const { errors, loading } = storeToRefs(mainStore);
const { form } = storeToRefs(authStore);

const rules = {
    email: { required, email }
};

const v$ = useVuelidate(rules, form);
const message = ref('');
onMounted(() => {
    // mainStore.clearCurrentSession();
});

const onSubmit = () => {
    sendLinkForgotPassword().then((res) => {
        message.value = res.data.status;
        setTimeout(() => {
            message.value = '';
        }, 10000);
    });
};
</script>

<template>
    <div class="w-full surface-card py-8 px-5 sm:px-8 shadow-5" style="border-radius: 53px">
        <div class="text-center mb-5 px-6">
            <div class="text-900 text-3xl font-medium mb-3">
                {{ $t('text.forgot-password') }}
            </div>
            <span class="text-600 font-medium w-11"> {{ $t('text.forgot-password-text') }}</span>
        </div>
        <Message severity="success my-5" :closable="false" v-if="!loading && message">
            {{ message }}
        </Message>
        <div class="p-fluid mb-3 pt-5">
            <span class="p-float-label">
                <InputText
                    id="email"
                    class="w-full"
                    type="text"
                    v-model="form.email"
                    :class="{ 'p-invalid': errors.email }"
                    @input="mainStore.removeError"
                />
                <InputLabel for="email" value="email" />
            </span>
            <InputError :message="errors.email" />
        </div>

        <form @submit.prevent="onSubmit()">
            <Button
                type="submit"
                :disabled="v$.$invalid"
                :loading="loading"
                :label="loading ? $t('button.process') : $t('button.send-link-reset-password')"
                class="w-full p-3 text-xl"
            ></Button>
        </form>

        <div class="flex align-items-end justify-content-center mt-5">
            <span>
                {{ $t('text.remember-password') }}
            </span>
            <router-link
                :to="{ name: 'login' }"
                class="font-medium no-underline cursor-pointer mx-1"
                style="color: var(--primary-color)"
            >
                {{ $t('button.login') }}
            </router-link>
        </div>
    </div>
</template>
