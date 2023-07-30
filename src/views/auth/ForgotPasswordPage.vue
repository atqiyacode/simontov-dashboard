<script setup>
import { useAuthStore } from '@/services/auth.store';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const mainStore = useMainStore();

const appName = import.meta.env.VITE_APP_NAME;

const { forgotPassword } = authStore;

const { errors, loading } = storeToRefs(mainStore);
const { form } = storeToRefs(authStore);

const rules = {
    email: { required, email }
};

const v$ = useVuelidate(rules, form);

onMounted(() => {
    // mainStore.clearCurrentSession();
});
</script>

<template>
    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
        <div class="text-center mb-5 px-6">
            <div class="text-900 text-3xl font-medium mb-3">Forgot Password</div>
            <span class="text-600 font-medium">{{ appName }}</span>
        </div>
        <div class="">
            <div class="p-fluid mb-3">
                <span class="p-float-label">
                    <InputText id="email" class="w-full md:w-30rem" type="text" v-model="form.email" :class="{ 'p-invalid': errors.email }" @input="mainStore.removeError" />
                    <InputLabel for="email" value="email" />
                </span>
                <InputError :message="errors.email" />
            </div>

            <form @submit.prevent="forgotPassword">
                <Button type="submit" :disabled="v$.$invalid" :loading="loading" :label="loading ? 'Processing' : 'Submit'" class="w-full p-3 text-xl"></Button>
            </form>
        </div>
        <div class="flex align-items-center mb-5 mt-3 gap-5">
            <div class="font-medium no-underline">
                Remember password ?
                <router-link :to="{ name: 'login' }" class="cursor-pointer" style="color: var(--primary-color)"> Login </router-link>
            </div>
        </div>
    </div>
</template>
