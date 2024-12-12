//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Asistencia {
    idHorario: number,
    idSucursal: number,
    idAsistencia: number,
    idAlumno: number,
    fechaRegistro: Date | undefined,
    sucursals?: any
}

export const triggerGetAllAsistencias = async (
  
): Promise<Asistencia[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/asistencia`
  )
  return output.map((asistencia: any) => ({
    ...asistencia,
    alumno: asistencia.alumno || [], // Asegura que  siempre sea un array.
    horario: asistencia.horario || [],
    sucursals: asistencia.sucursals || [],
  }));
}
export const triggerGetAsistenciaById = async (
  idAsistencia: number
): Promise<Asistencia|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/asistencia/${idAsistencia}`
  )
  return output ?? []
}
export const triggerAsistenciaSave = async (asistencia: Asistencia): Promise<Asistencia|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/asistencia`,
		'POST',
		asistencia
	);
  
	return output ? output : null;
}
export const triggerAsistenciaRemove = async (idAsistencia:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/asistencia/${idAsistencia}`,
		'DELETE'
	);

	return !!output;
}


