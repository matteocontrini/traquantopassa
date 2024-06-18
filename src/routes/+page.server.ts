import * as stopsService from '$lib/server/stops-service';
import * as routesService from '$lib/server/routes-service';

export async function load({ setHeaders }) {
	const stops = await stopsService.getStopGroups();
	const routes = await routesService.getRoutes();

	setHeaders({ 'Cache-Control': 'max-age=3600' });

	return {
		stops,
		routes
	};
}
