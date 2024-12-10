export const transformNumberToMonth = (month: number): string => {
	switch(month) {
		case 1: return 'ENERO';
		case 2: return 'FEBRERO';
		case 3: return 'MARZO';
		case 4: return 'ABRIL';
		case 5: return 'MAYO';
		case 6: return 'JUNIO';
		case 7: return 'JULIO';
		case 8: return 'AGOSTO';
		case 9: return 'SEPTIEMBRE';
		case 10: return 'OCTUBRE';
		case 11: return 'NOVIEMBRE';
		case 12: return 'DICIEMBRE';
		default: return month.toString();
	}
}

export const transformMonthToNumber = (month: string): number => {
	switch(month) {
		case 'ENERO': return 1;
		case 'FEBRERO': return 2;
		case 'MARZO': return 3;
		case 'ABRIL': return 4;
		case 'MAYO': return 5;
		case 'JUNIO': return 6;
		case 'JULIO': return 7;
		case 'AGOSTO': return 8;
		case 'SEPTIEMBRE': return 9;
		case 'OCTUBRE': return 10;
		case 'NOVIEMBRE': return 11;
		case 'DICIEMBRE': return 12;
		default: return 13;
	}
}
