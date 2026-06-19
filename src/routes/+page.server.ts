import * as stopsService from '$lib/server/stops-service';
import * as routesService from '$lib/server/routes-service';
import * as stopsRankingService from '$lib/server/stops-ranking-service';
import { error } from '@sveltejs/kit';
import * as logger from '$lib/logger';

export async function load() {
	let stops, routes, rankings;
	try {
		stops = await stopsService.getStopGroups();
		routes = await routesService.getRoutes();
		rankings = await stopsRankingService.getRankings(stops);
	} catch (e) {
		logger.error('Error while fetching stops/routes', e);
		error(503);
	}

	return {
		stops,
		routes,
		rankings
	};
}
