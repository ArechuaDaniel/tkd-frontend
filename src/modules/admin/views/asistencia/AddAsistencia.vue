<script setup lang="ts">

import { DatePicker, Toast, useConfirm, useToast } from 'primevue';
import InputText from 'primevue/inputtext';

import { computed, onMounted, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';

import ConfirmDialog from 'primevue/confirmdialog';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerAsociacionRemove, triggerAsociacionSave, triggerGetAllAsociaciones, triggerGetAsociacionById, type Asociacion } from '@/api/asociacion';
import { triggerClubRemove, triggerClubSave, triggerGetAllClubs, triggerGetClubById, type Clubs } from '@/api/club';
import { triggerGetAllSucursals, triggerGetSucursalById, triggerSucursalRemove, triggerSucursalSave, type Sucursals } from '@/api/sucursal';
import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { triggerGetAllHorarioss, triggerGetHorarioById, triggerHorarioRemove, triggerHorarioSave, type Horarios } from '@/api/horario';
import { triggerAsistenciaRemove, triggerAsistenciaSave, triggerGetAsistenciaById, type Asistencia } from '@/api/asistencia';
import { triggerGetAllAlumnos, type Alumnos } from '@/api/alumno';

const allowedRoles = [Roles.SUCURSAL,Roles.INSTRUCTOR, Roles.ADMIN, Roles.CLUB];
const authStore = useAuthStore()
const router = useRouter();

const idAsistencia: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);
const loadedSucursal = ref<Sucursals[]>([]);
const isLoading = ref(false);


const loadedAlumnos = ref<Alumnos[]>([]);
const isLoadingAlumnos = ref(false);

const loadedHorario = ref<Horarios[]>([]);
const isLoadingClub = ref(false);

const asistenciaModel = ref<Asistencia>({
    idSucursal: 0,
    idHorario: 0,
    fechaRegistro: new Date(),
    idAlumno: 0,
    idAsistencia: 0,
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
const onChangeSucursal = async () => {
  isLoadingClub.value = true;
  loadedHorario.value = await triggerGetAllHorarioss(asistenciaModel.value.idSucursal);
  isLoadingClub.value = false;

  isLoadingAlumnos.value = true;
  loadedAlumnos.value = await triggerGetAllAlumnos(asistenciaModel.value.idSucursal);
  isLoadingAlumnos.value = false;
}
// const onChangeAlumno = async () => {
// }
const reassembleModel = async () => {
  if (idAsistencia) {
    isCreating.value = true;
    const asistencia = await triggerGetAsistenciaById(idAsistencia);
    if (asistencia) {
      asistenciaModel.value.idHorario = asistencia.idHorario
      asistenciaModel.value.idSucursal = asistencia.idSucursal;
      asistenciaModel.value.fechaRegistro = asistencia.fechaRegistro;
      asistenciaModel.value.idAsistencia = asistencia.idAsistencia;
      asistenciaModel.value.idAlumno = asistencia.idAlumno;
    }
    onChangeSucursal();
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerAsistenciaSave({
    ...asistenciaModel.value,
  });
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.asistenciaView});
  }
};

const startRemoving = async () => {
  if (!idAsistencia) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar la Asistencia?',
    header: 'Eliminar Asistencia',
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
      const result = await triggerAsistenciaRemove(idAsistencia);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Asistencia eliminada',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar la asistencia',
          life: 3000,
        });
      }
      isCreating.value = false;
    },
    reject: () => {},
  });
};
const formattedAlumnos = computed(() =>
      loadedAlumnos.value.map((alumno) => ({
        ...alumno,
        fullName: `${alumno.primerApellido} ${alumno.primerNombre}`,
      }))
    );
    const formattedHorario = computed(() =>
      loadedHorario.value.map((horario) => ({
        ...horario,
        fullHorario: `${horario.inicio} / ${horario.fin}`,
      }))
    );
    
</script>
<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-center items-center">
    <h1 class="text-3xl font-bold">{{ idAsistencia ? 'Editar' : 'Agregar' }} Asistencia</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-col gap-2 justify-center items-center">
          <div class="flex flex-col items-start">
            <label for="idSucursal" class="block text-gray-600">Sucursal</label>
            <Dropdown
              v-model="asistenciaModel.idSucursal"
              ref="fullNameInputRef"
              type="text"
              id="idSucursal"
              name="idSucursal"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedSucursal"
              optionLabel="nombreSucursal"
              optionValue="idSucursal"
              placeholder="Seleccione"
              @update:modelValue="onChangeSucursal"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idAlumno" class="block text-gray-600">Alumno</label>
            <Dropdown
              v-model="asistenciaModel.idAlumno"
              ref="fullNameInputRef"
              type="text"
              id="idAlumno"
              name="idAlumno"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="formattedAlumnos"
              optionLabel="fullName"
              optionValue="id"
              placeholder="Seleccione"
              :disabled="!asistenciaModel.idSucursal"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="idHorario" class="block text-gray-600">Horario</label>
            <Dropdown
              v-model="asistenciaModel.idHorario"
              ref="fullNameInputRef"
              type="text"
              id="idHorario"
              name="idHorario"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="formattedHorario"
              optionLabel="fullHorario"
              optionValue="idHorario"
              placeholder="Seleccione"
              :disabled="!asistenciaModel.idSucursal"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="fechaRegistro" class="block text-gray-600">Fecha Registro</label>
            
            <DatePicker
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="asistenciaModel.fechaRegistro"
              :dateFormat="'dd/mm/yy'"
            />
          </div>
         
          
          
        </section>
        </section>
        
    </form>
    
      <div class="flex flex-col justify-center items-center  w-full  p-8">
        <button
          v-if="asistenciaModel.idAsistencia"
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
