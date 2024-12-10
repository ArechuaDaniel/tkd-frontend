export interface User {
    idUsuario: string;
    email: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    isActive?: boolean;
    roles: string;
  }