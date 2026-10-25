import type { Trip } from '#lib/Trip.js';

export interface StopDirection {
	name: string;
	trips: Trip[];
}
