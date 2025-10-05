import type { StopDirection } from '$lib/StopDirection';
import type { News } from '$lib/RouteNews';

export default interface StopGroupDetails {
	name: string;
	code: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	directions: StopDirection[];
	trainStationSlug: string | null;
	news: News[];
}
