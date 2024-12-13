<script setup lang="ts">

import { DatePicker, Toast, useConfirm, useToast } from 'primevue';
import InputText from 'primevue/inputtext';

import { onMounted, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';

import ConfirmDialog from 'primevue/confirmdialog';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerAsociacionRemove, triggerAsociacionSave, triggerGetAsociacionById, type Asociacion } from '@/api/asociacion';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { Roles } from '@/domain/entities/Roles';

const authStore = useAuthStore()
const router = useRouter();

const idAsociacion: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);

const asociacionModel = ref<Asociacion>({
    idAsociacion: 0,
    asociacion: '',
    director: '',
    fechaAfiliacion: undefined,
    telefono: '',
    direccion: '',
    isActive: true
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.CLUB || authStore.user?.roles === Roles.SUCURSAL  || authStore.user?.roles === Roles.INSTRUCTOR ) {
		window.location.href = '/admin/dashboard'
		return;
	}

  //querySucursals();
  reassembleModel();
  //queryProvincias();
});

const reassembleModel = async () => {
  if (idAsociacion) {
    isCreating.value = true;
    const asociacion = await triggerGetAsociacionById(idAsociacion);
    if (asociacion) {
      asociacionModel.value.idAsociacion = asociacion.idAsociacion;
      asociacionModel.value.asociacion = asociacion.asociacion;
      asociacionModel.value.director = asociacion.director;
      asociacionModel.value.fechaAfiliacion = asociacion.fechaAfiliacion;
      asociacionModel.value.telefono = asociacion.telefono;
      asociacionModel.value.direccion = asociacion.direccion;
      asociacionModel.value.isActive = asociacion.isActive;
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerAsociacionSave({
    ...asociacionModel.value,
  });
  
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.asociacionView});
  }
};

const startRemoving = async () => {
  if (!idAsociacion) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar la asociación?',
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
      const result = await triggerAsociacionRemove(idAsociacion);
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
          detail: 'No se pudo eliminar la asociación',
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
    <h1 class="text-3xl font-bold">{{ idAsociacion ? 'Editar' : 'Agregar' }} Asociación</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-row flex-wrap gap-2 justify-between">
          
          <div class="flex flex-col items-start">
            <label for="asociacion" class="block text-gray-600">Nombre Asociación</label>
            <InputText
              v-model="asociacionModel.asociacion"
              type="text"
              id="asociacion"
              name="asociacion"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="director" class="block text-gray-600">Director</label>
            <InputText
              v-model="asociacionModel.director"
              type="text"
              id="director"
              name="director"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="telefono" class="block text-gray-600">Teléfono</label>
            <InputText
              v-model="asociacionModel.telefono"
              type="text"
              id="telefono"
              name="telefono"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              maxlength="10"
              @input="asociacionModel.telefono = asociacionModel.telefono?.replace(/\D/g, '')"
            />
          </div>
          <hr  class="h-[1px] w-full" />
          
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="Direccion">Dirección</label>
            <InputText
              v-model="asociacionModel.direccion"
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
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="asociacionModel.fechaAfiliacion"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="isActive" class="block text-gray-600">Active</label>
            <Dropdown
              v-model="asociacionModel.isActive"
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
          v-if="asociacionModel.idAsociacion"
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
