import type { Stop } from '$lib/Stop';
import type { Coordinates } from '$lib/Coordinates';

export interface StopGroup {
	name: string;
	slugs: string[];
	code: string;
	coordinates: Coordinates;
	stops: Stop[];
	routeIds: Set<number>;
	ranking: number | null;
}
