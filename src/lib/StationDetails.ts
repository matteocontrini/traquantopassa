import type { Train } from '$lib/Train';

export default interface StationDetails {
	name: string;
	lastUpdatedAt: Date;
	trains: Train[];
}
