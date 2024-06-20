import NodeCache from 'node-cache';
import type { Route } from '$lib/Route';
import * as api from '$lib/server/trentino-trasporti-api';
import type { ApiRoute } from '$lib/server/trentino-trasporti-api';
import * as logger from '$lib/logger';

const cache = new NodeCache();

const routesCacheKey = 'routes';

export async function getRoutes() {
	// Return from cache if available
	let routes = cache.get<Route[]>(routesCacheKey) ?? [];
	if (routes.length) {
		return routes;
	}

	logger.info('Fetching routes from API');
	const apiRoutes = await api.getRoutes();

	routes = apiRoutes.map(apiRoute => apiRouteToRoute(apiRoute));

	// Sort by route name (numeric)
	routes.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

	// TODO: cache expiration?
	cache.set(routesCacheKey, routes);

	return routes;
}

function mapRouteColor(apiRoute: ApiRoute) {
	if (apiRoute.routeShortName == '5/') {
		return '#F5C500';
	}

	if (!apiRoute.routeColor) {
		return '#000000';
	}

	return '#' + apiRoute.routeColor;
}

function apiRouteToRoute(apiRoute: api.ApiRoute): Route {
	return {
		id: apiRoute.routeId,
		name: apiRoute.routeShortName,
		longName: apiRoute.routeLongName,
		color: mapRouteColor(apiRoute)
	};
}
