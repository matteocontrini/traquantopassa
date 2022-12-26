import { defineEventHandler } from 'h3';
import stopsMapping from '~/server/stopsMapping';
import { getIsLoaded, getRoutesForStop } from '~/server/routes';
import StopDefinition from '~/server/StopDefinition';

function getRoutesForStops(stops: StopDefinition[]): Route[] {
    if (!getIsLoaded()) {
        throw createError({
            statusCode: 503,
            name: 'Service Unavailable',
            message: 'The service is temporarily unavailable',
        })
    }

    // Gather unique routes for all the stops
    const routes = new Set<Route>();
    for (const stop of stops) {
        const stopRoutes = getRoutesForStop(stop.stopId);
        for (const route of stopRoutes) {
            routes.add(route);
        }
    }

    const arr = Array.from(routes);

    // Sort by route name
    const collator = new Intl.Collator([], { numeric: true });
    arr.sort((a, b) => collator.compare(a.name, b.name));

    return arr;
}

export default defineEventHandler(async (event) => {
    return Object.keys(stopsMapping).map<Stop>((slug) => {
        let s = stopsMapping[slug];
        return {
            slug,
            name: s.name,
            coordinates: s.coordinates,
            routes: getRoutesForStops(s.stops),
        };
    });
});
