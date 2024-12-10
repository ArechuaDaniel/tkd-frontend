import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';
import { registerAction } from '../actions/register.action';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref(AuthStatus.Checking);
  const user = ref<User | undefined>();

  const token = ref(useLocalStorage('token', ''));
  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        logout();
        return false;
      }

      user.value = loginResp.user;
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
        return logout();
    }

  };
  const register = async(fullName: string, email: string, password: string) => {
    try {
      const registerResp = await registerAction(fullName, email, password);
      if (!registerResp.ok) {
        logout();
        return {ok: false, message: registerResp.message};
      }
      user.value = registerResp.user;
      token.value = registerResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return {ok: true, user: registerResp.user};
    } catch (error) {
        return {ok: false, message: 'Error al registrar usuario'}
    }
  };
  const logout = () => {
    localStorage.removeItem('token')

    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    //authStatus.value = AuthStatus.Checking;
    try {
      const statusResp = await checkAuthAction();
      if (!statusResp.ok) {
        logout();
        return false;
      }
      
      authStatus.value = AuthStatus.Authenticated;
      user.value = statusResp.user;
      token.value = statusResp.token;
      return true;
    } catch (error) {
      logout();
        return false;
    }
  };

  return {
    user,
    token,
    authStatus,

    // Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //Todo: getter para saber si es Admin o no
    isAdmin : computed(() => user.value?.roles.includes('admin') ?? false),
    isClub : computed(() => user.value?.roles.includes('club') ?? false),
    isSucursal: computed(() => user.value?.roles.includes('sucursal') ?? false),
    isAsociacion: computed(() => user.value?.roles.includes('asociacion') ?? false),
    isInstructor: computed(() => user.value?.roles.includes('instructor') ?? false),
    username: computed(() => user.value?.primerNombre),

    //Actions
    login,
    register,
    checkAuthStatus,
    logout,
  };
});
