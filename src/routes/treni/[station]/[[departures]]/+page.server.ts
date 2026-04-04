import * as stationsService from '$lib/server/stations-service';
import * as trainsService from '$lib/server/trains-service';
import { error } from '@sveltejs/kit';
import type StationDetails from '$lib/StationDetails';
import { getStopForStation } from '$lib/server/stops-stations-mapping';
import * as logger from '$lib/logger';

export async function load({ params }) {
	const slug = params.station;
	const isDeparture = params.departures != 'arrivi';

	let station;
	try {
		station = await stationsService.getStationBySlug(slug);
	} catch (e) {
		logger.error(`Error while fetching station with slug ${slug}:`, e);
		error(503);
	}

	if (!station) {
		error(404);
	}

	if (params.departures && params.departures != 'arrivi') {
		error(404);
	}

	let trains;
	try {
		trains = await trainsService.getTrains(station.id, isDeparture);
	} catch (e) {
		logger.error(`Error while fetching trains for station ${station.slug}:`, e);
		error(503);
	}

	return {
		details: {
			id: station.id,
			name: station.name,
			canonicalSlug: station.slug,
			lastUpdatedAt: trains.cachedAt,
			trains: trains.value,
			isDeparture,
			stopSlug: getStopForStation(station.slug)
		} satisfies StationDetails as StationDetails
	};
}
