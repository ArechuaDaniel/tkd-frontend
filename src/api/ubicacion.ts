//import { makeRequest } from '@/domain/utils/network.util'

import { makeRequest } from "@/domain/utils/network.util"

const { VITE_APP_API_URL } = import.meta.env

export interface Provincias {
  idProvincia: number,
  idPais: number,
  provincia: string
}
export interface Cantones {
  idProvincia: number,
  idCanton: number,
  canton: string
}
export interface Parroquias {
  idParroquia: number,
  idCanton: number,
  parroquia: string
}

export const triggerGetAllProvincias = async (
  
): Promise<Provincias[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/ubicacion/provincias`
  )
  return output ?? []
}
export const triggerGetAllCantones = async (
  idProvincia: number
): Promise<Cantones[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/ubicacion/cantones/${idProvincia}`
  )
  return output ?? []
}
export const triggerGetAllParroquias = async (
  idCanton: number
): Promise<Parroquias[]> => {
  const output = await makeRequest<any>(
    `${VITE_APP_API_URL}/ubicacion/parroquias/${idCanton}`
  )
  return output ?? []
}

