import * as stopsService from '$lib/server/stops-service';
import * as tripsService from '$lib/server/trips-service';
import { error } from '@sveltejs/kit';
import type { StopGroupDetails } from '$lib/StopGroupDetails'; // TODO: use default export

export async function load({ params }) {
	const slug = params.stop;

	const stopGroup = await stopsService.getStopGroupBySlug(slug);
	if (!stopGroup) {
		error(404);
	}

	const directions = [];

	// Gather results for all directions in parallel
	const promises = stopGroup.stops.map(s => tripsService.getTrips(s));
	const results = await Promise.all(promises);
	for (const direction of results) {
		directions.push(direction);
	}

	// Sort by name
	directions.sort((a, b) => a.name.localeCompare(b.name));

	return {
		details: {
			name: stopGroup.name,
			lastUpdatedAt: new Date(),
			directions
		} satisfies StopGroupDetails as StopGroupDetails // TODO: ???
	};
}
