import * as FtmService from '$lib/server/ftm/ftm-train-service.js';
import { error } from '@sveltejs/kit';
import * as logger from '$lib/logger';
import type FtmStationDetails from '$lib/server/ftm/FtmStationDetails.js';
import { getConnectionsForFtm } from '$lib/server/stops-stations-mapping.js';

export async function load({ params }) {
	
	const slug = params.station;

	const station = FtmService.getStationBySlug(slug);
	if (!station) {
		error(404);
	}

	let trains;
	try {
		trains = await FtmService.getTrainsForStation(station.stopId);
	} catch (e) {
		logger.error(`Error while fetching trains for station ${station.slug}:`, e);
		error(503);
	}

	return {
		details: {
			id: station.stopId,
			name: station.name,
			position: station.position,
			canonicalSlug: station.slug,
			lastUpdatedAt: trains.cachedAt,
			trains: trains.value,
			connections: getConnectionsForFtm(station.slug)
		} satisfies FtmStationDetails
	};
}
