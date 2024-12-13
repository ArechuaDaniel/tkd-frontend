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
import { triggerAsensoRemove, triggerAsensoSave, triggerGetAllCinturones, triggerGetAsensoById, type Asenso, type Cinturon } from '@/api/asenso';

const allowedRoles = [Roles.SUCURSAL,Roles.INSTRUCTOR, Roles.ADMIN, Roles.CLUB];
const authStore = useAuthStore()
const router = useRouter();

const idAsenso: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);
const loadedSucursal = ref<Sucursals[]>([]);
const isLoading = ref(false);


const loadedAlumnos = ref<Alumnos[]>([]);
const isLoadingAlumnos = ref(false);

const loadedClub = ref<Clubs[]>([]);
const isLoadingClub = ref(false);

const loadedCinturon = ref<Cinturon[]>([]);
const isLoadingCinturon = ref(false);

const asensoModel = ref<Asenso>({
    idSucursal: 0,
    idClub: 0,
    fechaAsenso: new Date(),
    idAlumno: 0,
    idAsenso: 0,
    idCinturon: 0,
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedSucursal.value = await triggerGetAllSucursals();
  isLoading.value = false;


  isLoadingClub.value = true;
  loadedClub.value = await triggerGetAllClubs();
  isLoadingClub.value = false;

  isLoadingCinturon.value = true;
  loadedCinturon.value = await triggerGetAllCinturones();
  isLoadingCinturon.value = false;

  //querySucursals();
  reassembleModel();
  //queryProvincias();
});
const onChangeSucursal = async () => {

 isLoadingAlumnos.value = true;
 loadedAlumnos.value = await triggerGetAllAlumnos(asensoModel.value.idSucursal);
 isLoadingAlumnos.value = false;
}

const reassembleModel = async () => {
  if (idAsenso) {
    isCreating.value = true;
    const asenso = await triggerGetAsensoById(idAsenso);
    if (asenso) {
      asensoModel.value.idAsenso = asenso.idAsenso
      asensoModel.value.idSucursal = asenso.idSucursal;
      asensoModel.value.fechaAsenso = asenso.fechaAsenso;
      asensoModel.value.idClub = asenso.idClub;
      asensoModel.value.idAlumno = asenso.idAlumno;
      asensoModel.value.idCinturon = asenso.idCinturon;
    }
    onChangeSucursal();
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerAsensoSave({
    ...asensoModel.value,
  });
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.asensoView});
  }
};

const startRemoving = async () => {
  if (!idAsenso) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar el Asenso?',
    header: 'Eliminar Asenso',
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
      const result = await triggerAsensoRemove(idAsenso);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Asenso eliminado',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar el asenso',
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
</script>
<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-center items-center">
    <h1 class="text-3xl font-bold">{{ idAsenso ? 'Editar' : 'Agregar' }} Asenso</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-col gap-2 justify-center items-center">
          <div class="flex flex-col items-start">
            <label for="idSucursal" class="block text-gray-600">Club</label>
            <Dropdown
              v-model="asensoModel.idClub"
              ref="fullNameInputRef"
              type="text"
              id="idClub"
              name="idClub"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedClub"
              optionLabel="nombreClub"
              optionValue="idClub"
              placeholder="Seleccione"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idSucursal" class="block text-gray-600">Sucursal</label>
            <Dropdown
              v-model="asensoModel.idSucursal"
              ref="fullNameInputRef"
              type="text"
              id="idSucursal"
              name="idSucursal"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedSucursal"
              optionLabel="nombreSucursal"
              optionValue="idSucursal"
              placeholder="Seleccione"
              :disabled="!asensoModel.idClub"
              @update:modelValue="onChangeSucursal"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idAlumno" class="block text-gray-600">Alumno</label>
            <Dropdown
              v-model="asensoModel.idAlumno"
              ref="fullNameInputRef"
              type="text"
              id="idAlumno"
              name="idAlumno"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="formattedAlumnos"
              optionLabel="fullName"
              optionValue="id"
              placeholder="Seleccione"
              :disabled="!asensoModel.idSucursal"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idCinturon" class="block text-gray-600">Cinturon</label>
            <Dropdown
              v-model="asensoModel.idCinturon"
              ref="fullNameInputRef"
              type="text"
              id="idCinturon"
              name="idCinturon"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedCinturon"
              optionLabel="asensoColor"
              optionValue="idCinturon"
              placeholder="Seleccione"
              :disabled="!asensoModel.idAlumno"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="fechaAsenso" class="block text-gray-600">Fecha Asenso</label>
            <DatePicker
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="asensoModel.fechaAsenso"
              :disabled="!asensoModel.idCinturon"
            />
          </div>
          
          
          
          
        </section>
        </section>
        
    </form>
    
      <div class="flex flex-col justify-center items-center  w-full  p-8">
        <button
          v-if="asensoModel.idAsenso"
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
