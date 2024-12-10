export enum Roles {
	ADMIN = 'admin',
	ROOT = 'root',
	ASOCIACION = 'asociacion',
	CLUB = 'club',
	SUCURSAL = 'sucursal',
	INSTRUCTOR = 'instructor',
	ARBITRO = 'arbitro',
	UNKNOWN = 'unknown',
}

export function roleFromString(roles: string): Roles {
	switch (roles) {
		case 'admin':
			return Roles.ADMIN;
		case 'root':
			return Roles.ROOT;
		case 'asociacion':
			return Roles.ASOCIACION;
		case 'club':
			return Roles.CLUB;
		case 'instructor':
			return Roles.INSTRUCTOR;
		case 'arbitro':
			return Roles.ARBITRO;
		case 'sucursal':
			return Roles.SUCURSAL;
		default:
			return Roles.UNKNOWN;
	}
}
