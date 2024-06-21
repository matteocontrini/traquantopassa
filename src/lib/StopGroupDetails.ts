import type { StopDirection } from '$lib/StopDirection';

export interface StopGroupDetails {
	name: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	directions: StopDirection[];
	trainStationSlug: string | null;
}
