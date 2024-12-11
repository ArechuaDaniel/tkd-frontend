//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Sucursals {
    idSucursal: number,
    idClub: number,
    nombre: string,
    nombreSucursal: string,
    fechaCreacion?: Date,
    telefono?: string,
    direccion?: string,
    isActive?: boolean,
}

export const triggerGetAllSucursals = async (
  
): Promise<Sucursals[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/sucursal`
  )
  return output ?? []
}
export const triggerGetSucursalById = async (
  idSucursal: number
): Promise<Sucursals|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/sucursal/${idSucursal}`
  )
  return output ?? []
}
export const triggerSucursalSave = async (sucursal: Sucursals): Promise<Sucursals|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/sucursal`,
		'POST',
		sucursal
	);
  
	return output ? output : null;
}
export const triggerSucursalRemove = async (idSucursal:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/club/${idSucursal}`,
		'DELETE'
	);

	return !!output;
}


