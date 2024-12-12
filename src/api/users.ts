//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"
import type { Clubs } from "./club"
import type { Sucursals } from "./sucursal";

const { VITE_APP_API_URL } = import.meta.env

export interface Usuario {
  idUsuario: number,
  email: string,
  cedula: string,
  primerApellido: string,
  segundoApellido?: string,
  primerNombre: string,
  segundoNombre?: string,
  fechaNacimiento?: Date,
  telefono?: string,
  genero?: string,
  tipoSangre?: string,
  isActive?: boolean,
  roles: string,
  idClub?: number,
  idSucursal?: number,
  idAsociacion?: number,
  clubs?: any,
  sucursals?: any,
  asociacions?: any
}

// export const triggerGetAllAlumnos = async (
  
// ): Promise<Alumnos[] | null> => {
//   const output = await makeRequest<any>(
//     `${VITE_APP_API_URL}/alumnos`
//   )
//   return output  ? {...output , clubs: output.clubs} : [] 
// }
export const triggerGetAllUsuario = async (): Promise<Usuario[] > => {
  try {
    const output = await makeRequest<Usuario[]>(
      `${VITE_APP_API_URL}/auth/users`
    );
    if (!output || !Array.isArray(output)) {
      console.error("Respuesta inesperada de la API", output);
      return [];
    }

    // Devuelve directamente la lista de alumnos si es válida.
    return output.map((user) => ({
      ...user,
      clubs: user.clubs || [], // Asegura que `clubs` siempre sea un array.
      sucursals: user.sucursals || [],
      asociacions: user.asociacions || [],
    }));
  } catch (error) {
    console.error("Error obteniendo usuario", error);
    return [];
  }
};
export const triggerGetUserById = async (
  idUsuario: number
): Promise<Usuario|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/auth/users/${idUsuario}`
  )
  return output ?? []
}
export const triggerUsuarioave = async (usuario: Usuario): Promise<Usuario|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/auth/register`,
		'POST',
    usuario
	);
  console.log(output);
  
	return output ? output : null;
}
export const triggerUserRemove = async (idUsuario:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/users/${idUsuario}`,
		'DELETE'
	);

	return !!output;
}
