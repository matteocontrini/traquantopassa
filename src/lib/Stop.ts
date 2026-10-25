import type { Coordinates } from '#lib/Coordinates.js';

export interface Stop {
	id: number;
	code: string;
	coordinates: Coordinates;
}
