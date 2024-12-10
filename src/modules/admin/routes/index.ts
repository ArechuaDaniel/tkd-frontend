import { RouteNames } from "@/domain/utils/route.util"
import isAdminGuard from "@/modules/auth/guards/is-admin.guard"
import isAuthenticatedGuard from "@/modules/auth/guards/is-authenticated.guard"
import type { RouteRecordRaw } from "vue-router"


export const adminRoutes : RouteRecordRaw = {
    path: '/admin',
    name: 'admin',
    beforeEnter: [isAuthenticatedGuard, isAdminGuard],
    redirect: {name: RouteNames.home},
    component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
    children: [
        {
            path: 'dashboard',
            name: RouteNames.home,
            component: () => import('@/modules/admin/views/DashboardView.vue')
        },
        {
            path: 'asociacion',
            name: RouteNames.asociacionView, 
            component: () => import('../views/asociacion/AsociacionView.vue')
        },
        {
            path: 'asociacion/agregar-asociacion',
            name: RouteNames.addAsociacionView, 
            component: () => import('../views/asociacion/AddAsociacion.vue')
        },
        {
            path: 'asociacion/editar-asociacion/:id',
            name: RouteNames.editAsociacionView, 
            component: () => import('../views/asociacion/AddAsociacion.vue')
        },
        {
            path: 'alumnos',
            name: RouteNames.alumnosView, 
            component: () => import('../views/Alumnos/AlumnosView.vue')
        },
        {
            path: 'alumnos/agregar-alumno',
            name: RouteNames.addAlumnosView, 
            component: () => import('../views/Alumnos/AddAlumnos.vue')
        },
        {
            path: 'alumnos/editar-alumno/:id',
            name: RouteNames.editAlumnosView, 
            component: () => import('../views/Alumnos/AddAlumnos.vue')
        },
        {
            path: 'club',
            name: RouteNames.clubView, 
            component: () => import('../views/club/ClubView.vue')
        },
        {
            path: 'club/agregar-club',
            name: RouteNames.addClubView, 
            component: () => import('../views/club/AddClub.vue')
        },
        {
            path: 'club/editar-club/:id',
            name: RouteNames.editClubView, 
            component: () => import('../views/club/AddClub.vue')
        },
        {
            path: 'sucursal',
            name: RouteNames.sucursalView, 
            component: () => import('../views/sucursal/SucursalView.vue')
        },
        {
            path: 'sucursal/agregar',
            name: RouteNames.addSucursalView, 
            component: () => import('../views/sucursal/AddSucursal.vue')
        },
        {
            path: 'sucursal/editar/:id',
            name: RouteNames.editSucursalView, 
            component: () => import('../views/sucursal/AddSucursal.vue')
        },
        {
            path: 'products/:productId',
            name: 'admin-product', 
            props: true,
            component: () => import('@/modules/admin/views/ProductView.vue')
        },
    ]
   
}