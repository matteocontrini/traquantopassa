import * as stopsService from '$lib/server/stops-service';
import * as tripsService from '$lib/server/trips-service';
import { error } from '@sveltejs/kit';
import type StopGroupDetails from '$lib/StopGroupDetails';
import { getStationForStop } from '$lib/server/stops-stations-mapping';
import type { StopDirection } from '$lib/StopDirection';
import * as logger from '$lib/logger';

export async function load({ params, url }) {
	const slug = params.stop;
	const dateTime = url.searchParams.get('refDateTime');
	let refDateTime: string | undefined = undefined;
	if (dateTime) {
		try {
			refDateTime = new Date(dateTime).toISOString();
		} catch (e) {
			// Fallback to current time if invalid
			logger.warn(`Invalid refDateTime parameter: ${dateTime}, using current time instead.`);
		}
	}

	const stopGroup = await stopsService.getStopGroupBySlug(slug);
	if (!stopGroup) {
		error(404);
	}

	const directions: StopDirection[] = [];
	let cacheTime;

	try {
		// Gather results for all directions in parallel
		const promises = stopGroup.stops.map(s => tripsService.getTrips(s, refDateTime));
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
			trainStationSlug: getStationForStop(stopGroup.slugs[0])
		} satisfies StopGroupDetails as StopGroupDetails // TODO: ???
	};
}
