<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { Column, DataTable, Tag } from 'primevue';
import InputText from 'primevue/inputtext';
import { onMounted, ref } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';
import { triggerGetAllAsociaciones, type Asociacion } from '@/api/asociacion';
import { RouteNames } from '@/domain/utils/route.util';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { Roles } from '@/domain/entities/Roles';

const authStore = useAuthStore()
const router = useRouter();
const loadedAsociaciones = ref<Asociacion[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  if (authStore.user?.roles === Roles.CLUB || authStore.user?.roles === Roles.SUCURSAL || authStore.user?.roles === Roles.INSTRUCTOR || authStore.user?.roles === Roles.ASOCIACION ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedAsociaciones.value = await triggerGetAllAsociaciones();

  isLoading.value = false;
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  asociacion: { value: null, matchMode: FilterMatchMode.CONTAINS },
  director: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  <h1 class="text-3xl font-bold">Datos de Asociación</h1>
  <div class="flex justify-end items-end">
    <label for="" class="w-full">&nbsp;</label>
    <RouterLink
      v-tooltip="'Añadir una nueva asociación'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.addAsociacionView }"
      aria-label="Añadir una nueva Asociación"
    >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink>
  </div>
  <DataTable
    :value="loadedAsociaciones"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
    <Column field="idAsociacion" header="Acción">
      <template #body="slotProps">
        <RouterLink
        :to="'/admin/asociacion/editar-asociacion/' +slotProps.data.idAsociacion"
        :class="[
          'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
          'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
        ]"
        v-tooltip="'Editar Asociación'"
      >
        <i class="pi pi-pencil"></i>
      </RouterLink>
      </template>
    </Column>
    <Column field="asociacion" header="Nombre Asociación" sortable :showFilterMenu="false">
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
    <Column field="director" header="Director" sortable :showFilterMenu="false">
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
    <Column field="fechaAfiliacion" header="Fecha Afiliación">
      <template #body="slotProps">
        {{ Intl.DateTimeFormat('es-EC').format(new Date(slotProps.data.fechaAfiliacion)) }}
      </template>
    </Column>
  </DataTable>
</template>
