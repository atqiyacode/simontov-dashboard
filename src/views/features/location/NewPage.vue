<script setup>
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/services/main.store';
import { useCrudStore } from '@/services/crud.store';
import router from '../../../router';
import { onMounted, ref } from 'vue';
import { GoogleMap, InfoWindow } from 'vue3-google-map';

const store = useCrudStore();
const mainStore = useMainStore();
const { save } = store;
const { api, form } = storeToRefs(store);
const { errors, loading } = storeToRefs(mainStore);
const gmapApiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY;
const location = ref('');
onMounted(() => {
    api.value = '/feature/site';
});

const onSubmit = () => {
    save().then(() => {
        router.push({
            name: 'feature-location'
        });
    });
};
const onCancel = () => {
    router.push({
        name: 'feature-location'
    });
};
const center = ref({ lat: -6.175327999999999, lng: 106.8271517 });

const onSelectMap = (event) => {
    form.value.lattitude = event.latLng.lat();
    form.value.longitude = event.latLng.lng();
    getStreetAddressFrom(form.value.lattitude, form.value.longitude);
};

const getStreetAddressFrom = async (lat, long) => {
    try {
        var { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + gmapApiKey);
        if (data.error_message) {
            location.value = '';
            console.log(data.error_message);
        } else {
            form.value.description = data.results[0].formatted_address;
            center.value = { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng };
            location.value = data.results[0].formatted_address;
        }
    } catch (error) {
        location.value = '';
        console.log(error.message);
    }
};
</script>

<template>
    <h5>New page</h5>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="p-fluid formgrid grid">
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText required id="code" type="text" v-model="form.code" :class="{ 'p-invalid': errors.code }" @input="mainStore.removeError" placeholder="code" />
                            <InputLabel value="code" />
                        </span>
                        <InputError :message="errors.code" />
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText required id="name" type="text" v-model="form.name" :class="{ 'p-invalid': errors.name }" @input="mainStore.removeError" placeholder="Name" />
                            <InputLabel value="name" />
                        </span>
                        <InputError :message="errors.name" />
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <Textarea required id="description" :rows="5" v-model="form.description" :class="{ 'p-invalid': errors.description }" @input="mainStore.removeError" placeholder="description" />
                            <InputLabel value="description" />
                        </span>
                        <InputError :message="errors.description" />
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText required id="Lokasi" type="text" v-model="location" :class="{ 'p-invalid': errors.lattitude || errors.longitude }" @input="mainStore.removeError" placeholder="Lokasi" readonly />
                            <InputLabel value="Lokasi" />
                        </span>
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText required id="Lattitude" type="text" v-model="form.lattitude" :class="{ 'p-invalid': errors.lattitude }" @input="mainStore.removeError" placeholder="Lattitude" readonly />
                            <InputLabel value="Lattitude" />
                        </span>
                    </div>
                    <div class="mb-4 field col-12">
                        <span class="p-float-label">
                            <InputText required id="Longitude" type="text" v-model="form.longitude" :class="{ 'p-invalid': errors.longitude }" @input="mainStore.removeError" placeholder="Longitude" readonly />
                            <InputLabel value="Longitude" />
                        </span>
                    </div>
                    <div class="mb-4 field col-12">
                        <GoogleMap :api-key="gmapApiKey" style="width: 100%; height: 300px" :center="center" @click="onSelectMap($event)" :zoom="15">
                            <InfoWindow />
                        </GoogleMap>
                    </div>
                </div>
                <div class="flex justify-content-end">
                    <form @submit.prevent="onSubmit()">
                        <Button :label="$t('button.cancel')" icon="pi pi-times" class="p-button-rounded p-button-warning mr-2" @click="onCancel" />
                        <Button :loading="loading" type="submit" :label="$t('button.process')" icon="pi pi-check" class="p-button-rounded p-button-success" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
