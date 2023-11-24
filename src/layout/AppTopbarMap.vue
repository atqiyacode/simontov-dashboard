<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/services/auth.store';
import { storeToRefs } from 'pinia';
import { useMainStore } from '../services/main.store';
const { language } = storeToRefs(useMainStore());
const { layoutConfig, contextPath } = useLayout();
const { logout } = useAuthStore();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const logoutDialog = ref(false);
const changeLanguageDialog = ref(false);

const languages = [
    {
        name: 'Indonesia',
        code: 'id'
    },
    {
        name: 'English',
        code: 'en'
    }
];

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onLogout = () => {
    logout().then(() => {
        router.push({
            name: 'login'
        });
    });
};

const logoUrl = computed(() => {
    return `${contextPath}logo/${layoutConfig.darkTheme.value === 'true' ? 'vepro' : 'vepro'}.png`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(
        sidebarEl.isSameNode(event.target) ||
        sidebarEl.contains(event.target) ||
        topbarEl.isSameNode(event.target) ||
        topbarEl.contains(event.target)
    );
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo flex justify-content-center">
            <img :src="logoUrl" alt="logo" />
        </router-link>

        <button
            class="p-link layout-topbar-menu-button layout-topbar-button"
            @click="onTopBarMenuButton()"
        >
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button
                @click="changeLanguageDialog = true"
                class="p-link layout-topbar-button bg-gray-300"
            >
                <b>
                    {{ language === 'id' ? 'ID' : 'EN' }}
                </b>
            </button>

            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-bell"></i>
                <span>Notification</span>
            </button>
            <button @click="logoutDialog = true" class="p-link layout-topbar-button text-red-500">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>

    <!-- logout dialog -->
    <Dialog
        v-model:visible="logoutDialog"
        :style="{ width: '450px' }"
        :header="$t('alert.confirmation')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div class="text-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <h6 class="font-bold text-red-500">{{ $t('alert.logout') }}</h6>
        </div>

        <template #footer>
            <form @submit.prevent="onLogout()">
                <Button
                    :label="$t('button.cancel')"
                    icon="pi pi-times"
                    class="p-button-rounded p-button-text"
                    @click="logoutDialog = false"
                />
                <Button
                    :loading="isLoading"
                    type="submit"
                    :label="$t('button.logout-confirm')"
                    icon="pi pi-check"
                    class="p-button-rounded p-button-danger"
                />
            </form>
        </template>
    </Dialog>
    <!-- end logout dialog -->
    <Dialog
        v-model:visible="changeLanguageDialog"
        :style="{ width: '450px' }"
        :header="$t('select-language')"
        :modal="true"
        :closable="false"
        :pt="{
            mask: {
                style: 'backdrop-filter: blur(2px)'
            }
        }"
    >
        <div v-for="lang in languages" :key="lang.code" class="">
            <div class="card flex align-items-center mb-3">
                <RadioButton
                    v-model="language"
                    :inputId="lang.code"
                    name="dynamic"
                    :value="lang.code"
                />
                <label :for="lang.code" class="ml-2">
                    <b class="uppercase">{{ lang.code }} - {{ $t(lang.code) }}</b>
                </label>
            </div>
        </div>

        <template #footer>
            <Button
                :label="$t('button.close')"
                icon="pi pi-times"
                class="p-button-rounded p-button-text"
                @click="changeLanguageDialog = false"
            />
        </template>
    </Dialog>
</template>

<style lang="scss" scoped></style>
