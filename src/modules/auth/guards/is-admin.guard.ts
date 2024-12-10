import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  // console.log(to);
  await authStore.checkAuthStatus();

  (authStore.isAdmin || authStore.isClub || authStore.isSucursal || authStore.isAsociacion || authStore.isInstructor ) ? next() : next({ name: 'home' }) ;
  //authStore.isClub  ? next() : next({ name: 'home' }) ;
};

export default isAdminGuard;