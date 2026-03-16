import type { Coordinates } from '$lib/Coordinates';

export interface FtmStation {
	algorabId: string;
	stopId: string;
	name: string;
	slug: string;
	position: number;
	coordinates: Coordinates;
	requestOnly: boolean;
}
