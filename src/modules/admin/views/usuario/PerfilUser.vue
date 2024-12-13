<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { Column, DataTable, Tag } from 'primevue';
import InputText from 'primevue/inputtext';
import { onMounted, ref } from 'vue';
import Dropdown from 'primevue/dropdown';
import { RouteNames } from '@/domain/utils/route.util';

import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import {  triggerGetAllUsuario, type Usuario} from '@/api/users';
import { RouterLink } from 'vue-router';
import NotAllowed from '../../components/NotAllowed.vue';

const allowedRoles = [Roles.SUCURSAL, Roles.CLUB, Roles.ADMIN, Roles.ASOCIACION];
const authStore = useAuthStore();
const loadedUsers = ref<Usuario[] | null>([]);
const isLoading = ref(false);

onMounted(async () => {
  
  
});

const calcularEdad = (fechaNacimiento: any) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  // Si el mes actual es menor al mes de nacimiento o es el mismo pero el día actual es menor, restamos un año
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};
</script>
<template>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
 <div v-else>
  <h1 class="text-3xl font-bold">Perfil</h1>
  <div class="flex justify-end items-end">
    <RouterLink
      v-tooltip="'Editar pefil'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="'/admin/usuario/editar/' + authStore.user?.idUsuario"
      aria-label="Editar pefil"
      >
      <i class="pi pi-pencil"></i>&nbsp; Editar
    </RouterLink>
  </div>
 <div class="flex flex-col items-center justify-center gap-2 w-full h-full">
    <p class="bg-gray-100 rounded-full p-4 ">
        <i class="pi pi-user p-3" style="font-size: 6.5rem"></i>
    </p>
        
    <div class="flex flex-col gap-2  p-4 rounded-md bg-gray-200 shadow-xl">
        <p class="font-bold">Cédula: 
            <span class="font-normal">
                {{ authStore.user?.cedula }}
            </span> 
        </p>
        <p class="capitalize font-bold">Nombres:
            <span class="font-normal">
                
                {{ authStore.user?.primerNombre + ' ' + authStore.user?.primerApellido }}
            </span>
        </p>
        <p class="capitalize font-bold">Edad: 
            <span class="font-normal">

                {{ calcularEdad(authStore.user?.fechaNacimiento ? authStore.user?.fechaNacimiento + 'años' : 'Sin información') }}
            </span>
        </p>
        <p class="capitalize font-bold">
            Género: {{ authStore.user?.genero }}
            <span class="font-normal"></span>
        </p>
        <p class="capitalize font-bold">Celular: 
            <span class="font-normal">

                {{ authStore.user?.telefono }}
            </span>
        </p>
        <p class="capitalize font-bold">Tipo Sangre: 
            <span class="font-normal">

                {{ authStore.user?.tipoSangre }}
            </span>
        </p>
        <p class="capitalize font-bold"> Email: 
            <span class="font-normal">

                {{ authStore.user?.email }}
            </span>
        </p>
        <p class="capitalize font-bold"> Rol: 
            <span class="font-normal">

                {{ authStore.user?.roles }}
            </span>
        </p>
    </div>
</div>
    
  </div>
</template>
