import NodeCache from 'node-cache';
import type { Route } from '$lib/Route';
import * as api from '$lib/server/api';
import type { ApiRoute } from '$lib/server/api';

const cache = new NodeCache();

export async function getRoutes() {
	// Return from cache if available
	let routes = cache.get<Route[]>('routes') ?? [];
	if (routes.length) {
		// TODO: remove or user logger
		console.log('Using cached routes');
		return routes;
	}

	console.log('Fetching routes from API');
	const apiRoutes = await api.getRoutes();

	routes = apiRoutes.map(apiRoute => apiRouteToRoute(apiRoute));

	// TODO: cache expiration?
	cache.set('routes', routes);

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
		color: mapRouteColor(apiRoute)
	};
}
