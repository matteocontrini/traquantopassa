import type { Train } from '$lib/Train';

export default interface StationDetails {
	id: string;
	name: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	trains: Train[];
	stopSlug: string | null;
}
