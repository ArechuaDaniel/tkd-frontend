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

import { computed, onMounted, ref, watch } from 'vue';
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
import { triggerGetUserById, triggerUserRemove, triggerUsuarioSave, type Usuario } from '@/api/users';
import { triggerGetAllAsociaciones, type Asociacion } from '@/api/asociacion';

const authStore = useAuthStore();

const router = useRouter();

// id del alumno
const idUsuario: number | undefined = router.currentRoute.value.params.id as any;
const confirm = useConfirm();
const toast = useToast();

const loadedAsociaciones = ref<Asociacion[]>([]);
const isLoadingASociaciones = ref(false);

const loadedAlumnos = ref<Alumnos[]>([]);
const isLoading = ref(false);

const loadedClubs = ref<Clubs[]>([]);
const loadedSucursales = ref<Sucursals[]>([]);

const isLoadingSucursales = ref(false);

const isCreating = ref(false);
const usersModel = ref<Usuario>({
  idUsuario: 0,
  idClub: 0,
  idSucursal: 0,
  idAsociacion: 0,
  primerApellido: '',
  segundoApellido: '',
  primerNombre: '',
  segundoNombre: '',
  cedula: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: undefined,
  email: '',
  isActive: true,
  genero: '',
  tipoSangre: '',
  roles: '',
  
});

onMounted(async () => {
  // if (authStore.user?.roles === Roles.INSTRUCTOR) {
	// 	window.location.href = '/admin/dashboard'
	// 	return;
	// }

  
  isLoading.value = true;
  loadedClubs.value = await triggerGetAllClubs();
  isLoading.value = false;

  //querySucursals();
  queryAsociaciones();
  reassembleModel();
  //queryProvincias();
});
const queryAsociaciones = async () => {
  isLoadingASociaciones.value = true;
  loadedAsociaciones.value = await triggerGetAllAsociaciones();
  isLoadingASociaciones.value = false;

}
const querySucursals = async () => {
  isLoadingSucursales.value = true;
  loadedSucursales.value = await triggerGetAllSucursals();
  isLoadingSucursales.value = false;
};
const reassembleModel = async () => {
  if (idUsuario) {
    isCreating.value = true;
    const users = await triggerGetUserById(idUsuario);
    if (users) {
      usersModel.value.idUsuario = users.idUsuario;
      usersModel.value.cedula = users.cedula;
      usersModel.value.fechaNacimiento = users.fechaNacimiento;
      usersModel.value.primerApellido = users.primerApellido;
      usersModel.value.segundoApellido = users.segundoApellido;
      usersModel.value.primerNombre = users.primerNombre;
      usersModel.value.segundoNombre = users.segundoNombre;
      usersModel.value.telefono = users.telefono;
      usersModel.value.genero = users.genero;
      usersModel.value.email = users.email;
      usersModel.value.fechaNacimiento = users.fechaNacimiento;
      usersModel.value.direccion = users.direccion;
      usersModel.value.tipoSangre = users.tipoSangre;
      usersModel.value.isActive = users.isActive;
      usersModel.value.idAsociacion = users.idAsociacion;
      usersModel.value.idClub = users.idClub;
      usersModel.value.idSucursal = users.idSucursal;
      usersModel.value.roles = users.roles;
     //await queryAsociaciones();
      await querySucursals();
      
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;

  const result = await triggerUsuarioSave({
    ...usersModel.value,
  });
  
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.userView});
  }
};

const startRemoving = async () => {
  if (!idUsuario) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar el usuario?',
    header: 'Eliminar Usuario',
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
      const result = await triggerUserRemove(idUsuario);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Usuario eliminado',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar el Usuario',
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
const getRoles = () => {
  if (authStore.user?.roles === Roles.ADMIN) {
    return [ 'sucursal', 'instructor', 'club', 'asociacion'];
  }
  if (authStore.user?.roles === Roles.SUCURSAL) {
    return ['instructor'];
  }
  if (authStore.user?.roles === Roles.ASOCIACION) {
    return ['club'];
  }

  if (authStore.user?.roles === Roles.CLUB) {
    return ['instructor, sucursal'];
  }

  return [];
}
// Opciones de roles basadas en el rol del usuario
const rolesOptions = computed(() => {
      const userRole = authStore?.user?.roles;

      switch (userRole) {
        case Roles.ADMIN:
          return ["admin", "sucursal", "instructor", "club", "asociacion"];
        case Roles.SUCURSAL:
          return ["instructor"];
        case Roles.ASOCIACION:
          return ["club"];
        case Roles.CLUB:
          return ["instructor", "sucursal"];
        default:
          return [];
      }
    });
  
</script>
<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <div class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-between items-center">
    <h1 class="text-3xl font-bold">Editar Usuario .</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-row flex-wrap gap-2 justify-between">
          <div class="flex flex-col items-start">
            <label for="cedula" class="block text-gray-600">Cedula</label>
            <InputText
              v-model="usersModel.cedula"
              type="text"
              id="cedula"
              name="cedula"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              maxlength="10"
              @input="usersModel.cedula = usersModel.cedula?.replace(/\D/g, '')"
            >
            </InputText>
          </div>
          
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="primerApellido" class="block text-gray-600">Primer Apellido</label>
            <InputText
              v-model="usersModel.primerApellido"
              type="text"
              id="primerApellido"
              name="primerApellido"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="segundoApellido" class="block text-gray-600">Segundo Apellido</label>
            <InputText
              v-model="usersModel.segundoApellido"
              type="text"
              id="segundoApellido"
              name="segundoApellido"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="primerNombre" class="block text-gray-600">Primer Nombre</label>
            <InputText
              v-model="usersModel.primerNombre"
              type="text"
              id="primerNombre"
              name="primerNombre"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="segundoNombre" class="block text-gray-600">Segundo Nombre</label>
            <InputText
              v-model="usersModel.segundoNombre"
              type="text"
              id="segundoNombre"
              name="segundoNombre"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              
            />
          </div>
          <hr  class="h-[1px] w-full" />
          <div class="flex flex-col items-start">
            <label for="telefono" class="block text-gray-600">Teléfono</label>
            <InputText
              v-model="usersModel.telefono"
              type="text"
              id="telefono"
              name="telefono"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              maxlength="10"
              @input="usersModel.telefono = usersModel.telefono?.replace(/\D/g, '')"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="genero" class="block text-gray-600">Genero</label>
            <Dropdown
              v-model="usersModel.genero"
              id="genero"
              name="genero"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
              :options="['masculino', 'femenino', 'otro']"
              placeholder="Seleccione"
            >
            </Dropdown>
          </div>
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="Direccion">Dirección</label>
            <InputText
              v-model="usersModel.direccion"
              id="direccion"
              name="direccion"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
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
              v-model="usersModel.fechaNacimiento"
            />
          </div>
          

          <hr  class="h-[1px] w-full" />
          
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="email">Correo</label>
            <InputText
              v-model="usersModel.email"
              id="email"
              name="email"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              optionLabel="email"
              optionValue="id"
            >
            </InputText>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
     

          <hr  class="h-[1px] w-full" />
          
          <div class="flex flex-col items-start">
            <label for="tipoSangre" class="block text-gray-600">Tipo Sangre</label>
            <Dropdown
              v-model="usersModel.tipoSangre"
              id="tipoSangre"
              name="tipoSangre"
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']"
              placeholder="Seleccione"
            >
            </Dropdown>
          </div>
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="roles">Rol</label>
            <InputText
              disabled
              v-if="usersModel.idUsuario"
              v-model="usersModel.roles"
              id="roles"
              name="roles" 
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
            ></InputText>
            <Dropdown
            v-if="!usersModel.idUsuario"
              v-model="usersModel.roles"
              id="roles"
              name="roles" 
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
              :options="rolesOptions"
              placeholder="Seleccione"
            ></Dropdown>
            
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
          <div class="flex flex-col items-start">
            <label for="isActive" class="block text-gray-600">Active</label>
            <Dropdown
              v-model="usersModel.isActive"
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
            <label for="isActive" class="block text-gray-600">Asociación</label>
            <Dropdown
              v-model="usersModel.idAsociacion"
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
            <label for="idClub" class="block text-gray-600">Club</label>
            <Dropdown
              v-model="usersModel.idClub"
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
          <div class="flex flex-col items-start" v-if="[Roles.ADMIN, Roles.SUCURSAL, Roles.CLUB].includes(authStore.user?.roles as Roles,)">
            <label for="idSucursal" class="block text-gray-600">Sucursal</label>
            <Dropdown
              v-model="usersModel.idSucursal"
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
          {{ usersModel }}
        </section>
      </section>
    </form>
    <div class="flex flex-row justify-end w-full h-full"
    >
    <div class="flex md:flex-row flex-col justify-between md:w-1/2 w-full p-8"
    >
    <button
      v-if="[Roles.ADMIN, Roles.SUCURSAL, Roles.CLUB, Roles.ASOCIACION].includes(authStore.user?.roles as Roles, ) && usersModel.idUsuario"
          
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
