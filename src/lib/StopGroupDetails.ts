import type { StopDirection } from '$lib/StopDirection';
import type { StopConnections } from './server/stops-stations-mapping';

export default interface StopGroupDetails {
	name: string;
	code: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	directions: StopDirection[];
	connections?: StopConnections;
}
