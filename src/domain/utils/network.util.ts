import VsToast from '@vuesimple/vs-toast';
import { KeyNames } from './key-names';

/**
 * Performs a basic request to the API and handles refresh token logic so new issued 
 * are automatically updated & stored on local storage.
 * It'll return an output of type [T] if the request was successful or null if not.
 */
export const makeRequest = async <T>(url: string, method: string = 'GET', body?: any): Promise<T | null> => {

	const token = localStorage.getItem("token")
	
	

	const response = await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body: body ? JSON.stringify(body) : (method == 'GET' ? undefined : '{}'),
	});

	if (response.status == 401) {
		localStorage.removeItem(KeyNames.token);
		//localStorage.removeItem(KeyNames.user);

		VsToast.show({
			title: 'Sesión expirada',
			message: 'Por favor inicia sesión de nuevo.',
			variant: 'error',
		});

		window.location.reload();
		return null;
	}

	const json = await response.json();

	const newToken = json.accessToken;

	// refreshing the token if needed
	if (newToken) {
		localStorage.setItem(KeyNames.token, newToken);
		//localStorage.setItem(KeyNames.user, JSON.stringify(json.user));
	}

	if (response.status >= 500) {
		VsToast.show({
			title: 'Hubo un error en el servidor',
			message: json.error ?? 'Contacte con TI.',
			variant: 'error',
		});

		return null;
	}


	if (response.status >= 400) {

		let message;

		if (json.message === 'string') {
			message = json.message
		} else if (json.message) {
			message = json.message[0];
		}
		else if (json.error) {
			message = json.error.message[0];
		}

		VsToast.show({
			title: 'Ha ocurrido un error',
			message: (message ?? 'Error desconocido. Contacte con TI.'),
			variant: 'error',
		});

		return null;
	}

	if (method !== 'GET') {
		VsToast.show({
			title: '¡Listo!',
			message: method === 'PUT' || method === 'PATCH' ? 'Datos guardados correctamente' : 'Operación exitosa',
			variant: 'success',
		});
	}

	return json as T;
}
