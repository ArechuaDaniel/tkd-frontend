<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { Column, DataTable, Dropdown, Tag} from 'primevue';
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
import { triggerGetAllPagos, type Pago } from '@/api/pago';

const allowedRoles = [Roles.SUCURSAL, Roles.CLUB, Roles.ADMIN, Roles.INSTRUCTOR];

const authStore = useAuthStore()
const router = useRouter();
const loadedPago = ref<Pago[]>([]);
const isLoading = ref(false);


onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedPago.value = await triggerGetAllPagos();
  isLoading.value = false;

 
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'alumno.primerNombre' : { value: null, matchMode: FilterMatchMode.CONTAINS },
  'alumno.primerApellido' : { value: null, matchMode: FilterMatchMode.CONTAINS },
  'alumno.cedulaAlumno' : { value: null, matchMode: FilterMatchMode.CONTAINS },
  mesPago: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'sucursal.nombreSucursal' : { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>
<template>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else>

    <h1 class="text-3xl font-bold">Datos de los Pagos</h1>
    <div class="flex justify-end items-end">
      <label for="" class="w-full">&nbsp;</label>
      <RouterLink
      v-tooltip="'Añadir un nuevo pago'"
      class="min-w-[100px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      :to="{ name: RouteNames.addPagoView}"
      aria-label="Añadir un nuevo pago"
      >
      <i class="pi pi-plus"></i>&nbsp; Agregar
    </RouterLink>
  </div>
  <DataTable
  :value="loadedPago"
    stripedRows
    :loading="isLoading"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    filterDisplay="row"
    v-model:filters="filters"
    v-model:selection="filters"
  >
  <Column field="idPago" header="Acción">
    <template #body="slotProps">
      <RouterLink
      :to="'/admin/pago/editar/' +slotProps.data.idPago"
        :class="[
          'bg-transparent border-blue-900 border-2 text-blue-900 py-1 px-2',
          'rounded-lg flex flex-row w-fit hover:bg-blue-900 hover:text-white mr-2',
        ]"
        v-tooltip="'Editar pago'"
        >
        <i class="pi pi-pencil"></i>
      </RouterLink>
      </template>
    </Column>
    
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
    <Column field="valor" header="Valor" >
      <template #body="slotProps">
      {{Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(slotProps.data.valor)}}
      </template>
    </Column>
    <Column field="fechaPago" header="Fecha Pago" sortable>
      <template #body="slotProps">
        {{ Intl.DateTimeFormat('es-EC').format(new Date(slotProps.data.fechaPago)) }}
      </template>
    </Column>
    <Column field="mesPago" header="Mes Pago" sortable :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
        v-model="filterModel.value"
        @change="filterCallback()"
        :options="['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']"
        :showClear="true"
        placeholder="Seleccione"
        class="p-column-filter capitalize"
        >
        <template #option="slotProps">
          <Tag :value="slotProps.option" />
        </template>
      </Dropdown>
    </template>
    </Column>

    <Column
    field="sucursal.nombreSucursal"
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
            loadedPago
              ?.map((x) => x.sucursal?.nombreSucursal || '')
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
          {{ slotProps.data.sucursal?.nombreSucursal || 'Sin Sucursal' }}
        </p>
      </template>
    </Column>
  </DataTable>
</div>
</template>
