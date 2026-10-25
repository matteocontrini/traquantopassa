import type { Coordinates } from '#lib/Coordinates.js';

export interface Station {
	id: string;
	slug: string;
	name: string;
	coordinates: Coordinates;
	railways: string[];
}
