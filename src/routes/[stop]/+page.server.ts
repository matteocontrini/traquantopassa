import * as stopsService from '#lib/server/stops-service.js';
import * as tripsService from '#lib/server/trips-service.js';
import { error } from '@sveltejs/kit';
import type StopGroupDetails from '#lib/StopGroupDetails.js';
import { getStationForStop } from '#lib/server/stops-stations-mapping.js';
import type { StopDirection } from '#lib/StopDirection.js';
import * as logger from '#lib/logger.js';

export async function load({ params }) {
	const slug = params.stop;

	const stopGroup = await stopsService.getStopGroupBySlug(slug);
	if (!stopGroup) {
		error(404);
	}

	const directions: StopDirection[] = [];
	let cacheTime;

	try {
		// Gather results for all directions in parallel
		const promises = stopGroup.stops.map((s) => tripsService.getTrips(s));
		const results = await Promise.all(promises);
		for (const direction of results) {
			directions.push(direction.value);
		}
		cacheTime = results[0].cachedAt;
	} catch (e) {
		logger.error(`Error while fetching trips for stop ${stopGroup.slugs[0]}:`, e);
		error(503);
	}

	// Sort by name
	directions.sort((a, b) => a.name.localeCompare(b.name));

	return {
		details: {
			name: stopGroup.name,
			code: stopGroup.code,
			canonicalSlug: stopGroup.slugs[0],
			lastUpdatedAt: cacheTime,
			directions,
			trainStationSlug: getStationForStop(stopGroup.slugs[0]),
		} satisfies StopGroupDetails as StopGroupDetails, // TODO: ???
	};
}
