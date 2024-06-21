import * as stopsService from '$lib/server/stops-service';
import * as tripsService from '$lib/server/trips-service';
import { error } from '@sveltejs/kit';
import type StopGroupDetails from '$lib/StopGroupDetails';
import { getStationForStop } from '$lib/server/stops-stations-mapping';
import type { StopDirection } from '$lib/StopDirection';

export async function load({ params }) {
	const slug = params.stop;

	const stopGroup = await stopsService.getStopGroupBySlug(slug);
	if (!stopGroup) {
		error(404);
	}

	const directions: StopDirection[] = [];

	// Gather results for all directions in parallel
	const promises = stopGroup.stops.map(s => tripsService.getTrips(s));
	const results = await Promise.all(promises);
	for (const direction of results) {
		directions.push(direction.value);
	}

	const cacheTime = results[0].cachedAt;

	// Sort by name
	directions.sort((a, b) => a.name.localeCompare(b.name));

	return {
		details: {
			name: stopGroup.name,
			canonicalSlug: stopGroup.slugs[0],
			lastUpdatedAt: cacheTime,
			directions,
			trainStationSlug: getStationForStop(stopGroup.slugs[0])
		} satisfies StopGroupDetails as StopGroupDetails // TODO: ???
	};
}
