export interface User {
    idUsuario: string;
    email: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    isActive?: boolean;
    roles: string;
    cedula: string;
    fechaNacimiento?: Date;
    telefono?: string;
    genero?: string;
    direccion?: string;
    idAsociacion?: number;
    idClub?: number;
    idSucursal?: number;
    tipoSangre?: string;
  }