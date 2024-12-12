<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { Column, DataTable, Tag } from 'primevue';
import InputText from 'primevue/inputtext';
import { onMounted, ref } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';
import { triggerGetAllAsociaciones, type Asociacion } from '@/api/asociacion';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerGetAllClubs, type Clubs } from '@/api/club';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { Roles } from '@/domain/entities/Roles';

const authStore = useAuthStore()
const router = useRouter();
const loadedClubs = ref<Clubs[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  if (authStore.user?.roles === Roles.SUCURSAL || authStore.user?.roles === Roles.INSTRUCTOR || authStore.user?.roles === Roles.CLUB ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedClubs.value = await triggerGetAllClubs();

  isLoading.value = false;
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nombreClub: { value: null, matchMode: FilterMatchMode.CONTAINS },
  director: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>
<template>
  <h1 class="text-3xl font-bold">Datos de Clubes</h1>
  <div class="flex justify-end items-end">
    <label for="" class="w-full">&nbsp;</label>
    <RouterLink
      v-tooltip="'Añadir una nuevo Club'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.addClubView }"
      aria-label="Añadir un nuevo Club"
    >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink>
  </div>
  <DataTable
    :value="loadedClubs"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
    <Column field="idClub" header="Acción">
      <template #body="slotProps">
        <RouterLink
        :to="'/admin/club/editar-club/' +slotProps.data.idClub"
        :class="[
          'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
          'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
        ]"
        v-tooltip="'Editar Club'"
      >
        <i class="pi pi-pencil"></i>
      </RouterLink>
      </template>
    </Column>
    <Column field="nombreClub" header="Nombre Club" sortable :showFilterMenu="false">
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
    <Column field="siglas" header="Siglas"></Column>
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
