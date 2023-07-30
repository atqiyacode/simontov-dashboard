import { toRefs, reactive, computed } from 'vue';
const contextPath = import.meta.env.BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;
const developerTeam = import.meta.env.VITE_APP_DEVELOPER;

const inputStyleSetup = localStorage.getItem('inputStyle') || 'outlined';
const menuModeSetup = localStorage.getItem('menuMode') || 'static';
const themeSetup = localStorage.getItem('theme') || 'mdc-dark-indigo';
const scaleSetup = localStorage.getItem('scale') || 14;
const rippleSetup = localStorage.getItem('ripple') || false;
const darkThemeSetup = localStorage.getItem('darkTheme') || 'dark';

// setup style on load
const elementId = 'theme-css';
const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.id = elementId;
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = `${contextPath}themes/${themeSetup}/theme.css`;
head.appendChild(link);

// set scale on load
document.documentElement.style.fontSize = scaleSetup + 'px';

const layoutConfig = reactive({
    ripple: rippleSetup === 'true' ? true : false,
    darkTheme: darkThemeSetup,
    inputStyle: inputStyleSetup,
    menuMode: menuModeSetup,
    theme: themeSetup,
    scale: parseInt(scaleSetup),
    activeMenuItem: null
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
});

export function useLayout() {
    const changeThemeSettings = (theme, darkTheme) => {
        layoutConfig.darkTheme = darkTheme;
        layoutConfig.theme = theme;
    };

    const setScale = (scale) => {
        layoutConfig.scale = scale;
    };

    const setActiveMenuItem = (item) => {
        layoutConfig.activeMenuItem = item.value || item;
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    return { appName, developerTeam, contextPath, layoutConfig: toRefs(layoutConfig), layoutState: toRefs(layoutState), changeThemeSettings, setScale, onMenuToggle, isSidebarActive, isDarkTheme, setActiveMenuItem };
}
