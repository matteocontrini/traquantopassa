import type { Coordinates } from '$lib/Coordinates';

export interface Stop {
	id: number;
	code: string;
	coordinates: Coordinates;
}
