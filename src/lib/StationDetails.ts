import type { Train } from '$lib/Train';
import type { StopConnections } from './server/stops-stations-mapping';

export default interface StationDetails {
	id: string;
	name: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	trains: Train[];
	isDeparture: boolean;
	connections?: StopConnections;
}
