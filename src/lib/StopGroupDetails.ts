import type { StopDirection } from '$lib/StopDirection';

export interface StopGroupDetails {
	name: string;
	lastUpdatedAt: Date;
	directions: StopDirection[];
}
