//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Horarios {
    idHorario: number,
    idSucursal: number,
    inicio: Date | undefined,
    fin: Date | undefined,
}

export const triggerGetAllHorarioss = async (
  
): Promise<Horarios[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/horarios`
  )
  return output ?? []
}
export const triggerGetHorarioById = async (
  idHorario: number
): Promise<Horarios|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/horarios/${idHorario}`
  )
  return output ?? []
}
export const triggerHorarioSave = async (horarios: Horarios): Promise<Horarios|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/horarios`,
		'POST',
		horarios
	);
  
	return output ? output : null;
}
export const triggerHorarioRemove = async (idHorarios:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/horarios/${idHorarios}`,
		'DELETE'
	);

	return !!output;
}


