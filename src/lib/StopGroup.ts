import type { Stop } from '#lib/Stop.js';
import type { Coordinates } from '#lib/Coordinates.js';

export interface StopGroup {
	name: string;
	slugs: string[];
	code: string;
	coordinates: Coordinates;
	stops: Stop[];
	routeIds: Set<number>;
}
