<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/services/auth.store';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useMainStore } from '@/services/main.store';
import { storeToRefs } from 'pinia';
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const mainStore = useMainStore();

const { layoutConfig, contextPath } = useLayout();
const { resetPassword } = authStore;
const { errors, loading } = storeToRefs(mainStore);
const { form } = storeToRefs(authStore);

const rules = {
    token: { required },
    email: { required, email },
    password: { required },
    password_confirmation: { required }
};

const v$ = useVuelidate(rules, form);

const logoUrl = computed(() => {
    return `${contextPath}logo/${layoutConfig.darkTheme.value === 'true' ? 'new-bapenda-career-logo-white' : 'new-bapenda-career-logo'}.png`;
});

onMounted(() => {
    form.value.token = route.params.token;
    form.value.email = route.query.email;
});

const onSubmit = () => {
    resetPassword().then(() => {
        setTimeout(() => {
            router.push({
                name: 'login'
            });
        }, 3000);
    });
};
</script>

<template>
    <ConfirmDialog :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '50vw' }" />
    <Toast position="top-center" />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden shadow-5">
        <div class="flex flex-column align-items-center justify-content-center w-full">
            <router-link to="/">
                <img :src="logoUrl" alt="main-logo" class="mb-5 w-15rem flex-shrink-0" />
            </router-link>
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 shadow-5" style="border-radius: 53px">
                    <div class="text-center mb-5 px-6">
                        <div class="text-900 text-3xl font-medium mb-3">Reset Password</div>
                        <!-- <span class="text-600 font-medium">{{ appName }}</span> -->
                    </div>
                    <div class="">
                        <div class="p-fluid mb-3">
                            <span class="p-float-label">
                                <InputText id="email" class="w-full md:w-30rem" type="text" :disabled="true" v-model="form.email" />
                                <InputLabel for="email" value="email" />
                            </span>
                            <InputError :message="errors.email" />
                        </div>
                        <div class="p-fluid mb-3">
                            <span class="p-float-label">
                                <Password :toggle-mask="true" :feedback="true" id="password" class="w-full" type="text" v-model="form.password" :class="{ 'p-invalid': errors.password }" @input="mainStore.removeError" />
                                <InputLabel for="password" value="Password" />
                            </span>
                            <InputError :message="errors.password" />
                        </div>
                        <div class="p-fluid mb-3">
                            <span class="p-float-label">
                                <Password
                                    :toggle-mask="true"
                                    :feedback="false"
                                    id="password_confirmation"
                                    class="w-full"
                                    type="text"
                                    v-model="form.password_confirmation"
                                    :class="{ 'p-invalid': errors.password_confirmation }"
                                    @input="mainStore.removeError"
                                />
                                <InputLabel for="password_confirmation" value="Password confirmation" />
                            </span>
                            <InputError :message="errors.password_confirmation" />
                        </div>
                        <form @submit.prevent="onSubmit">
                            <Button type="submit" :disabled="v$.$invalid" :loading="loading" :label="loading ? 'Processing' : $t('Reset Password')" class="w-full p-3 text-xl"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
