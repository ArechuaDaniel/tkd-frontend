//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Asociacion {
    idAsociacion: number,
    asociacion: string,
    director: string,
    fechaAfiliacion: Date | undefined,
    telefono: string,
    direccion: string,
    isActive: boolean
}

export const triggerGetAllAsociaciones = async (
  
): Promise<Asociacion[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/asociacion`
  )
  return output ?? []
}
export const triggerGetAsociacionById = async (
  idAsociacion: number
): Promise<Asociacion|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/asociacion/${idAsociacion}`
  )
  return output ?? []
}
export const triggerAsociacionSave = async (asociacion: Asociacion): Promise<Asociacion|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/asociacion`,
		'POST',
		asociacion
	);
  
	return output ? output : null;
}
export const triggerAsociacionRemove = async (idAsociacion:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/asociacion/${idAsociacion}`,
		'DELETE'
	);

	return !!output;
}