import * as stationsService from '$lib/server/stations-service';
import * as trainsService from '$lib/server/trains-service';
import { error } from '@sveltejs/kit';
import type StationDetails from '$lib/StationDetails';
import { getStopForStation } from '$lib/server/stops-stations-mapping';

export async function load({ params }) {
	const slug = params.station;

	const station = stationsService.getStationBySlug(slug);
	if (!station) {
		error(404);
	}

	const trains = await trainsService.getTrainsForStation(station.id);

	return {
		details: {
			name: station.name,
			canonicalSlug: station.slug,
			lastUpdatedAt: new Date(), // TODO: use real cache time
			trains,
			stopSlug: getStopForStation(station.slug)
		} satisfies StationDetails as StationDetails
	};
}
