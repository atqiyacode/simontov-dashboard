<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRegisterStore } from '@/services/registerStore';
import { useAuthStore } from '@/services/authStore';

useAuthStore().$reset();
localStorage.removeItem('auth');

const registerStore = useRegisterStore();

const router = useRouter();

const appName = import.meta.env.VITE_APP_NAME;

const isLoading = ref(false);

const form = registerStore.form;
const errors = registerStore.errors;

const rules = {
    name: { required },
    phone: { required }
};

const v$ = useVuelidate(rules, form);

const submit = () => {
    isLoading.value = true;
    registerStore
        .register()
        .then(() => {
            isLoading.value = false;
            router.push({
                name: 'verify-account'
            });
        })
        .catch(() => {
            isLoading.value = false;
        });
};
</script>

<template>
    <form @submit.prevent="submit">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
            <div class="text-center mb-5">
                <div class="text-900 text-3xl font-medium mb-3">Sign Up</div>
                <span class="text-600 font-medium">{{ appName }}</span>
            </div>

            <div class="p-fluid mb-5">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-user"></i>
                    </span>
                    <span class="p-float-label">
                        <InputText
                            id="name"
                            class="w-full md:w-30rem"
                            type="text"
                            v-model="form.name"
                            :class="{ 'p-invalid': errors.name }"
                        />
                        <InputLabel for="name" value="Full Name" />
                    </span>
                </div>
                <InputError :message="errors.name" />
            </div>
            <div class="p-fluid mb-5">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon text-green-500">
                        <i class="pi pi-whatsapp"></i>
                    </span>
                    <span class="p-float-label">
                        <InputText
                            @keypress="onNumeric"
                            id="phone"
                            class="w-full md:w-30rem"
                            type="text"
                            v-model="form.phone"
                            :class="{ 'p-invalid': errors.phone }"
                        />
                        <InputLabel for="phone" value="Whatsapp Number" />
                    </span>
                </div>
                <InputError :message="errors.phone" />
            </div>
            <Button
                type="submit"
                :disabled="v$.$invalid"
                :loading="isLoading"
                :label="isloading ? $t('button.process') : 'Register'"
                class="w-full p-3 text-xl"
            ></Button>

            <div class="col-12 mt-5 text-center">
                <p class="text-muted mb-0">
                    Have account ?
                    <router-link :to="{ name: 'login' }" class="font-bold"> Login </router-link>
                </p>
            </div>
        </div>
    </form>
</template>
