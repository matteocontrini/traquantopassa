import type { Train } from '$lib/Train';
import type { News } from '$lib/RouteNews';

export default interface StationDetails {
	id: string;
	name: string;
	canonicalSlug: string;
	lastUpdatedAt: Date;
	trains: Train[];
	trainNews: News[];
	stopSlug: string | null;
}
