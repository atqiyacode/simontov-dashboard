<script setup>
import { ref, onMounted } from "vue";

import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useRegisterStore } from "@/services/registerStore";

const registerStore = useRegisterStore();

const router = useRouter();

const isLoading = ref(false);

const form = registerStore.form;

const toast = useToast();

onMounted(() => {
  if (!registerStore.needVerification) {
    router.push({ name: "register" });
  }
});

const handleOnComplete = (value) => {
  form.verification_code = value;
  onSubmit();
};

const handleOnChange = () => {
  form.verification_code = "";
  registerStore.$patch({
    error: null,
  });
};

const onSubmit = () => {
  registerStore
    .verify()
    .then(() => {
      router.push({
        name: "dashboard",
      });
    })
    .catch(() => {
      isLoading.value = false;
    });
};
const resendCode = () => {
  registerStore.resend().then(() => {
    toast.add({
      severity: "success",
      summary: "Notification",
      detail: registerStore.message,
      life: 3000,
      closable: false,
    });
  });
};
const onLogout = () => {
  registerStore.$reset();
  router.push({ name: "login" });
};
</script>

<template>
  <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">Two Factor Authentication</div>

      <div class="w-full flex flex-wrap align-items-center justify-content-center">
        <span class="text-600 font-small w-30rem">
          <p class="mb-0">OTP Code has been sent.</p>
          <span class="text-sm">please check your Whatsapp Message.</span>
        </span>
      </div>
    </div>
    <p class="text-center font-bold text-red-600" v-if="registerStore.error">
      {{ registerStore.error }}
    </p>
    <form @submit.prevent="onSubmit" v-if="!registerStore.locked">
      <div
        class="flex flex-column md:flex-row md:align-items-center md:justify-content-center mb-5"
      >
        <OtpInput
          ref="otpInput"
          input-classes="otp-input"
          separator=" "
          :num-inputs="6"
          :should-auto-focus="true"
          :is-input-num="true"
          @on-change="handleOnChange"
          @on-complete="handleOnComplete"
        />
      </div>
    </form>

    <div class="text-center mb-3" v-if="!registerStore.locked">
      <Button
        @click="resendCode"
        label="Resend New verification Code"
        type="button"
        class="p-button-raised p-button-warning"
      >
      </Button>
    </div>

    <div class="col-12 text-center">
      <p class="text-muted mb-0">
        <Button
          @click="onLogout()"
          class="p-button-sm"
          icon="pi pi-arrow-left"
          label="Use another account"
        >
        </Button>
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
