//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Pago {
    idAlumno: number,
    idSucursal: number,
    idPago: number,
    valor?: number,
    fechaPago: Date | undefined,
    mesPago: string,
    formaPago?: string | undefined,
    comprobante?: string | undefined,
    sucursal?: any
}

export const triggerGetAllPagos = async (
  
): Promise<Pago[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/pago`
  )
  return output.map((pago: any) => ({
    ...pago,
    alumno: pago.alumno || [], // Asegura que  siempre sea un array.
    sucursal: pago.sucursal || [],
  }));
}
export const triggerGetPagoById = async (
  idPago: number
): Promise<Pago|null> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/pago/${idPago}`
  )
  return output ?? []
}
export const triggerPagoSave = async (pago: Pago): Promise<Pago|null> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/pago`,
		'POST',
		pago
	);
  
	return output ? output : null;
}
export const triggerPagoRemove = async (idPago:number): Promise<boolean> => {
	const output = await makeRequest<any>(
		`${VITE_APP_API_URL}/pago/${idPago}`,
		'DELETE'
	);

	return !!output;
}


