<script setup lang="ts">

import { DatePicker, Toast, useConfirm, useToast } from 'primevue';
import InputText from 'primevue/inputtext';

import { onMounted, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';

import ConfirmDialog from 'primevue/confirmdialog';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerAsociacionRemove, triggerAsociacionSave, triggerGetAllAsociaciones, triggerGetAsociacionById, type Asociacion } from '@/api/asociacion';
import { triggerClubRemove, triggerClubSave, triggerGetClubById, type Clubs } from '@/api/club';
import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

const authStore = useAuthStore()
const router = useRouter();

const idClub: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);
const loadedAsociaciones = ref<Asociacion[]>([]);
const isLoading = ref(false);

const clubModel = ref<Clubs>({
    idAsociacion: 0,
    idClub: 0,
    nombreClub: '',
    director: '',
    fechaAfiliacion: undefined,
    telefono: '',
    siglas: '',
    direccion: '',
    isActive: true
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.SUCURSAL || authStore.user?.roles === Roles.INSTRUCTOR ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedAsociaciones.value = await triggerGetAllAsociaciones();
  isLoading.value = false;

  //querySucursals();
  reassembleModel();
  //queryProvincias();
});

const reassembleModel = async () => {
  if (idClub) {
    isCreating.value = true;
    const club = await triggerGetClubById(idClub);
    if (club) {
      clubModel.value.idClub = club.idClub
      clubModel.value.idAsociacion = club.idAsociacion;
      clubModel.value.nombreClub = club.nombreClub;
      clubModel.value.director = club.director;
      clubModel.value.fechaAfiliacion = club.fechaAfiliacion;
      clubModel.value.telefono = club.telefono;
      clubModel.value.direccion = club.direccion;
      clubModel.value.siglas = club.siglas
      clubModel.value.isActive = club.isActive;
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerClubSave({
    ...clubModel.value,
  });
  console.log(result);
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.clubView});
  }
};

const startRemoving = async () => {
  if (!idClub) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar el club?',
    header: 'Eliminar Asociación',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'Cancelar',
    },
    accept: async () => {
      isCreating.value = true;
      const result = await triggerClubRemove(idClub);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Asociación eliminada',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar el club',
          life: 3000,
        });
      }
      isCreating.value = false;
    },
    reject: () => {},
  });
};
const statusOptions = ref([

        { label: "Activo", value: true },
        { label: "Inactivo", value: false },
      
])
</script>
<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <div class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-between items-center">
    <h1 class="text-3xl font-bold">{{ idClub ? 'Editar' : 'Agregar' }} Club</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-row flex-wrap gap-2 justify-between">
          
          <div class="flex flex-col items-start">
            <label for="nombreClub" class="block text-gray-600">Nombre Club</label>
            <InputText
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              v-model="clubModel.nombreClub"
              type="text"
              id="nombreClub"
              name="nombreClub"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="siglas" class="block text-gray-600">Siglas</label>
            <InputText
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              v-model="clubModel.siglas"
              type="text"
              id="siglas"
              name="siglas"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="director" class="block text-gray-600">Director</label>
            <InputText
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              v-model="clubModel.director"
              type="text"
              id="director"
              name="director"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="telefono" class="block text-gray-600">Teléfono</label>
            <InputText
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              v-model="clubModel.telefono"
              type="text"
              id="telefono"
              name="telefono"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              maxlength="10"
              @input="clubModel.telefono = clubModel.telefono?.replace(/\D/g, '')"
            />
          </div>
          
          
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="Direccion">Dirección</label>
            <InputText
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              v-model="clubModel.direccion"
              id="direccion"
              name="direccion"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            >
            </InputText>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>

          <div class="flex flex-col items-start">
            <label for="fechaAfiliacion" class="block text-gray-600">Fecha Afiliación</label>
            <DatePicker
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="clubModel.fechaAfiliacion"
            />
          </div>
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="isActive" class="block text-gray-600">Asociación</label>
            <Dropdown
              :disabled="(authStore.user?.roles === Roles.ASOCIACION) && !!idClub"
              v-model="clubModel.idAsociacion"
              ref="fullNameInputRef"
              type="text"
              id="idAsociacion"
              name="idAsociacion"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedAsociaciones"
              optionLabel="asociacion"
              optionValue="idAsociacion"
              placeholder="Seleccione"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="isActive" class="block text-gray-600">Active</label>
            <Dropdown
              :disabled="(authStore.user?.roles === Roles.CLUB) && !!idClub"
              v-model="clubModel.isActive"
              ref="fullNameInputRef"
              type="text"
              id="isActive"
              name="isActive"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione"
            />
          </div>
        </section>
        </section>
        
    </form>
    <div class="flex flex-row justify-end w-full h-full">
      <div class="flex md:flex-row flex-col justify-between md:w-1/2 w-full p-8">
        <button
          v-if="clubModel.idClub"
          @click="startRemoving()"
          class="p-3 hover:bg-red-800 bg-red-500 rounded text-white flex items-center md:w-28"
        >
          <i class="pi pi-trash"></i>&nbsp;Eliminar
        </button>
        <button
          @click="startSaving"
          class="p-3 hover:bg-blue-800 bg-blue-500 rounded text-white flex items-center md:w-28 md:mt-0 mt-4"
        >
          <i class="pi pi-save"></i>&nbsp;Guardar
        </button>
      </div>
    </div>   
    </div>
</div>
</template>
