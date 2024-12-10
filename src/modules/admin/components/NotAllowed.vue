<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteNames } from '@/domain/utils/route.util';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

</script>
<template>
	<div class="flex flex-col items-center justify-center w-full h-screen" style="overflow: hidden !important;">
		<i class="pi pi-exclamation-circle p-3" style="font-size: 4.5rem"></i>
		<span class="text-3xl font-bold">No tiene permisos</span>	
		<br>
		<div class="flex flex-row justify-center gap-2">
			<button @click="router.push({ name: RouteNames.home })"
				class="py-2 px-8 hover:bg-blue-700 bg-blue-500 w-[200px] text-white rounded-md">
				<i class="pi pi-home"></i>&nbsp;
				Ir a inicio
			</button>
			<button @click="authStore.logout(), router.push({ name: RouteNames.login })"
				class="py-2 px-8 hover:bg-red-800 bg-red-500 w-[200px] text-white rounded-md">
				<i class="pi pi-sign-out"></i>&nbsp;
				Cerrar sesión
			</button>
		</div>
	</div>
</template>
