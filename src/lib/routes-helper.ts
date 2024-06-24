import type { Route } from '$lib/Route';

export function mapRouteIdsToRoutes(routeIds: Set<number>, routes: Route[]) {
	const filteredRoutes = routes.filter(r => routeIds.has(r.id));

	// Sort by route name
	filteredRoutes.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

	return filteredRoutes;
}
