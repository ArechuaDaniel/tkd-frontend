<script setup lang="ts">

import { DatePicker, InputNumber, Toast, useConfirm, useToast } from 'primevue';
import InputText from 'primevue/inputtext';

import { computed, onMounted, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';

import ConfirmDialog from 'primevue/confirmdialog';
import { RouteNames } from '@/domain/utils/route.util';
import { triggerAsociacionRemove, triggerAsociacionSave, triggerGetAllAsociaciones, triggerGetAsociacionById, type Asociacion } from '@/api/asociacion';
import { triggerClubRemove, triggerClubSave, triggerGetAllClubs, triggerGetClubById, type Clubs } from '@/api/club';
import { triggerGetAllSucursals, triggerGetSucursalById, triggerSucursalRemove, triggerSucursalSave, type Sucursals } from '@/api/sucursal';
import { Roles } from '@/domain/entities/Roles';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { triggerGetAllHorarioss, triggerGetHorarioById, triggerHorarioRemove, triggerHorarioSave, type Horarios } from '@/api/horario';
import { triggerAsistenciaRemove, triggerAsistenciaSave, triggerGetAsistenciaById, type Asistencia } from '@/api/asistencia';
import { triggerGetAllAlumnos, type Alumnos } from '@/api/alumno';
import { triggerAsensoRemove, triggerAsensoSave, triggerGetAllCinturones, triggerGetAsensoById, type Asenso, type Cinturon } from '@/api/asenso';
import { triggerGetPagoById, triggerPagoRemove, triggerPagoSave, type Pago } from '@/api/pago';

const allowedRoles = [Roles.SUCURSAL,Roles.INSTRUCTOR, Roles.ADMIN, Roles.CLUB];
const authStore = useAuthStore()
const router = useRouter();

const idPago: number | undefined = router.currentRoute.value.params.id as any;

const confirm = useConfirm();
const toast = useToast();

const isCreating = ref(false);
const loadedSucursal = ref<Sucursals[]>([]);
const isLoading = ref(false);


const loadedAlumnos = ref<Alumnos[]>([]);
const isLoadingAlumnos = ref(false);


const pagoModel = ref<Pago>({
    idSucursal: 0,
    valor: 0,
    fechaPago: undefined,
    idAlumno: 0,
    idPago: 0,
    mesPago: '',
    comprobante: undefined,
    formaPago: undefined,
});

onMounted(async () => {
  if (authStore.user?.roles === Roles.ASOCIACION ) {
		window.location.href = '/admin/dashboard'
		return;
	}
  isLoading.value = true;
  loadedSucursal.value = await triggerGetAllSucursals();
  isLoading.value = false;


  //querySucursals();
  reassembleModel();
  //queryProvincias();
});
const onChangeSucursal = async () => {
 

  isLoadingAlumnos.value = true;
  loadedAlumnos.value = await triggerGetAllAlumnos(pagoModel.value.idSucursal);
  isLoadingAlumnos.value = false;
}

const reassembleModel = async () => {
  if (idPago) {
    isCreating.value = true;
    const pago = await triggerGetPagoById(idPago);
    if (pago) {
      pagoModel.value.idPago = pago.idPago
      pagoModel.value.idSucursal = pago.idSucursal;
      pagoModel.value.fechaPago = pago.fechaPago;
      pagoModel.value.mesPago = pago.mesPago;
      pagoModel.value.valor = pago.valor;
      pagoModel.value.idAlumno = pago.idAlumno;
      pagoModel.value.comprobante = pago.comprobante;
      pagoModel.value.formaPago = pago.formaPago;
    }
    isCreating.value = false;
  }
};
const startSaving = async () => {
  isCreating.value = true;
  const result = await triggerPagoSave({
    ...pagoModel.value,
  });
  isCreating.value = false;
  
  if (result) {
    router.push({name: RouteNames.pagoView});
  }
};

const startRemoving = async () => {
  if (!idPago) return;
  //confirm2()

  confirm.require({
    message: 'Desea eliminar el Pago?',
    header: 'Eliminar Pago',
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
      const result = await triggerPagoRemove(idPago);
      if (result) {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Pago eliminado',
          life: 3000,
        });
      }
      if (!result) {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se pudo eliminar el Pago',
          life: 3000,
        });
      }
      isCreating.value = false;
    },
    reject: () => {},
  });
};
const formattedAlumnos = computed(() =>
      loadedAlumnos.value.map((alumno) => ({
        ...alumno,
        fullName: `${alumno.primerApellido} ${alumno.primerNombre}`,
      }))
    );
</script>
<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <NotAllowed v-if="!allowedRoles.includes(authStore.user?.roles as Roles)" />
  <div v-else class="p-4 overflow-auto h-full w-full">
  <div class="flex md:flex-row flex-col justify-center items-center">
    <h1 class="text-3xl font-bold">{{ idPago ? 'Editar' : 'Agregar' }} Pago</h1>
  </div>
  <div class="p-4">
    <form>
      <section class="flex flex-col text-sm gap-2 mt-2 bg-white w-full my-2 rounded-lg shadow">
        <section class="flex flex-col gap-2 justify-center items-center">
          <div class="flex flex-col items-start" >
            <label for="idSucursal" class="block text-gray-600">Sucursal</label>
            <Dropdown
              v-model="pagoModel.idSucursal"
              ref="fullNameInputRef"
              type="text"
              id="idSucursal"
              name="idSucursal"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="loadedSucursal"
              optionLabel="nombreSucursal"
              optionValue="idSucursal"
              placeholder="Seleccione"
              @update:modelValue="onChangeSucursal"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="idAlumno" class="block text-gray-600">Alumno</label>
            <Dropdown
              v-model="pagoModel.idAlumno"
              ref="fullNameInputRef"
              type="text"
              id="idAlumno"
              name="idAlumno"
              class="w-[15rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500"
              :options="formattedAlumnos"
              optionLabel="fullName"
              optionValue="id"
              placeholder="Seleccione"
              :disabled="!pagoModel.idSucursal"
            />
          </div>
          
          <div class="flex flex-col items-start">
            <label for="fechaPago" class="block text-gray-600">Fecha Pago</label>
            <DatePicker
              showIcon
              fluid
              :showOnFocus="false"
              inputId="buttondisplay"
              class="w-[13rem]"
              v-model="pagoModel.fechaPago"
            />
          </div>
          <div class="flex flex-col items-start">
            <label for="mesPago" class="block text-gray-600">Mes Pago</label>
            <Dropdown
              v-model="pagoModel.mesPago"
              id="mesPago"
              name="mesPago" 
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
              :options="['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']"
              placeholder="Seleccione"
            >
            </Dropdown>
          </div>
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="formaPago">Forma de Pago</label>
            <Dropdown
              v-model="pagoModel.formaPago"
              id="formaPago"
              name="formaPago" 
              class="w-[13rem] border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 capitalize"
              :options="['Efectivo', 'Transferencia', 'Deposito', 'Otro']"
              placeholder="Seleccione"
            >
            </Dropdown>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
          
          <div class="flex flex-col items-start">
            <label class="block text-gray-600" for="valor">Valor</label>
            <InputNumber
            type="currency"
            mode="currency"
            currency="USD"
            locale="es-EC"
            :min="0"
              v-model="pagoModel.valor"
              id="valor"
              name="valor"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            >
            </InputNumber>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
          <div class="flex flex-col items-start" >
            <label class=" text-gray-600" :hidden="pagoModel.formaPago === 'Efectivo'" for="comprobante">Comprobante</label>
            <InputText
              :hidden="pagoModel.formaPago === 'Efectivo'"
              v-model="pagoModel.comprobante"
              id="comprobante"
              name="comprobante"
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            >
            </InputText>
            <!-- <small class="text-red-800">{{ validator.idaprobador }}</small> -->
          </div>
          
          
          
        </section>
        </section>
        
    </form>
    
      <div class="flex flex-col justify-center items-center  w-full  p-8">
        <button
          v-if="pagoModel.idPago"
          @click="startRemoving()"
          class="p-3 hover:bg-red-800 bg-red-500 rounded text-white flex items-center justify-center w-[15rem]"
        >
          <i class="pi pi-trash"></i>&nbsp;Eliminar
        </button>
        <button
          @click="startSaving"
          class="p-3 hover:bg-blue-800 bg-blue-500 rounded text-white flex items-center justify-center w-[15rem]  mt-4"
        >
          <i class="pi pi-save"></i>&nbsp;Guardar
        </button>
      </div>

    </div>   
    
</div>
</template>
