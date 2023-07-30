<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import _ from "lodash";
import { storeToRefs } from "pinia";
import { useCrudStore } from "@/services/crudStore";

import vueFilePond from "vue-filepond";

import "filepond/dist/filepond.min.css";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { useOptionStore } from "@/services/optionStore";

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

const store = useCrudStore();

const {
  hideDialog,
  load,
  save,
  update,
  destroy,
  restore,
  deletePermanent,
  uploadIcon,
  deleteIcon,
} = store;

const { loadAppStatus } = useOptionStore();
const { appStatuses } = storeToRefs(useOptionStore());

const {
  keyword,
  deleteDialog,
  detailDialog,
  restoreDialog,
  destroyDialog,
  formDialog,
  successMessage,
  errors,
  form,
  data,
  meta,
  rowsPerPage,
  loading,
  selected,
  formLabel,
  tableBody,
  api,
  title,
} = storeToRefs(store);

// main
const toast = useToast();

const currentFileIcon = ref(null);

// mounted
onMounted(() => {
  title.value = "Mobile App Menu";
  api.value = "/mobile/mobileAppMenu";
  tableBody.value = [
    { label: "Icon", value: "icon", type: "image", sort: false },
    { label: "name", value: "name", type: "text", sort: true },
    { label: "name en", value: "name_en", type: "text", sort: true },
    { label: "status", value: "status", type: "object", object: "name", sort: true },
  ];
  getData();
  loadAppStatus();
});

// onUnMounted
onUnmounted(() => {
  store.$reset();
});

watch(
  keyword,
  _.debounce((value) => {
    let length = value.length;
    if (length >= 3 || length == 0) {
      keyword.value = value;
      getData();
    }
  }, 500)
);
const filterSearch = (value) => {
  keyword.value = value;
};

const onChangePage = (val) => {
  load({
    page: val.page + 1,
    rows: val.rows,
  });
};

// axios
const getData = () => {
  const params = {};
  keyword.value ? (params.search = keyword.value) : null;
  load(params);
};

const processData = () => {
  currentFileIcon.value = null;
  if (form.value.id) {
    update();
  } else {
    save();
  }
};

const destroyData = (params) => {
  destroy(params.id).then(() => {
    notify(successMessage.value);
  });
};

const restoreData = (params) => {
  restore(params.id).then(() => {
    notify(successMessage.value);
  });
};

const deleteData = (params) => {
  deletePermanent(params.id).then(() => {
    notify(successMessage.value);
  });
};

// dialog
const onCreate = () => {
  formLabel.value = "New Data";
  selected.value = {};
  formDialog.value = true;
};

const onEdit = (val) => {
  formLabel.value = "Edit Data";
  form.value = {
    id: val.id,
    code: val.code,
    name: val.name,
    name_en: val.name_en,
    description: val.description,
    description_en: val.description_en,
    status: val.status.id,
  };
  formDialog.value = true;
  detailDialog.value = false;
};
const showDetail = (val) => {
  selected.value = val;
  detailDialog.value = true;
};
const confirmDelete = (val) => {
  selected.value = val;
  deleteDialog.value = true;
  detailDialog.value = false;
};
const onRestore = (val) => {
  selected.value = val;
  restoreDialog.value = true;
  deleteDialog.value = false;
  detailDialog.value = false;
};
const onDestroy = (val) => {
  selected.value = val;
  destroyDialog.value = true;
};

// other
function onAddFile(err, source) {
  loading.value = true;
  let formData = new FormData();
  formData.append("icon", source.file);
  uploadIcon("/master/menu-icon", formData)
    .then((res) => {
      loading.value = false;
      form.value.icon = res.data.url;
      currentFileIcon.value = res.data.file_name;
    })
    .catch(() => {
      loading.value = false;
      currentFileIcon.value = null;
    });
}

function onRemoveFile() {
  form.value.icon = "";
  if (currentFileIcon.value) {
    deleteIcon("/master/menu-icon", currentFileIcon.value).then(() => {
      currentFileIcon.value = null;
    });
  }
}

function hideModal() {
  hideDialog();
  if (currentFileIcon.value != null) {
    onRemoveFile();
  }
}

const notify = (message, type = "success") => {
  if (message) {
    toast.add({
      severity: type,
      summary: "Notification",
      detail: message,
      life: 3000,
      closable: false,
    });
  }
};
</script>

<template>
  <CustomDataTable
    :label="title"
    :loading="loading"
    :data="data"
    :meta="meta"
    :rowsPerPage="rowsPerPage"
    :keyword="keyword"
    :tableBody="tableBody"
    :canSelectMultiple="false"
    :canRestore="true"
    @search="filterSearch($event)"
    @create="onCreate()"
    @show="showDetail($event)"
    @edit="onEdit($event)"
    @destroy="confirmDelete($event)"
    @changePage="onChangePage($event)"
    @restore="onRestore($event)"
    @deletePermanent="onDestroy($event)"
  />
  <!-- dialog form -->
  <Dialog
    v-model:visible="formDialog"
    :style="{ width: '640px' }"
    :header="formLabel"
    :modal="true"
    :closable="false"
    class="p-fluid"
  >
    <div class="card">
      <div class="p-fluid formgrid grid">
        <!-- code -->
        <div class="mb-5 field col-12">
          <span class="p-float-label">
            <InputText
              required
              id="code"
              type="text"
              v-model="form.code"
              :class="{ 'p-invalid': errors.code }"
              placeholder="Code"
            />
            <InputLabel value="code" />
          </span>
          <InputError :message="errors.code" />
        </div>
        <!-- name -->
        <div class="mb-5 field col-12">
          <span class="p-float-label">
            <InputText
              required
              id="name"
              type="text"
              v-model="form.name"
              :class="{ 'p-invalid': errors.name }"
              placeholder="name"
            />
            <InputLabel value="name" />
          </span>
          <InputError :message="errors.name" />
        </div>
        <!-- description -->
        <div class="mb-5 field col-12">
          <span class="p-float-label">
            <Textarea
              :auto-resize="true"
              required
              id="description"
              v-model="form.description"
              :class="{ 'p-invalid': errors.description }"
              placeholder="description"
            />
            <InputLabel value="description" />
          </span>
          <InputError :message="errors.description" />
        </div>
        <!-- name_en -->
        <div class="mb-5 field col-12">
          <span class="p-float-label">
            <InputText
              required
              id="name_en"
              type="text"
              v-model="form.name_en"
              :class="{ 'p-invalid': errors.name_en }"
              placeholder="name english"
            />
            <InputLabel value="name english" />
          </span>
          <InputError :message="errors.name_en" />
        </div>
        <!-- description_en -->
        <div class="mb-5 field col-12">
          <span class="p-float-label">
            <Textarea
              :auto-resize="true"
              required
              id="description_en"
              v-model="form.description_en"
              :class="{ 'p-invalid': errors.description_en }"
              placeholder="description english"
            />
            <InputLabel value="description english" />
          </span>
          <InputError :message="errors.description_en" />
        </div>
        <!-- status -->
        <div class="mb-5 field col-12">
          <span class="p-float-label">
            <Dropdown
              required
              id="status"
              :options="appStatuses"
              optionLabel="name"
              optionValue="id"
              v-model="form.status"
              :class="{ 'p-invalid': errors.status }"
              placeholder="Status"
            />
            <InputLabel value="status" />
          </span>
          <InputError :message="errors.status" />
        </div>
        <!-- icon -->
        <div class="mb-5 field col-12">
          <file-pond
            name="icon"
            ref="pond"
            class-name="my-pond"
            label-idle="Upload menu icon"
            :allowMultiple="false"
            :acceptedFileTypes="['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']"
            @addfile="onAddFile"
            @removefile="onRemoveFile"
          />
          <InputError :message="errors.icon" />
          <small>Icon Recomendation : 150 x 150 px</small>
        </div>
      </div>
    </div>

    <template #footer>
      <form @submit.prevent="processData">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-rounded p-button-text"
          @click="hideModal"
        />
        <Button
          :loading="loading"
          type="submit"
          label="Submit"
          icon="pi pi-check"
          class="p-button-rounded p-button-success"
        />
      </form>
    </template>
  </Dialog>
  <!-- end dialog form -->
  <!-- dialog detail -->
  <Dialog
    v-model:visible="detailDialog"
    :style="{ width: '640px' }"
    header="Detail"
    :modal="true"
    :closable="false"
  >
    <div class="card" v-if="selected">
      <ul class="list-none p-0 m-0">
        <ListDetailBreak label="name" :value="selected.name" />
        <ListDetailBreak label="name en" :value="selected.name_en" />
        <ListDetailBreak label="description" :value="selected.description" />
        <ListDetailBreak label="description en" :value="selected.description_en" />
        <ListDetailBreak label="status" :value="selected.status.name" />
        <Image width="100" :src="selected.icon" preview />
      </ul>
    </div>

    <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        class="p-button-rounded p-button-text"
        @click="hideModal()"
      />
      <Button
        label="Edit"
        icon="pi pi-pencil"
        class="p-button-rounded p-button-warning"
        @click="onEdit(selected)"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        class="p-button-rounded p-button-danger"
        @click="confirmDelete(selected)"
      />
    </template>
  </Dialog>
  <!-- end dialog detail -->
  <!-- delete dialog -->
  <Dialog
    v-model:visible="deleteDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
    :closable="false"
  >
    <DeleteDialog :data="selected.name" />
    <template #footer>
      <form @submit.prevent="destroyData(selected)">
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-rounded p-button-text"
          @click="hideModal()"
        />
        <Button
          :loading="loading"
          type="submit"
          label="Yes"
          icon="pi pi-check"
          class="p-button-rounded p-button-danger"
        />
      </form>
    </template>
  </Dialog>
  <!-- end delete dialog -->
  <!-- restore dialog -->
  <Dialog
    v-model:visible="restoreDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
    :closable="false"
  >
    <RestoreDialog :data="selected.name" />
    <template #footer>
      <form @submit.prevent="restoreData(selected)">
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-rounded p-button-text"
          @click="hideModal()"
        />
        <Button
          :loading="loading"
          type="submit"
          label="Yes, Restore"
          icon="pi pi-check"
          class="p-button-rounded p-button-warning"
        />
      </form>
    </template>
  </Dialog>
  <!-- end restore dialog -->
  <!-- restore dialog -->
  <Dialog
    v-model:visible="destroyDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
    :closable="false"
  >
    <DeleteDialog :data="selected.name" />
    <template #footer>
      <form @submit.prevent="deleteData(selected)">
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-rounded p-button-text"
          @click="hideModal()"
        />
        <Button
          :loading="loading"
          type="submit"
          label="Yes, Delete Permanent"
          icon="pi pi-check"
          class="p-button-rounded p-button-danger"
        />
      </form>
    </template>
  </Dialog>
  <!-- end restore dialog -->
</template>
