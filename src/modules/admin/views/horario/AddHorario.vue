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
import { triggerGetAllSucursals, triggerGetSucursalById, triggerSucursalRemove, triggerSucursalSave, type Sucursals } from '@/api/sucursal';
import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { triggerGetHorarioById, triggerHorarioRemove, triggerHorarioSave, type Horarios } from '@/api/horario';

const allowedRoles = [Roles.SUCURSAL,Roles.INSTRUCTOR, Roles.ADMIN, Roles.CLUB];
const authStore = useAuthStore()
const router = useRouter();

const idHorario: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);
const loadedSucursal = ref<Sucursals[]>([]);
const isLoading = ref(false);

const horarioModel = ref<Horarios>({
    idSucursal: 0,
    idHorario: 0,
    inicio: undefined,
    fin: undefined,
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedSucursal.value = await triggerGetAllSucursals();
  isLoading.value = false;

  //querySucursals();
  reassembleModel();
  //queryProvincias();
});

const reassembleModel = async () => {
  if (idHorario) {
    isCreating.value = true;
    const horario = await triggerGetHorarioById(idHorario);
    if (horario) {
      horarioModel.value.idHorario = horario.idHorario
      horarioModel.value.idSucursal = horario.idSucursal;
      horarioModel.value.inicio = horario.inicio;
      horarioModel.value.fin = horario.fin;
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerHorarioSave({
    ...horarioModel.value,
  });
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.horariosView});
  }
};

const startRemoving = async () => {
  if (!idHorario) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar el horario?',
    header: 'Eliminar Horario',
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
      const result = await triggerHorarioRemove(idHorario);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Horario eliminado',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar el horario',
          life: 3000,
        });
      }
      isCreating.value = false;
    },
    reject: () => {},
  });
};

</script>
<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-center items-center">
    <h1 class="text-3xl font-bold">{{ idHorario ? 'Editar' : 'Agregar' }} Horario</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-col gap-2 justify-center items-center">
          
          <div class="flex flex-col  items-start">
            <label for="inicio" class="block text-gray-600">Inicio</label>
            <input
              v-model="horarioModel.inicio"
              type="time"
              id="inicio"
              name="inicio"
              class="w-[15rem] h-[3rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="fin" class="block text-gray-600">Fin</label>
            <input
              v-model="horarioModel.fin"
              type="time"
              id="fin"
              name="fin"
              class="w-[15rem] h-[3rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idSucursal" class="block text-gray-600">Sucursal</label>
            <Dropdown
              v-model="horarioModel.idSucursal"
              ref="fullNameInputRef"
              type="text"
              id="idSucursal"
              name="idSucursal"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedSucursal"
              optionLabel="nombreSucursal"
              optionValue="idSucursal"
              placeholder="Seleccione"
            />
          </div>
          
          
        </section>
        </section>
        
    </form>
    
      <div class="flex flex-col justify-center items-center  w-full  p-8">
        <button
          v-if="horarioModel.idHorario"
          @click="startRemoving()"
          class="p-3 hover:bg-red-800 bg-red-500 rounded text-white flex items-center justify-center w-[15rem]"
        >
          <i class="pi pi-trash"></i>&nbsp;Eliminar
        </button>
        <button
          @click="startSaving"
          class="p-3 hover:bg-blue-800 bg-blue-500 rounded text-white flex items-center justify-center w-[15rem]  mt-4"
        >
          <i class="pi pi-save"></i>&nbsp;Guardar
        </button>
      </div>

    </div>   
    
</div>
</template>
