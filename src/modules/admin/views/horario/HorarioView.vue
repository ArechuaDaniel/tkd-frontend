<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { Column, DataTable} from 'primevue';
import InputText from 'primevue/inputtext';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerGetAllSucursals, type Sucursals } from '@/api/sucursal';
import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import NotAllowed from '../../components/NotAllowed.vue';
import { triggerGetAllHorarioss, type Horarios } from '@/api/horario';

const allowedRoles = [Roles.SUCURSAL, Roles.CLUB, Roles.ADMIN, Roles.INSTRUCTOR];

const authStore = useAuthStore()
const router = useRouter();
const loadedHorario = ref<Horarios[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedHorario.value = await triggerGetAllHorarioss();

  isLoading.value = false;
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>
<template>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else>

    <h1 class="text-3xl font-bold">Datos de los Horarios</h1>
    <div class="flex justify-end items-end">
      <label for="" class="w-full">&nbsp;</label>
      <RouterLink
      v-tooltip="'Añadir una nueva asociación'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.addHorariosView }"
      aria-label="Añadir una nueva Sucursal"
      >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink>
  </div>
  <DataTable
  :value="loadedHorario"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
  <Column field="idHorario" header="Acción">
    <template #body="slotProps">
      <RouterLink
      :to="'/admin/horario/editar/' +slotProps.data.idHorario"
        :class="[
          'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
          'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
        ]"
        v-tooltip="'Editar asistencia'"
        >
        <i class="pi pi-pencil"></i>
      </RouterLink>
      </template>
    </Column>
    <Column field="inicio" header="Inicio" sortable :showFilterMenu="false">
      
    </Column>
    <Column field="fin" header="Fin" sortable :showFilterMenu="false">
      
    </Column>
   
  </DataTable>
</div>
</template>
