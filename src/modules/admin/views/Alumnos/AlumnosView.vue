<script setup lang="ts">
import { triggerGetAllAlumnos, type Alumnos } from '@/api/alumno';
import { FilterMatchMode } from '@primevue/core/api';
import { Column, DataTable, Tag } from 'primevue';
import InputText from 'primevue/inputtext';
import { onMounted, ref } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/domain/utils/route.util';

const router = useRouter();
const loadedAlumnos = ref<Alumnos[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  loadedAlumnos.value = await triggerGetAllAlumnos();

  isLoading.value = false;
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  cedulaAlumno: { value: null, matchMode: FilterMatchMode.CONTAINS },
  primerNombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  primerApellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
  genero: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  <h1 class="text-3xl font-bold">Datos de Alumnos</h1>
  <div class="flex justify-end items-end">
    <label for="" class="w-full">&nbsp;</label>
    <RouterLink
      v-tooltip="'Añadir un nuevo alumno'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.addAlumnosView }"
      aria-label="Añadir un nuevo contrato"
    >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink>
  </div>
  <DataTable
    :value="loadedAlumnos"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
    <Column field="id" header="Acción">
      <template #body="slotProps">
        <RouterLink
        :to="'/admin/alumnos/editar-alumno/' +slotProps.data.id"
        :class="[
          'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
          'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
        ]"
        v-tooltip="'Editar alumno'"
      >
        <i class="pi pi-pencil"></i>
      </RouterLink>
      </template>
    </Column>
    <Column field="cedulaAlumno" header="Cédula" sortable :showFilterMenu="false">
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
    <Column field="fechaIngreso" header="Fecha Ingreso">
      <template #body="slotProps">
        {{ Intl.DateTimeFormat('es-EC').format(new Date(slotProps.data.fechaIngreso)) }}
      </template>
    </Column>
    <Column field="fechaNacimiento" header="Edad">
      <template #body="slotProps">
        {{ calcularEdad(slotProps.data.fechaNacimiento) }} años
      </template>
    </Column>
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
  </DataTable>
</template>
