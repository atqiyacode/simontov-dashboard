import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from '@/plugins/i18n';

import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import BlockUI from 'primevue/blockui';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import CascadeSelect from 'primevue/cascadeselect';
import Carousel from 'primevue/carousel';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Chips from 'primevue/chips';
import ColorPicker from 'primevue/colorpicker';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import ContextMenu from 'primevue/contextmenu';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import DeferredContent from 'primevue/deferredcontent';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice';
import Divider from 'primevue/divider';
import Dock from 'primevue/dock';
import Dropdown from 'primevue/dropdown';
import DynamicDialog from 'primevue/dynamicdialog';
import Editor from 'primevue/editor';
import Fieldset from 'primevue/fieldset';
import FileUpload from 'primevue/fileupload';
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import InlineMessage from 'primevue/inlinemessage';
import Inplace from 'primevue/inplace';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Knob from 'primevue/knob';
import Listbox from 'primevue/listbox';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import OrderList from 'primevue/orderlist';
import OrganizationChart from 'primevue/organizationchart';
import OverlayPanel from 'primevue/overlaypanel';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import PanelMenu from 'primevue/panelmenu';
import Password from 'primevue/password';
import PickList from 'primevue/picklist';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import Rating from 'primevue/rating';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';
import Row from 'primevue/row';
import SelectButton from 'primevue/selectbutton';
import ScrollPanel from 'primevue/scrollpanel';
import ScrollTop from 'primevue/scrolltop';
import Skeleton from 'primevue/skeleton';
import Slider from 'primevue/slider';
import Sidebar from 'primevue/sidebar';
import SpeedDial from 'primevue/speeddial';
import SplitButton from 'primevue/splitbutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Steps from 'primevue/steps';
import StyleClass from 'primevue/styleclass';
import TabMenu from 'primevue/tabmenu';
import TieredMenu from 'primevue/tieredmenu';
import Textarea from 'primevue/textarea';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';
import Terminal from 'primevue/terminal';
import Timeline from 'primevue/timeline';
import ToggleButton from 'primevue/togglebutton';
import Tooltip from 'primevue/tooltip';
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';
import TreeTable from 'primevue/treetable';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import VirtualScroller from 'primevue/virtualscroller';

// custom component
import InputLabel from '@/components/InputLabel.vue';
import CustomDataTable from '@/components/CustomDataTable.vue';
import InputError from '@/components/InputError.vue';
import ListDetail from '@/components/ListDetail.vue';
import ListDetailInline from '@/components/ListDetailInline.vue';
import ListDetailBreak from '@/components/ListDetailBreak.vue';
import ListHeaderDetail from '@/components/ListHeaderDetail.vue';
import DeleteDialog from '@/components/DeleteDialog.vue';
import RestoreDialog from '@/components/RestoreDialog.vue';

import DialogFormInput from '@/components/dialog/DialogFormInput.vue';
import DialogDetail from '@/components/dialog/DialogDetail.vue';

import DialogDestroy from '@/components/dialog/DialogDestroy.vue';
import DialogDestroySelected from '@/components/dialog/DialogDestroySelected.vue';

import DialogRestore from '@/components/dialog/DialogRestore.vue';
import DialogRestoreSelected from '@/components/dialog/DialogRestoreSelected.vue';

import DialogDelete from '@/components/dialog/DialogDelete.vue';
import DialogDeleteSelected from '@/components/dialog/DialogDeleteSelected.vue';

import DialogSelectField from '@/components/dialog/DialogSelectField.vue';
import DialogUpload from '@/components/dialog/DialogUpload.vue';

import DialogExport from '@/components/dialog/DialogExport.vue';

import ToolbarTable from '@/components/table/ToolbarTable.vue';
import ColumnActionButton from '@/components/table/ColumnActionButton.vue';
// chart-types
import RealtimeLineChartPage from '@/components/chart-types/RealtimeLineChartPage.vue';
import RealtimeDualLineChartPage from '@/components/chart-types/RealtimeDualLineChartPage.vue';
import DualLineChartPage from '@/components/chart-types/DualLineChartPage.vue';
import LineChartPage from '@/components/chart-types/LineChartPage.vue';
import RadialChartPage from '@/components/chart-types/RadialChartPage.vue';
import NewRadialChartPage from '@/components/chart-types/NewRadialChartPage.vue';
import OtpInput from 'vue3-otp-input';

import VueApexCharts from 'vue3-apexcharts';

import Toast from 'vue-toastification';

import '@/assets/styles.scss';
import 'vue-toastification/dist/index.css';

// pinia
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import resetStore from '@/plugins/reset-store';
// pusher js
import PluginPusher from '@/plugins/pusher';
import globalMixin from '@/plugins/global-mixin';
import { useUserStore } from '@/services/user.store';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(resetStore);

(async () => {
    const app = createApp(App);
    app.use(PluginPusher);
    app.use(pinia);
    app.use(i18n);
    app.use(PrimeVue, { ripple: true });
    app.use(ToastService);
    app.use(DialogService);
    app.use(ConfirmationService);
    app.use(Toast);
    app.use(VueApexCharts);

    app.directive('tooltip', Tooltip);
    app.directive('badge', BadgeDirective);
    app.directive('ripple', Ripple);
    app.directive('styleclass', StyleClass);

    app.component('Accordion', Accordion);
    app.component('AccordionTab', AccordionTab);
    app.component('AutoComplete', AutoComplete);
    app.component('Avatar', Avatar);
    app.component('AvatarGroup', AvatarGroup);
    app.component('Badge', Badge);
    app.component('BlockUI', BlockUI);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Button', Button);
    app.component('Calendar', Calendar);
    app.component('Card', Card);
    app.component('Chart', Chart);
    app.component('Carousel', Carousel);
    app.component('CascadeSelect', CascadeSelect);
    app.component('Checkbox', Checkbox);
    app.component('Chip', Chip);
    app.component('Chips', Chips);
    app.component('ColorPicker', ColorPicker);
    app.component('Column', Column);
    app.component('ColumnGroup', ColumnGroup);
    app.component('ConfirmDialog', ConfirmDialog);
    app.component('ConfirmPopup', ConfirmPopup);
    app.component('ContextMenu', ContextMenu);
    app.component('DataTable', DataTable);
    app.component('DataView', DataView);
    app.component('DataViewLayoutOptions', DataViewLayoutOptions);
    app.component('DeferredContent', DeferredContent);
    app.component('Dialog', Dialog);
    app.component('Divider', Divider);
    app.component('Dock', Dock);
    app.component('Dropdown', Dropdown);
    app.component('DynamicDialog', DynamicDialog);
    app.component('Editor', Editor);
    app.component('Fieldset', Fieldset);
    app.component('FileUpload', FileUpload);
    app.component('Galleria', Galleria);
    app.component('Image', Image);
    app.component('InlineMessage', InlineMessage);
    app.component('Inplace', Inplace);
    app.component('InputMask', InputMask);
    app.component('InputNumber', InputNumber);
    app.component('InputSwitch', InputSwitch);
    app.component('InputText', InputText);
    app.component('Knob', Knob);
    app.component('Listbox', Listbox);
    app.component('MegaMenu', MegaMenu);
    app.component('Menu', Menu);
    app.component('Menubar', Menubar);
    app.component('Message', Message);
    app.component('MultiSelect', MultiSelect);
    app.component('OrderList', OrderList);
    app.component('OrganizationChart', OrganizationChart);
    app.component('OverlayPanel', OverlayPanel);
    app.component('Paginator', Paginator);
    app.component('Panel', Panel);
    app.component('PanelMenu', PanelMenu);
    app.component('Password', Password);
    app.component('PickList', PickList);
    app.component('ProgressBar', ProgressBar);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('RadioButton', RadioButton);
    app.component('Rating', Rating);
    app.component('Row', Row);
    app.component('SelectButton', SelectButton);
    app.component('ScrollPanel', ScrollPanel);
    app.component('ScrollTop', ScrollTop);
    app.component('Slider', Slider);
    app.component('Sidebar', Sidebar);
    app.component('Skeleton', Skeleton);
    app.component('SpeedDial', SpeedDial);
    app.component('SplitButton', SplitButton);
    app.component('Splitter', Splitter);
    app.component('SplitterPanel', SplitterPanel);
    app.component('Steps', Steps);
    app.component('TabMenu', TabMenu);
    app.component('TabView', TabView);
    app.component('TabPanel', TabPanel);
    app.component('Tag', Tag);
    app.component('Textarea', Textarea);
    app.component('Terminal', Terminal);
    app.component('TieredMenu', TieredMenu);
    app.component('Timeline', Timeline);
    app.component('Toolbar', Toolbar);
    app.component('ToggleButton', ToggleButton);
    app.component('Tree', Tree);
    app.component('TreeSelect', TreeSelect);
    app.component('TreeTable', TreeTable);
    app.component('TriStateCheckbox', TriStateCheckbox);
    app.component('VirtualScroller', VirtualScroller);

    app.component('CustomDataTable', CustomDataTable);
    app.component('InputLabel', InputLabel);
    app.component('InputError', InputError);
    app.component('ListDetail', ListDetail);
    app.component('ListDetailInline', ListDetailInline);
    app.component('ListDetailBreak', ListDetailBreak);
    app.component('ListHeaderDetail', ListHeaderDetail);
    app.component('DeleteDialog', DeleteDialog);
    app.component('RestoreDialog', RestoreDialog);

    app.component('DialogFormInput', DialogFormInput);
    app.component('DialogDetail', DialogDetail);

    app.component('DialogDestroy', DialogDestroy);
    app.component('DialogDestroySelected', DialogDestroySelected);

    app.component('DialogRestore', DialogRestore);
    app.component('DialogRestoreSelected', DialogRestoreSelected);

    app.component('DialogDelete', DialogDelete);
    app.component('DialogDeleteSelected', DialogDeleteSelected);

    app.component('DialogSelectField', DialogSelectField);
    app.component('DialogUpload', DialogUpload);

    app.component('DialogExport', DialogExport);

    app.component('ToolbarTable', ToolbarTable);
    app.component('ColumnActionButton', ColumnActionButton);

    app.component('DualLineChartPage', DualLineChartPage);
    app.component('LineChartPage', LineChartPage);
    app.component('RealtimeLineChartPage', RealtimeLineChartPage);
    app.component('RealtimeDualLineChartPage', RealtimeDualLineChartPage);
    app.component('RadialChartPage', RadialChartPage);
    app.component('NewRadialChartPage', NewRadialChartPage);

    app.component('OtpInput', OtpInput);

    const userStore = useUserStore();
    await userStore.session();

    app.use(router);
    app.mixin(globalMixin);
    router.isReady().then(() => {
        app.mount('#app');
    });
})();
