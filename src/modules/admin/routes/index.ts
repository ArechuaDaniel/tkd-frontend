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
            path: 'horario',
            name: RouteNames.horariosView, 
            component: () => import('../views/horario/HorarioView.vue')
        },
        {
            path: 'horario/agregar',
            name: RouteNames.addHorariosView, 
            component: () => import('../views/horario/AddHorario.vue')
        },
        {
            path: 'horario/editar/:id',
            name: RouteNames.editHorariosView, 
            component: () => import('../views/horario/AddHorario.vue')
        },
        {
            path: 'asistencia',
            name: RouteNames.asistenciaView, 
            component: () => import('../views/asistencia/AsistenciaView.vue')
        },
        {
            path: 'asistencia/agregar',
            name: RouteNames.addAsitenciaView, 
            component: () => import('../views/asistencia/AddAsistencia.vue')
        },
        {
            path: 'asistencia/editar/:id',
            name: RouteNames.editAsistenciaView, 
            component: () => import('../views/asistencia/AddAsistencia.vue')
        },
        {
            path: 'asenso',
            name: RouteNames.asensoView, 
            component: () => import('../views/asenso/AsensoView.vue')
        },
        {
            path: 'asenso/agregar',
            name: RouteNames.addAsensoView, 
            component: () => import('../views/asenso/AddAsenso.vue')
        },
        {
            path: 'asenso/editar/:id',
            name: RouteNames.editAsensoView, 
            component: () => import('../views/asenso/AddAsenso.vue')
        },
        {
            path: 'pago',
            name: RouteNames.pagoView, 
            component: () => import('../views/pago/PagoView.vue')
        },
        {
            path: 'pago/agregar',
            name: RouteNames.addPagoView, 
            component: () => import('../views/pago/AddPago.vue')
        },
        {
            path: 'pago/editar/:id',
            name: RouteNames.editPagoView, 
            component: () => import('../views/pago/AddPago.vue')
        },
        {
            path: 'usuario',
            name: RouteNames.userView, 
            component: () => import('../views/usuario/UserView.vue')
        },
        {
            path: 'usuario/agregar',
            name: RouteNames.addUserView, 
            component: () => import('../views/usuario/AddUser.vue')
        },
        {
            path: 'usuario/editar/:id',
            name: RouteNames.editUserView, 
            component: () => import('../views/usuario/AddUser.vue')
        },
        {
            path: 'products/:productId',
            name: 'admin-product', 
            props: true,
            component: () => import('@/modules/admin/views/ProductView.vue')
        },
    ]
   
}