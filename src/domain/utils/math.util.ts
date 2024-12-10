export const customRound = (value: number, precision: number = 2): number => {
	return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}
