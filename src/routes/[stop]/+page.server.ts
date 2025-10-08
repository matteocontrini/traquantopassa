import * as stopsService from '$lib/server/stops-service';
import * as tripsService from '$lib/server/trips-service';
import { error } from '@sveltejs/kit';
import type StopGroupDetails from '$lib/StopGroupDetails';
import { getStationForStop } from '$lib/server/stops-stations-mapping';
import type { StopDirection } from '$lib/StopDirection';
import * as logger from '$lib/logger';
import { getRouteNews } from '$lib/server/route-news';
import type { News } from '$lib/RouteNews';

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

	let news: News[] = [];

	try {
		news = await getRouteNews(stopGroup.routeIds);
	} catch (e) {
		logger.error('Error while fetching news', e);
		error(503);
	}

	return {
		details: {
			name: stopGroup.name,
			code: stopGroup.code,
			canonicalSlug: stopGroup.slugs[0],
			lastUpdatedAt: cacheTime,
			directions,
			trainStationSlug: getStationForStop(stopGroup.slugs[0]),
			news,
		} satisfies StopGroupDetails as StopGroupDetails // TODO: ???
	};
}
