
<script lang="ts" setup>
import { reactive, ref} from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from 'vue-toastification';
import { Dropdown } from 'primevue';

const authStore = useAuthStore();
const toast = useToast();

const showPassword = ref(false);

const fullNameInputRef = ref<HTMLInputElement | null>(null);
const emailInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);

const myForm = reactive({
  fullName: '',
  email: '',
  password: '',
  cedula: '',
  primerApellido: '',
  segundoApellido: '',
  primerNombre: '',
  segundoNombre: '',
  fechaNacimiento: '',
  direccion: '',
  idParroquia: 0,
  telefono: '',
  genero: '',
  tipoSangre: '',
  roles: [],
  isActive: true

});

const onRegister = async () => {
  if (myForm.fullName.length < 2) {
    return fullNameInputRef.value?.focus();
  }
  if (myForm.email === '') {
    return emailInputRef.value?.focus();
  }

  if (myForm.password.length < 6) {
    return passwordInputRef.value?.focus();
  }

  const {ok,message} = await authStore.register(myForm.fullName ,myForm.email, myForm.password);

  if (ok) return;

  toast.error(message);
};


</script>

<template>
  <div class="">

    <h1 class="text-2xl font-semibold mb-4">Nuevo Usuario</h1>
    <form @submit.prevent="onRegister">
      
    <div class="mb-4">
      <label for="cedula" class="block text-gray-600">Cedula</label>
      <input
      v-model="myForm.cedula"
      ref="emailInputRef"
      type="text"
      id="cedula"
      name="cedula"
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      autocomplete="off"
      />
    </div>
    <!-- Username Input -->
    <div class="mb-4">
      <label for="primerApellido" class="block text-gray-600">Primer Apellido</label>
      <input
      v-model="myForm.primerApellido"
      ref="fullNameInputRef"
      type="text"
      id="primerApellido"
      name="primerApellido"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
    <div class="mb-4">
      <label for="segundoApellido" class="block text-gray-600">Segundo Apellido</label>
      <input
      v-model="myForm.segundoApellido"
      ref="fullNameInputRef"
      type="text"
      id="segundoApellido"
      name="segundoApellido"
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      autocomplete="off"
      />
    </div>
    <div class="mb-4">
      <label for="primerNombre" class="block text-gray-600">Primer Nombre</label>
      <input
      v-model="myForm.primerNombre"
        ref="fullNameInputRef"
        type="text"
        id="primerNombre"
        name="primerNombre"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
      <div class="mb-4">
        <label for="segundoNombre" class="block text-gray-600">Segundo Nombre</label>
        <input
        v-model="myForm.segundoNombre"
        ref="fullNameInputRef"
        type="text"
        id="segundoNombre"
        name="segundoNombre"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
      <div class="mb-4">
        <label for="fechaNacimiento" class="block text-gray-600">Fecha Nacimiento</label>
        <input
        v-model="myForm.fechaNacimiento"
        ref="fullNameInputRef"
        type="date"
        id="fechaNacimiento"
        name="fechaNacimiento"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <div class="mb-4">
      <label for="direccion" class="block text-gray-600">Direccion</label>
      <input
      v-model="myForm.direccion"
        ref="fullNameInputRef"
        type="text"
        id="direccion"
        name="direccion"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
    <div class="mb-4">
      <label for="idParroquia" class="block text-gray-600">Parroquia</label>
      <input
      v-model="myForm.idParroquia"
      ref="fullNameInputRef"
      type="text"
      id="idParroquia"
      name="idParroquia"
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      autocomplete="off"
      />
    </div>
    <div class="mb-4">
      <label for="telefono" class="block text-gray-600">Telefono</label>
      <input
      v-model="myForm.telefono"
      ref="fullNameInputRef"
      type="text"
      id="telefono"
      name="telefono"
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      autocomplete="off"
      />
    </div>
    <div class="mb-4">
      <label for="genero" class="block text-gray-600">Genero</label>
      <input
        v-model="myForm.genero"
        ref="fullNameInputRef"
        type="text"
        id="genero"
        name="genero"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
      <div class="mb-4">
        <label for="tipoSangre" class="block text-gray-600">Tipo Sangre</label>
        <input
        v-model="myForm.tipoSangre"
        ref="fullNameInputRef"
        type="text"
        id="tipoSangre"
        name="tipoSangre"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <div class="mb-4">
      <label for="roles" class="block text-gray-600">Rol</label>
      <Dropdown
      v-model="myForm.roles"
      ref="fullNameInputRef"
        type="text"
        id="roles"
        name="roles"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
    <div class="mb-4">
      <label for="isActive" class="block text-gray-600">Active</label>
      <Dropdown
        v-model="myForm.isActive"
        ref="fullNameInputRef"
        type="text"
        id="isActive"
        name="isActive"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
      <!-- Username Input -->
      <div class="mb-4">
        <label for="email" class="block text-gray-600">Correo</label>
        <input
        v-model="myForm.email"
        ref="emailInputRef"
        type="text"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        />
      </div>
      <!-- Password Input -->
      <div class="mb-4">
        <label for="password" class="block text-gray-600">Constraseña</label>
        <div class="flex">
          <input
          v-model="myForm.password"
          ref="passwordInputRef"
          :type="showPassword ? 'text' : 'password'" 
          id="password"
          name="password"
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          autocomplete="off"
          />
          <div class="cursor-pointer py-2 px-4 rounded-r-md bg-blue-500"
            @click="showPassword = !showPassword">
            <span class="text-white">
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </span>
          </div>
        </div>
      </div>
      
    <!-- Login Button -->
    <button
    type="submit"
    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
    Crear Usuario
  </button>
</form>
<!-- Sign up  Link -->
<div class="mt-6 text-blue-500 text-center">
  <RouterLink :to="{ name: 'login' }" class="hover:underline">Ingresar por aquí</RouterLink>
</div>
</div>
</template>
