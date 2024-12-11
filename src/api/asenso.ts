//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Asenso {
    idAlumno: number,
    idClub: number,
    idSucursal: number,
    idCinturon: number,
    idAsenso: number,
    fechaAsenso: Date | undefined,
}

export const triggerGetAllAsensos = async (
  
): Promise<Asenso[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/asenso`
  )
  return output.map((asenso: any) => ({
    ...asenso,
    alumno: asenso.alumno || [], // Asegura que  siempre sea un array.
    cinturon: asenso.cinturon || [],
    sucursal: asenso.sucursal || [],
    club: asenso.club || [],
  }));
}
export const triggerGetAsensoById = async (
  idAsenso: number
): Promise<Asenso|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/asenso/${idAsenso}`
  )
  return output ?? []
}
export const triggerAsensoSave = async (asenso: Asenso): Promise<Asenso|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/asenso`,
		'POST',
		asenso
	);
  
	return output ? output : null;
}
export const triggerAsensoRemove = async (idAsenso:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/asenso/${idAsenso}`,
		'DELETE'
	);

	return !!output;
}


