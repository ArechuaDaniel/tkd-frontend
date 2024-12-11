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
import { triggerGetAllAsistencias, type Asistencia } from '@/api/asistencia';
import { triggerGetAllAsensos, type Asenso } from '@/api/asenso';

const allowedRoles = [Roles.SUCURSAL, Roles.CLUB, Roles.ADMIN, Roles.INSTRUCTOR];

const authStore = useAuthStore()
const router = useRouter();
const loadedAsenso = ref<Asenso[]>([]);
const isLoading = ref(false);


onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedAsenso.value = await triggerGetAllAsensos();
  isLoading.value = false;

 
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'alumno.primerNombre' : { value: null, matchMode: FilterMatchMode.CONTAINS },
  'alumno.primerApellido' : { value: null, matchMode: FilterMatchMode.CONTAINS },
  'alumno.cedulaAlumno' : { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>
<template>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else>

    <h1 class="text-3xl font-bold">Datos de los Asensos</h1>
    <div class="flex justify-end items-end">
      <label for="" class="w-full">&nbsp;</label>
      <RouterLink
      v-if="[Roles.ADMIN, Roles.CLUB].includes(authStore.user?.roles as Roles,)"
      v-tooltip="'Añadir una nuevo asenso'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.addAsensoView}"
      aria-label="Añadir una nueva Sucursal"
      >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink>
  </div>
  <DataTable
  :value="loadedAsenso"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
  <Column field="idAsenso" header="Acción">
    <template #body="slotProps">
      <RouterLink
      :to="'/admin/asenso/editar/' +slotProps.data.idAsenso"
        :class="[
          'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
          'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
        ]"
        v-tooltip="'Editar asenso'"
        >
        <i class="pi pi-pencil"></i>
      </RouterLink>
      </template>
    </Column>
    <Column field="cinturon.color" header="Color">
      <template #body="slotProps">
        <div v-if="!slotProps.data.cinturon.color2" class="w-[4rem] border border-gray-600 ">
          <div v-if="slotProps.data.cinturon.color == 'black'">
            <p class="h-[1rem] bg-black">
              .
            </p>
            <p class="h-[1rem] bg-black">.</p>
          </div>
          <div v-if="slotProps.data.cinturon.color !== 'black'">
            <p :class="['h-[1rem] bg-' + slotProps.data.cinturon.color +'-500']">
              .
            </p>
            <p :class="['h-[1rem] bg-' + slotProps.data.cinturon.color +'-500']">
              .
            </p>
          </div>
        </div>

        <div v-if="slotProps.data.cinturon.color2" class="w-[4rem] border border-gray-600 ">
          <div v-if="slotProps.data.cinturon.color2 === 'black'">
            <p :class="['h-[1rem] bg-' + slotProps.data.cinturon.color +'-500']">
              .
            </p>
            <p class="h-[1rem] bg-black">
              .
            </p>
          </div>
          <div v-if="slotProps.data.cinturon.color2 !== 'black'">
            <p :class="['h-[1rem] bg-' + slotProps.data.cinturon.color +'-500']">
              .
            </p>
            <p :class="['h-[1rem] bg-' + slotProps.data.cinturon.color2 +'-500']">
              .
            </p>
          </div>
        </div>
       
      </template>
    </Column>
    <Column field="cinturon.asensoColor" header="Cinturon" sortable></Column>
    <Column field="alumno.cedulaAlumno" header="Cédula" sortable :showFilterMenu="false">
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
    <Column field="alumno.primerNombre" header="Nombre" sortable :showFilterMenu="false">
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
    <Column field="alumno.primerApellido" header="Apellido" sortable :showFilterMenu="false">
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
    
    <Column field="fechaAsenso" header="Fecha Asenso" sortable>
      <template #body="slotProps">
        {{ Intl.DateTimeFormat('es-EC').format(new Date(slotProps.data.fechaAsenso)) }}
      </template>
    </Column>
    <Column field="club.nombreClub" header="Club" sortable></Column>
    <Column field="sucursal.nombreSucursal" header="Sucursal" sortable></Column>

   
  </DataTable>
</div>
</template>
