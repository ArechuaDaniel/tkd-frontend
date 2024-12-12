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
  if (authStore.user?.roles === Roles.INSTRUCTOR ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedUsers.value = await triggerGetAllUsuario();
  isLoading.value = false;
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  cedula: { value: null, matchMode: FilterMatchMode.CONTAINS },
  primerNombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  primerApellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
  genero: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'sucursals.nombreSucursal': { value: null, matchMode: FilterMatchMode.CONTAINS },
  idClub: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'clubs.nombreClub': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'asociacions.asociacion': { value: null, matchMode: FilterMatchMode.CONTAINS },
  //centrocos: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

  
  <h1 class="text-3xl font-bold">Datos de Usuarios</h1>
  <div class="flex justify-end items-end">
    <label for="" class="w-full">&nbsp;</label>
    <!-- <RouterLink
      v-if="
        [Roles.ADMIN, Roles.SUCURSAL, Roles.ASOCIACION, Roles.CLUB].includes(
          authStore.user?.roles as Roles,
        )
      "
      v-tooltip="'Añadir un nuevo usuario'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.editUserView }"
      aria-label="Añadir un nuevo Usuario"
    >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink> -->
  </div>
  <div class="overflow-x-auto w-full">
    <DataTable
    :value="loadedUsers"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
    <Column field="idUsuario" header="Acción"
      v-if="[Roles.ADMIN, Roles.SUCURSAL, Roles.INSTRUCTOR, Roles.CLUB].includes(authStore.user?.roles as Roles,)"
    >
      <template #body="slotProps">
        <RouterLink
          :to="'/admin/usuario/editar/' + slotProps.data.idUsuario"
          :class="[
            'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
            'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
          ]"
          v-tooltip="'Editar Usuario'"
          >
          <i class="pi pi-pencil"></i>
        </RouterLink>
      </template>
    </Column>
    <Column field="cedula" header="Cédula" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          type="text"
          v-model="filterModel.value"
          @input="filterCallback()"
          class="p-column-filter w-28"
          placeholder="Buscar"
          />
      </template>
    </Column>
    <Column field="primerNombre" header="Nombre" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          type="text"
          v-model="filterModel.value"
          @input="filterCallback()"
          class="p-column-filter w-28"
          placeholder="Buscar"
          />
      </template>
    </Column>
    <Column field="primerApellido" header="Apellido" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText
        type="text"
          v-model="filterModel.value"
          @input="filterCallback()"
          class="p-column-filter w-28"
          placeholder="Buscar"
          />
      </template>
    </Column>
    <!-- <Column field="fechaIngreso" header="Fecha Ingreso">
      <template #body="slotProps">
        {{ Intl.DateTimeFormat('es-EC').format(new Date(slotProps.data.fechaIngreso)) }}
      </template>
    </Column>
    <Column field="fechaNacimiento" header="Edad">
      <template #body="slotProps">
        {{ calcularEdad(slotProps.data.fechaNacimiento) }} años
      </template>
    </Column> -->
    <Column field="genero" header="Género" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
        v-model="filterModel.value"
        @change="filterCallback()"
        :options="['masculino', 'femenino', 'otro']"
        :showClear="true"
        placeholder="Seleccione"
        class="p-column-filter capitalize"
        >
        <template #option="slotProps">
          <Tag :value="slotProps.option" />
        </template>
      </Dropdown>
    </template>
    <template #body="slotProps">
        <p class="capitalize">
          {{ slotProps.data.genero }}
        </p>
      </template>
    </Column>
    <Column field="asociacions.asociacion" header="Asociación" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
          v-if="[Roles.ADMIN, Roles.ASOCIACION].includes(authStore.user?.roles as Roles)"
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="
            loadedUsers
              ?.map((x) => x.asociacions?.asociacion || '')
              .filter((value, index, self) => value && self.indexOf(value) === index) || []
          "
          :showClear="true"
          placeholder="Seleccione"
          class="p-column-filter"
        >
          <template #option="slotProps">
            <Tag :value="slotProps.option" />
          </template>
        </Dropdown>
      </template>
      <template #body="slotProps">
        <p class="capitalize">
          {{ slotProps.data.asociacions?.asociacion || 'Sin Asociación' }}
        </p>
      </template>
    </Column>
    <Column field="clubs.nombreClub" header="Club" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
          v-if="[Roles.ADMIN, Roles.ASOCIACION].includes(authStore.user?.roles as Roles)"
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="
            loadedUsers
              ?.map((x) => x.clubs?.nombreClub || '')
              .filter((value, index, self) => value && self.indexOf(value) === index) || []
          "
          :showClear="true"
          placeholder="Seleccione"
          class="p-column-filter"
        >
          <template #option="slotProps">
            <Tag :value="slotProps.option" />
          </template>
        </Dropdown>
      </template>
      <template #body="slotProps">
        <p class="capitalize">
          {{ slotProps.data.clubs?.nombreClub || 'Sin Club' }}
        </p>
      </template>
    </Column>
    <Column
    field="sucursals.nombreSucursal"
    header="Sucursal"
    sortable
    :showFilterMenu="false"
    v-if="[Roles.ADMIN, Roles.SUCURSAL, Roles.INSTRUCTOR, Roles.CLUB].includes(authStore.user?.roles as Roles,)">
    <template #filter="{ filterModel, filterCallback }">
        <Dropdown
          v-if="[Roles.ADMIN, Roles.CLUB].includes(authStore.user?.roles as Roles,)"
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="
            loadedUsers
              ?.map((x) => x.sucursals?.nombreSucursal || '')
              .filter((value, index, self) => value && self.indexOf(value) === index) || []
          "
          :showClear="true"
          placeholder="Seleccione"
          class="p-column-filter"
        >
          <template #option="slotProps">
            <Tag :value="slotProps.option" />
          </template>
        </Dropdown>
      </template>
      <template #body="slotProps">
        <p class="capitalize">
          {{ slotProps.data.sucursals?.nombreSucursal || 'Sin Sucursal' }}
        </p>
      </template>
    </Column>
  </DataTable>
</div>
  </div>
</template>
