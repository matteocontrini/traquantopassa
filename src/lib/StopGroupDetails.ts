import type { StopDirection } from '$lib/StopDirection';

export interface StopGroupDetails {
	code: string;
	name: string;
	lastUpdatedAt: Date;
	directions: StopDirection[];
}
