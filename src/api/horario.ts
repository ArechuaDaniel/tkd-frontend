//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Horarios {
    idHorario: number,
    idSucursal: number,
    inicio: Date | undefined,
    fin: Date | undefined,
    sucursals?: any,
    nombreSucursal?: string
}

export const triggerGetAllHorarioss = async (
  idSucursal?: number | ''
): Promise<Horarios[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/horarios?q=${idSucursal}`
  )
  return output.map((horario: any) => ({
    ...horario,
    sucursals: horario.sucursals || [], 
  }));
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


