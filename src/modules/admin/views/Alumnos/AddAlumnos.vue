<script setup lang="ts">
import {
  triggerAlumnoRemove,
  triggerAlumnosSave,
  triggerGetAllAlumnos,
  triggerGetAlumnoById,
  type Alumnos,
} from '@/api/alumno';
import { FilterMatchMode } from '@primevue/core/api';
import { Button, Column, DataTable, DatePicker, Tag, Toast, useConfirm, useToast } from 'primevue';
import InputText from 'primevue/inputtext';

import { onMounted, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';
import { triggerGetAllClubs, type Clubs } from '@/api/club';
import { triggerGetAllSucursals, type Sucursals } from '@/api/sucursal';
import {
  triggerGetAllCantones,
  triggerGetAllParroquias,
  triggerGetAllProvincias,
  type Cantones,
  type Parroquias,
  type Provincias,
} from '@/api/ubicacion';

import ConfirmDialog from 'primevue/confirmdialog';

//import VsToast from '@vuesimple/vs-toast'
import { number } from 'yup';
import { RouteNames } from '@/domain/utils/route.util';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { Roles } from '@/domain/entities/Roles';

const authStore = useAuthStore();

const router = useRouter();

// id del alumno
const id: number | undefined = router.currentRoute.value.params.id as any;
const confirm = useConfirm();
const toast = useToast();

const loadedAlumnos = ref<Alumnos[]>([]);
const isLoading = ref(false);

const loadedProvincias = ref<Provincias[]>([]);
const isLoadingProvincias = ref(false);

const loadedCantones = ref<Cantones[]>([]);
const isLoadingCantones = ref(false);

const loadedParroquias = ref<Parroquias[]>([]);
const isLoadingParroquias = ref(false);

const loadedClubs = ref<Clubs[]>([]);
const loadedSucursales = ref<Sucursals[]>([]);

const isLoadingSucursales = ref(false);

const isCreating = ref(false);

const alumnosModel = ref<Alumnos>({
  id: 0,
  idClub: 0,
  idSucursal: 0,
  primerApellido: '',
  segundoApellido: '',
  primerNombre: '',
  segundoNombre: '',
  cedulaAlumno: '',
  fechaIngreso: undefined,
  telefono: '',
  direccion: '',
  fechaNacimiento: undefined,
  email: '',
  isActive: true,
  genero: '',
  tipoSangre: '',
  ocupacion: '',
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedClubs.value = await triggerGetAllClubs();
  isLoading.value = false;

  //querySucursals();
  reassembleModel();
  //queryProvincias();
});
// const queryProvincias = async () => {
//   isLoadingProvincias.value = true;
//   loadedProvincias.value = await triggerGetAllProvincias();
//   isLoadingProvincias.value = false;
// };
// const queryCantones = async () => {
//   isLoadingCantones.value = true;
//   loadedCantones.value = await triggerGetAllCantones(Number(alumnosModel.value.idProvincia));
//   isLoadingCantones.value = false;
// };
// const queryParroquias = async () => {
//   isLoadingParroquias.value = true;
//   loadedParroquias.value = await triggerGetAllParroquias(Number(alumnosModel.value.idCanton));
//   isLoadingParroquias.value = false;
// };
const querySucursals = async () => {
  isLoadingSucursales.value = true;
  loadedSucursales.value = await triggerGetAllSucursals();
  isLoadingSucursales.value = false;
};
const reassembleModel = async () => {
  if (id) {
    isCreating.value = true;
    const alumno = await triggerGetAlumnoById(id);
    if (alumno) {
      alumnosModel.value.id = alumno.id;
      alumnosModel.value.cedulaAlumno = alumno.cedulaAlumno;
      alumnosModel.value.fechaNacimiento = alumno.fechaNacimiento;
      alumnosModel.value.primerApellido = alumno.primerApellido;
      alumnosModel.value.segundoApellido = alumno.segundoApellido;
      alumnosModel.value.primerNombre = alumno.primerNombre;
      alumnosModel.value.segundoNombre = alumno.segundoNombre;
      alumnosModel.value.telefono = alumno.telefono;
      alumnosModel.value.genero = alumno.genero;
      alumnosModel.value.email = alumno.email;
      alumnosModel.value.fechaIngreso = alumno.fechaIngreso;
      alumnosModel.value.direccion = alumno.direccion;
      alumnosModel.value.tipoSangre = alumno.tipoSangre;
      alumnosModel.value.ocupacion = alumno.ocupacion;
      alumnosModel.value.isActive = alumno.isActive;
      alumnosModel.value.idClub = alumno.idClub;
      alumnosModel.value.idSucursal = alumno.idSucursal;
      await querySucursals();
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerAlumnosSave({
    ...alumnosModel.value,
  });
  console.log(result);
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.alumnosView});
  }
};

const startRemoving = async () => {
  if (!id) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar el alumno?',
    header: 'Eliminar Alumno',
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
      const result = await triggerAlumnoRemove(id);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Alumno eliminado',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar el alumno',
          life: 3000,
        });
      }
      isCreating.value = false;
    },
    reject: () => {},
  });
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  cedulaAlumno: { value: null, matchMode: FilterMatchMode.CONTAINS },
  primerNombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  primerApellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
  genero: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
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
    <h1 class="text-3xl font-bold">{{ id ? 'Editar' : 'Agregar' }} Alumno</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-row flex-wrap gap-2 justify-between">
          <div class="flex flex-col items-start">
            <label for="cedulaAlumno" class="block text-gray-600">CedulaAlumno</label>
            <InputText
              v-model="alumnosModel.cedulaAlumno"
              type="text"
              id="cedulaAlumno"
              name="cedulaAlumno"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            >
            </InputText>
          </div>
          
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="primerApellido" class="block text-gray-600">Primer Apellido</label>
            <InputText
              v-model="alumnosModel.primerApellido"
              type="text"
              id="primerApellido"
              name="primerApellido"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="segundoApellido" class="block text-gray-600">Segundo Apellido</label>
            <InputText
              v-model="alumnosModel.segundoApellido"
              type="text"
              id="segundoApellido"
              name="segundoApellido"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="primerNombre" class="block text-gray-600">Primer Nombre</label>
            <InputText
              v-model="alumnosModel.primerNombre"
              type="text"
              id="primerNombre"
              name="primerNombre"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="segundoNombre" class="block text-gray-600">Segundo Nombre</label>
            <InputText
              v-model="alumnosModel.segundoNombre"
              type="text"
              id="segundoNombre"
              name="segundoNombre"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autocomplete="off"
            />
          </div>
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="telefono" class="block text-gray-600">Teléfono</label>
            <InputText
              v-model="alumnosModel.telefono"
              type="text"
              id="telefono"
              name="telefono"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              maxlength="10"
              @input="alumnosModel.telefono = alumnosModel.telefono?.replace(/\D/g, '')"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="genero" class="block text-gray-600">Genero</label>
            <Dropdown
              v-model="alumnosModel.genero"
              id="genero"
              name="genero"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
              :options="['masculino', 'femenino', 'otro']"
              placeholder="Seleccione"
            >
            </Dropdown>
          </div>
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="email">Correo</label>
            <InputText
              v-model="alumnosModel.email"
              id="email"
              name="email"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              optionLabel="email"
              optionValue="id"
            >
            </InputText>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
          <div class="flex flex-col items-start">
            <label for="fechaNacimiento" class="block text-gray-600">Fecha Nacimiento</label>
            <DatePicker
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="alumnosModel.fechaNacimiento"
            />
          </div>
          

          <hr  class="h-[1px] w-full" />
          
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="Direccion">Dirección</label>
            <InputText
              v-model="alumnosModel.direccion"
              id="direccion"
              name="direccion"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            >
            </InputText>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>

          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="fechaIngreso" class="block text-gray-600">Fecha Ingreso</label>
            <DatePicker
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="alumnosModel.fechaIngreso"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="tipoSangre" class="block text-gray-600">Tipo Sangre</label>
            <Dropdown
              v-model="alumnosModel.tipoSangre"
              id="tipoSangre"
              name="tipoSangre"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']"
              placeholder="Seleccione"
            >
            </Dropdown>
          </div>
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="ocupacion">Ocupación</label>
            <Dropdown
              v-model="alumnosModel.ocupacion"
              id="ocupacion"
              name="ocupacion" 
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
              :options="['estudiante', 'trabaja', 'otro']"
              placeholder="Seleccione"
            >
            </Dropdown>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
          <div class="flex flex-col items-start">
            <label for="isActive" class="block text-gray-600">Active</label>
            <Dropdown
              v-model="alumnosModel.isActive"
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
        <section class="flex flex-row flex-wrap gap-2 justify-between">
          <hr style="border: 1px solid lightgray" class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="idClub" class="block text-gray-600">Club</label>
            <Dropdown
              v-model="alumnosModel.idClub"
              id="idClub"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              name="idClub"
              :options="loadedClubs"
              :loading="isLoading"
              optionValue="idClub"
              optionLabel="nombreClub"
              placeholder="Seleccione"
              @update:modelValue="querySucursals"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idSucursal" class="block text-gray-600">Sucursal</label>
            <Dropdown
              v-model="alumnosModel.idSucursal"
              id="idSucursal"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              name="idSucursal"
              :options="loadedSucursales"
              :loading="isLoadingSucursales"
              optionValue="idSucursal"
              optionLabel="nombreSucursal"
              placeholder="Seleccione"
            />
          </div>
        </section>
      </section>
    </form>
    <div class="flex flex-row justify-end w-full h-full">
      <div class="flex md:flex-row flex-col justify-between md:w-1/2 w-full p-8">
        <button
          v-if="alumnosModel.id"
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
