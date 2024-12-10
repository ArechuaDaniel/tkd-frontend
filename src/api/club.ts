//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Clubs {
    idClub?: number,
    idAsociacion: number,
    nombreClub: string,
    director: string,
    fechaAfiliacion: Date | undefined,
    telefono: string,
    siglas: string,
    direccion: string,
    isActive?: boolean,
}

export const triggerGetAllClubs = async (
  
): Promise<Clubs[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/club`
  )
  return output ?? []
}
export const triggerGetClubById = async (
  idClub: number
): Promise<Clubs|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/club/${idClub}`
  )
  return output ?? []
}
export const triggerClubSave = async (club: Clubs): Promise<Clubs|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/club`,
		'POST',
		club
	);
  
	return output ? output : null;
}
export const triggerClubRemove = async (idClub:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/club/${idClub}`,
		'DELETE'
	);

	return !!output;
}
