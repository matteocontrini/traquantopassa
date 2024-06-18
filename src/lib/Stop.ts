import type { StopCoordinates } from '$lib/StopCoordinates';

export interface Stop {
	id: number;
	code: string;
	coordinates: StopCoordinates;
}
