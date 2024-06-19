import type { Trip } from '$lib/Trip';

export interface StopDirection {
	name: string;
	trips: Trip[];
}
