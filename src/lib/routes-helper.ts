import type { Route } from '$lib/Route';

export function mapRouteIdsToRoutes(routeIds: Set<number>, routes: Route[]) {
	const filteredRoutes = routes.filter(r => routeIds.has(r.id));

	// Sort by route name
	const collator = new Intl.Collator([], { numeric: true });
	filteredRoutes.sort((a, b) => collator.compare(a.name, b.name));

	return filteredRoutes;
}
