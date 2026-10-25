import type { StopDirection } from '#lib/StopDirection.js';

export default interface StopGroupDetails {
	name: string;
	code: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	directions: StopDirection[];
	trainStationSlug: string | null;
}
