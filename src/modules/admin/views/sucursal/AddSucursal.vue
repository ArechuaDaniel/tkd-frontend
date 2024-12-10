<script setup lang="ts">

import { DatePicker, Toast, useConfirm, useToast } from 'primevue';
import InputText from 'primevue/inputtext';

import { onMounted, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';

import ConfirmDialog from 'primevue/confirmdialog';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerAsociacionRemove, triggerAsociacionSave, triggerGetAllAsociaciones, triggerGetAsociacionById, type Asociacion } from '@/api/asociacion';
import { triggerClubRemove, triggerClubSave, triggerGetAllClubs, triggerGetClubById, type Clubs } from '@/api/club';
import { triggerGetSucursalById, triggerSucursalRemove, triggerSucursalSave, type Sucursals } from '@/api/sucursal';
import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

const allowedRoles = [Roles.SUCURSAL, Roles.CLUB, Roles.ADMIN];
const authStore = useAuthStore()
const router = useRouter();

const idSucursal: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);
const loadedClub = ref<Clubs[]>([]);
const isLoading = ref(false);

const sucursalModel = ref<Sucursals>({
    idSucursal: 0,
    idClub: 0,
    nombre: '',
    nombreSucursal: '',
    fechaCreacion: undefined,
    telefono: '',
    direccion: '',
    isActive: true
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedClub.value = await triggerGetAllClubs();
  isLoading.value = false;

  //querySucursals();
  reassembleModel();
  //queryProvincias();
});

const reassembleModel = async () => {
  if (idSucursal) {
    isCreating.value = true;
    const club = await triggerGetSucursalById(idSucursal);
    if (club) {
      sucursalModel.value.idClub = club.idClub
      sucursalModel.value.idSucursal = club.idSucursal;
      sucursalModel.value.nombre = club.nombre;
      sucursalModel.value.nombreSucursal = club.nombreSucursal;
      sucursalModel.value.fechaCreacion = club.fechaCreacion;
      sucursalModel.value.telefono = club.telefono;
      sucursalModel.value.direccion = club.direccion;
      sucursalModel.value.isActive = club.isActive;
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerSucursalSave({
    ...sucursalModel.value,
  });
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.sucursalView});
  }
};

const startRemoving = async () => {
  if (!idSucursal) return;
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
      const result = await triggerSucursalRemove(idSucursal);
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
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-between items-center">
    <h1 class="text-3xl font-bold">{{ idSucursal ? 'Editar' : 'Agregar' }} Sucursal</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-row flex-wrap gap-2 justify-between">
          
          <div class="flex flex-col items-start">
            <label for="nombreSucursal" class="block text-gray-600">Sucursal</label>
            <InputText
              v-model="sucursalModel.nombreSucursal"
              type="text"
              id="nombreSucursal"
              name="nombreSucursal"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="nombre" class="block text-gray-600">Nombre</label>
            <InputText
              v-model="sucursalModel.nombre"
              type="text"
              id="nombre"
              name="nombre"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="telefono" class="block text-gray-600">Teléfono</label>
            <InputText
            v-model="sucursalModel.telefono"
            type="text"
            id="telefono"
            name="telefono"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            maxlength="10"
            @input="sucursalModel.telefono = sucursalModel.telefono?.replace(/\D/g, '')"
            />
          </div>
          
          <hr  class="h-[1px] w-full" />
          
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="Direccion">Dirección</label>
            <InputText
              v-model="sucursalModel.direccion"
              id="direccion"
              name="direccion"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            >
            </InputText>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>

          <div class="flex flex-col items-start">
            <label for="fechaCreacion" class="block text-gray-600">Fecha Creación</label>
            <DatePicker
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="sucursalModel.fechaCreacion"
            />
          </div>
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="idClub" class="block text-gray-600">Club</label>
            <Dropdown
              v-model="sucursalModel.idClub"
              ref="fullNameInputRef"
              type="text"
              id="idClub"
              name="idClub"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedClub"
              optionLabel="nombreClub"
              optionValue="idClub"
              placeholder="Seleccione"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="isActive" class="block text-gray-600">Active</label>
            <Dropdown
              v-model="sucursalModel.isActive"
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
          v-if="sucursalModel.idSucursal"
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
