
import { tesloApi } from "@/api/tesloApi"
import type { AuthResponse, User } from "../interfaces";

interface RegisterError {
    ok: false;
    message: string;
  }
  
  interface RegisterSuccess {
    ok: true;
    user: User;
    token: string;
  }
export const registerAction = async(fullNanme: string,email: string, password: string) : Promise<RegisterError | RegisterSuccess> => {
    try {
        const {data} = await tesloApi.post<AuthResponse>('/auth/register',{fullNanme,email,password});
        return {
            ok: true,
            user: data.user,
            token: data.token
        }
    } catch (error) {
      
          console.log(error);
          return{
            ok: false,
            message: 'No se pudo crear el usuario'
          }
          

    }
}