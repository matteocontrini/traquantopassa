import type { Stop } from '$lib/Stop';
import type { StopCoordinates } from '$lib/StopCoordinates';

export interface StopGroup {
	name: string;
	slugs: string[];
	code: string;
	coordinates: StopCoordinates;
	stops: Stop[];
	routeIds: Set<number>;
}
