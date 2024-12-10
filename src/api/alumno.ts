//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Alumnos {
  id: number,
  idClub: number,
  idSucursal: number,
  primerApellido: string,
  segundoApellido?: string,
  primerNombre: string,
  segundoNombre?: string,
  cedulaAlumno: string,
  fechaIngreso?: Date,
  telefono?: string | undefined,
  direccion?: string,
  fechaNacimiento?: Date,
  email?: string,
  isActive?: boolean,
  genero?: string,
  tipoSangre?: string,
  ocupacion?: string,
}

export const triggerGetAllAlumnos = async (
  
): Promise<Alumnos[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/alumnos`
  )
  return output ?? []
}
export const triggerGetAlumnoById = async (
  id: number
): Promise<Alumnos|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/alumnos/${id}`
  )
  return output ?? []
}
export const triggerAlumnosSave = async (alumnos: Alumnos): Promise<Alumnos|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/alumnos`,
		'POST',
		alumnos
	);
  console.log(output);
  
	return output ? output : null;
}
export const triggerAlumnoRemove = async (id:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/alumnos/${id}`,
		'DELETE'
	);

	return !!output;
}
