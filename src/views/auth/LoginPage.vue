<script setup>
import { useAuthStore } from '@/services/auth.store';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

localStorage.removeItem('register');

const authStore = useAuthStore();
const mainStore = useMainStore();

const { login } = authStore;

const { errors, loading } = storeToRefs(mainStore);
const { form } = storeToRefs(authStore);

const rules = {
    email: { required, email },
    password: { required }
};

const v$ = useVuelidate(rules, form);

onMounted(() => {
    mainStore.removeError();
});

onUnmounted(() => {
    authStore.form.email = '';
    authStore.form.password = '';
});
</script>

<template>
    <div class="w-full surface-card py-8 px-5 sm:px-8 shadow-5" style="border-radius: 53px">
        <div class="text-center mb-5 px-6">
            <div class="text-900 text-3xl font-medium mb-3">
                {{ $t('page.login-text') }}
            </div>
        </div>
        <form @submit.prevent="login" class="pt-5">
            <div class="p-fluid mb-5">
                <span class="p-float-label">
                    <InputText
                        id="email"
                        class="w-full md:w-30rem"
                        type="text"
                        v-model="form.email"
                        :class="{ 'p-invalid': errors.email }"
                        @input="mainStore.removeError"
                    />
                    <InputLabel for="email" value="email" />
                </span>
                <InputError :message="errors.email" />
            </div>
            <div class="p-fluid mb-5">
                <span class="p-float-label">
                    <Password
                        :toggle-mask="true"
                        :feedback="false"
                        id="password"
                        class="w-full"
                        type="text"
                        v-model="form.password"
                        :class="{ 'p-invalid': errors.password }"
                        @input="mainStore.removeError"
                    />
                    <InputLabel for="password" value="Password" />
                </span>
                <InputError :message="errors.password" />
            </div>
            <Button
                type="submit"
                :disabled="v$.$invalid"
                :loading="loading"
                :label="loading ? $t('button.process') : $t('button.login')"
                class="w-full p-3 text-xl"
            ></Button>
            <div class="flex align-items-end justify-content-center mt-5 gap-5">
                <router-link
                    :to="{ name: 'forgot-password' }"
                    class="font-medium align-items-end no-underline ml-2 cursor-pointer"
                    style="color: var(--primary-color)"
                >
                    {{ $t('text.forgot-password') }}
                </router-link>
            </div>
        </form>
    </div>
</template>
