<script setup lang="ts">
import OverlayBadge from 'primevue/overlaybadge';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { storeToRefs } from 'pinia';
import { RouterLink, useRouter } from 'vue-router';
import { Roles } from '@/domain/entities/Roles';
import { RouteNames } from '@/domain/utils/route.util';
import SidebarButton from './SidebarButton.vue';
import { ConfirmDialog, Toast, useConfirm, useToast } from 'primevue';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const { user } = storeToRefs(useAuthStore());
const props = defineProps({
	activeMenu: {
		type: String,
		//default: RouteNames.home
	}
});
type Option = {
	text: string,
	icon: string,
	link: string,
	roles: Roles[]
}

const menuOptions: Option[] = [
	{
		text: "Dashboard",
		icon: "pi pi-home mr-2 text-cyan-500",
		link: RouteNames.home,
		roles: [Roles.ADMIN,Roles.ASOCIACION, Roles.CLUB, Roles.SUCURSAL, Roles.INSTRUCTOR],
	},
    {
		text: "Asociación",
		icon: "pi pi-warehouse mr-2 text-cyan-500",
		link: RouteNames.asociacionView,
		roles: [Roles.ADMIN],
	},
    {
		text: "Club",
		icon: "pi pi-warehouse mr-2 text-cyan-500",
		link: RouteNames.clubView,
		roles: [Roles.ADMIN,Roles.ASOCIACION],
	},
    {
		text: "Sucursal",
		icon: "pi pi-warehouse mr-2 text-cyan-500",
		link: RouteNames.sucursalView,
		roles: [Roles.ADMIN,Roles.CLUB],
	},
    {
		text: "Alumnos",
		icon: "pi pi-users mr-2 text-cyan-500",
		link: RouteNames.alumnosView,
		roles: [Roles.ADMIN,Roles.ASOCIACION, Roles.CLUB, Roles.SUCURSAL, Roles.INSTRUCTOR],
	},
    {
		text: "Horarios",
		icon: "pi pi-clock mr-2 text-cyan-500",
		link: RouteNames.horariosView,
		roles: [Roles.ADMIN, Roles.SUCURSAL, Roles.INSTRUCTOR],
	},
    {
		text: "Asistencia",
		icon: "pi pi-calendar-clock mr-2 text-cyan-500",
		link: RouteNames.asistenciaView,
		roles: [Roles.ADMIN, Roles.SUCURSAL, Roles.INSTRUCTOR],
	},
    {
		text: "Pagos",
		icon: "pi pi-money-bill mr-2 text-cyan-500",
		link: RouteNames.pagoView,
		roles: [Roles.ADMIN, Roles.SUCURSAL, Roles.INSTRUCTOR],
	},
    {
		text: "Asensos",
		icon: "pi pi-graduation-cap mr-2 text-cyan-500",
		link: RouteNames.asensoView,
		roles: [Roles.ADMIN, Roles.SUCURSAL, Roles.INSTRUCTOR, Roles.CLUB],
	},
];
const settingOptions: Option[] = [
	{
		text: "Perfil",
		icon: "pi pi-home mr-2 text-cyan-500",
		link: RouteNames.home,
		roles: [Roles.ADMIN,Roles.ASOCIACION, Roles.CLUB, Roles.SUCURSAL, Roles.INSTRUCTOR],
	},
    
];
const confirm = useConfirm();
const toast = useToast();
const isLoading = ref(false)

const cerrarSesion = async () => {
 
  confirm.require({
    message: 'Desea cerrar sesión?',
    header: 'Cerrar Sesión',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Aceptar',
      severity: 'Cancelar',
    },
    accept: async () => {
      isLoading.value = true;
      toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Se ha cerrado la sesión',
          life: 3000,
        });
        isLoading.value = false;
        authStore.logout(), 
        router.push({ name: RouteNames.login })
    },
    reject: () => {},
  });
};
</script>
<template>
  <Toast />
  <ConfirmDialog class="w-96"></ConfirmDialog>
  <div class="min-h-screen flex relative lg:static bg-surface-50 dark:bg-surface-950">
      <div id="app-sidebar-11" class="w-[280px] bg-gray-800 dark:bg-surface-950 h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-10 border-r border-surface select-none">
          <div class="flex flex-col h-full">
              <div class="flex items-center px-8 flex-shrink-0 h-[60px]">
                <div class="flex flex-row text-white dark:text-surface-0 font-medium  rounded-xl">
                    <span class="material-symbols-outlined">
                        sports_gymnastics
                    </span>
                  <h1>SISTEMA TAEKWONDO</h1>
                </div>
              </div>
              <div class="overflow-y-auto">
                  <ul class="list-none p-4 m-0">
                      <li>
                          <div
                              v-styleclass="{
                                  selector: '@next',
                                  enterFromClass: 'hidden',
                                  enterActiveClass: 'animate-slidedown',
                                  leaveToClass: 'hidden',
                                  leaveActiveClass: 'animate-slideup'
                              }"
                              class="p-4 flex items-center justify-between text-surface-600 dark:text-surface-200 cursor-pointer border-2 border-transparent border-rounded"
                          >
                              <span class="font-medium text-white">APLICACIÓN</span>
                              <i class="pi pi-chevron-down text-white" />
                          </div>
                          <ul class="list-none p-0 m-0 overflow-hidden" v-for="option in menuOptions"   >
                                <li v-if="option.roles.includes(authStore.user!.roles as Roles)"  :key="option.text">
                                    <SidebarButton
                                        :class="'rounded-xl flex items-center cursor-pointer p-4 text-white  dark:text-surface-100 border-2 border-transparent hover:bg-gray-700 hover:border-gray-700 dark:hover:border-surface-500 duration-150 transition-colors' + (option.link === router.currentRoute.value.name ? ' bg-gray-600 border-gray-600 dark:border-surface-500' : '')"
                                        @click="router.push({ name: option.link })"
                                        :active="props.activeMenu === option.link"
                                        :text="option.text"
                                        :icon="option.icon"
                                    >
                                        <!-- <i :class="[option.icon]" />
                                        <span class="font-medium">{{ option.text }}</span> -->
                                    </SidebarButton>
                                </li>
                          </ul>
                      </li>
                  </ul>
                  


                  <ul class="list-none p-4 m-0">
                        <li>
                            <div
                                v-styleclass="{
                                    selector: '@next',
                                    enterFromClass: 'hidden',
                                    enterActiveClass: 'animate-slidedown',
                                    leaveToClass: 'hidden',
                                    leaveActiveClass: 'animate-slideup'
                                }"
                                class="p-4 flex items-center justify-between text-white dark:text-surface-200 cursor-pointer"
                            >
                                <span class="font-medium">CONFIGURACIÓN</span>
                                <i class="pi pi-chevron-down" />
                            </div>
                            <ul class="list-none p-0 m-0 overflow-hidden" v-for="option in settingOptions"   >
                                <li v-if="option.roles.includes(authStore.user!.roles as Roles)"  :key="option.text">
                                    <SidebarButton
                                        :class="'rounded-xl flex items-center cursor-pointer p-4 text-white  dark:text-surface-100 border-2 border-transparent hover:bg-gray-700 hover:border-gray-700 dark:hover:border-surface-500 duration-150 transition-colors' + (option.link === router.currentRoute.value.name ? ' bg-gray-600 border-gray-600 dark:border-surface-500' : '')"
                                        @click="router.push({ name: option.link })"
                                        :active="props.activeMenu === option.link"
                                        :text="option.text"
                                        :icon="option.icon"
                                    >
                                        <!-- <i :class="[option.icon]" />
                                        <span class="font-medium">{{ option.text }}</span> -->
                                    </SidebarButton>
                                </li>
                          </ul>
                            <ul class="list-none p-0 m-0 overflow-hidden">
                                <li>
                                    <button
                                        @click="cerrarSesion()"
                                        class="rounded-xl flex items-center cursor-pointer p-4 border-2 border-transparent hover:border-surface-300 dark:hover:border-surface-500 hover:bg-gray-700 w-full text-white dark:text-surface-100 duration-150 transition-colors"
                                    >
                                        <i class="pi pi-sign-out mr-2 text-cyan-500" />
                                        <span class="font-medium">Cerrar Sesión</span>
                                    </button>
                                </li>
                                
                            </ul>
                        </li>
                    </ul>

              </div>
              <div class="mt-auto">
                  <hr class="mb-4 mx-4 border-t border-0 border-surface" />
                  <div
                      class="rounded-xl m-4 flex items-center cursor-pointer p-4 text-surface-700 dark:text-surface-100 border-2 border-transparent hover:border-surface-300 dark:hover:border-surface-500 duration-150 transition-colors "
                  >
                      <img src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle/avatar-f-1.png" class="mr-2 w-7 h-7" />
                      <div class="flex flex-col  justify-center ">
                          <span class="font-medium text-white capitalize text-sm">{{ user?.roles + ' : ' + user?.primerNombre + ' ' + user?.primerApellido }}</span>
                    </div>
                  </div>
              </div>
          </div>
      </div>

      <div class="min-h-screen flex flex-col relative flex-auto ">
          <div class="h-[60px] flex justify-between items-center px-8 bg-gray-800 dark:bg-surface-950 border-b border-surface relative lg:static">
              <a
                  v-styleclass="{
                      selector: '#app-sidebar-11',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-fadeinleft',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-fadeoutleft',
                      hideOnOutsideClick: true
                  }"
                  class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100 mr-4 mt-1"
              >
                  <i class="pi pi-bars text-4xl" />
              </a>
              <a
                  v-styleclass="{
                      selector: '@next',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-fadein',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-fadeout',
                      hideOnOutsideClick: true
                  }"
                  class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100"
              >
                  <i class="pi pi-ellipsis-v text-2xl" />
              </a>
              <ul
                  class="list-none p-0 m-0 hidden lg:flex lg:items-center select-none lg:flex-row w-auto lg:w-full border lg:border-0 border-surface bg-surface-0 dark:bg-surface-950 right-0 top-full z-10 shadow lg:shadow-none absolute lg:static"
              >
                  <li class="border-t border-surface lg:border-t-0 ml-auto">
                      <a class="flex p-4 lg:px-4 lg:py-2 items-center hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors">
                          <img src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle/avatar-f-1.png" class="mr-4 lg:mr-0 w-8 h-8" />
                          <div class="block lg:hidden">
                              <div class="text-surface-900 dark:text-surface-0 text-xs">{{ user?.primerNombre + ' ' + user?.primerApellido }}</div>
                              <span class="text-surface-600 dark:text-surface-200 font-medium text-sm">Marketing Specialist</span>
                          </div>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="p-8 flex flex-col flex-auto ">
              <div class="border-2 border-dashed border-surface rounded-border bg-surface-0 dark:bg-surface-950 flex-auto" >  
              <RouterView />
              </div>
          </div>
      </div>
  </div>
</template>