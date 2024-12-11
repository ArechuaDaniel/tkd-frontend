import { KeyNames } from "./key-names"

export const getSession = () => {
	const session = localStorage.getItem(KeyNames.token);

	if (!session) {
		return;
	}

	if (session) {
		return {
			token: session
		}
	}
}

/**
 * Removes session from local storage
 */
export const removeSession = () => {
	localStorage.removeItem("token");
	//localStorage.removeItem(KeyNames.period);
	//localStorage.removeItem(KeyNames.selectedAccountCenter);
}

// set session in local storage
export const setSession = (token: string) => {
	localStorage.setItem("token", token);
}
