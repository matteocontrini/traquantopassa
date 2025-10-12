import NodeCache from 'node-cache';
import type { Route } from '$lib/Route';
import * as api from '$lib/server/trentino-trasporti-api';
import type { ApiRoute } from '$lib/server/trentino-trasporti-api';
import * as logger from '$lib/logger';

// TODO: should use stale data instead of simply expiring it
const cache = new NodeCache({
	stdTTL: 24 * 60 * 60 // 24 hours
});

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

	cache.set(routesCacheKey, routes);

	return routes;
}

export function mapRouteColor(apiRoute: ApiRoute) {
	if (apiRoute.routeShortName == '5/' || apiRoute.routeShortName == 'CM') {
		return '#F5C500';
	} else if (apiRoute.routeShortName == 'P') {
		return '#C52720';
	} else if (apiRoute.routeShortName == 'G') {
		return '#542774';
	} else if (apiRoute.routeShortName == 'M') {
		return '#074E3C';
	}

	if (!apiRoute.routeColor) {
		return '#1f1a17';
	}

	return '#' + apiRoute.routeColor;
}

export function mapRouteLightBG(name: string) {
	const darkText = [
		'A',
		'5',
		'5/',
		'6',
		'14',
		'15',
		'CM'
	];

	if ( darkText.indexOf( name ) !== -1 )
		return ' text-neutral-900 ';
	else
		return '';
}

function apiRouteToRoute(apiRoute: api.ApiRoute): Route {
	return {
		id: apiRoute.routeId,
		name: apiRoute.routeShortName,
		longName: apiRoute.routeLongName,
		colorBG: mapRouteColor(apiRoute),
		colorTxt: mapRouteLightBG(apiRoute.routeShortName)
	};
}
