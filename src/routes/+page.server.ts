import * as stopsService from '$lib/server/stops-service';
import * as routesService from '$lib/server/routes-service';
import { error } from '@sveltejs/kit';
import * as logger from '$lib/logger';

export async function load({ setHeaders }) {
	let stops;
	let routes;
	try {
		stops = await stopsService.getStopGroups();
		routes = await routesService.getRoutes();
	} catch (e) {
		logger.error('Error while fetching stops/routes', e);
		error(503);
	}

	setHeaders({ 'Cache-Control': 'max-age=3600' });

	return {
		stops,
		routes
	};
}
