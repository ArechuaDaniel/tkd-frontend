//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"
import type { Clubs } from "./club"
import type { Sucursals } from "./sucursal";

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
  nombreClub?: string,
  nombreSucursal?: string,
  ocupacion?: string,
  clubs?: any,
  sucursals?: any,
}

// export const triggerGetAllAlumnos = async (
  
// ): Promise<Alumnos[] | null> => {
//   const output = await makeRequest<any>(
//     `${VITE_APP_API_URL}/alumnos`
//   )
//   return output  ? {...output , clubs: output.clubs} : [] 
// }
export const triggerGetAllAlumnos = async (idSucursal?: number | ''): Promise<Alumnos[] > => {
  try {
    const output = await makeRequest<Alumnos[]>(
      `${VITE_APP_API_URL}/alumnos?q=${idSucursal}`
    );
    if (!output || !Array.isArray(output)) {
      console.error("Respuesta inesperada de la API", output);
      return [];
    }

    // Devuelve directamente la lista de alumnos si es válida.
    return output.map((alumno) => ({
      ...alumno,
      clubs: alumno.clubs || [], // Asegura que `clubs` siempre sea un array.
      sucursals: alumno.sucursals || [],
    }));
  } catch (error) {
    console.error("Error obteniendo alumnos", error);
    return [];
  }
};
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
  
  
	return output ? output : null;
}
export const triggerAlumnoRemove = async (id:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/alumnos/${id}`,
		'DELETE'
	);

	return !!output;
}
