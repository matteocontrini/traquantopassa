import { createError, defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';
import stopsMapping from '~/server/stopsMapping';
import { getRoute, loadRoutes } from '~/server/routes';

const config = useRuntimeConfig();

loadRoutes();

async function getData(stopId: number, limit: number = 5) {
    const url = `${config.apiBaseUrl}/gtlservice/trips_new?limit=${limit}&stopId=${stopId}&type=U`;
    console.log(`Requesting ${url}`);
    const resp = await fetch(url, {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${config.apiUsername}:${config.apiPassword}`).toString('base64'),
        },
    });
    return resp.json();
}

function parseTrips(data: any): Trip[] {
    return data.map((trip: any): Trip => {
        const expectedTime = new Date(trip['oraArrivoEffettivaAFermataSelezionata']);
        let minutes = Math.round((expectedTime.getTime() - Date.now()) / 1000 / 60);
        if (minutes < 0) {
            minutes = 0;
        }

        // Check if the trip is at the last stop and don't use the delay in that case
        // (the delay is always 0 in that case)
        // Note: use stopNext because sometimes the last stop is never reached
        const endOfRouteStopId = trip['stopTimes'].at(-1)['stopId'];
        const nextStopId = trip['stopNext'];
        const delay = endOfRouteStopId != nextStopId ? trip['delay'] : null;

        let route = getRoute(trip['routeId']);

        return {
            routeName: route.name,
            routeColor: route.color,
            tripId: trip['tripId'],
            destination: trip['tripHeadsign'],
            direction: trip['directionId'],
            minutes,
            delay,
        };
    });
}

export default defineEventHandler(async (event) => {
    const stopSlug = event.context.params.stop;
    const stopsGrouping = stopsMapping[stopSlug];

    if (!stopsGrouping) {
        throw createError({
            statusCode: 404,
            name: 'Not Found',
            statusMessage: 'Could not find stop',
        });
    }

    let directions: { name: string; trips: Trip[] }[] = [];

    if (stopsGrouping.lastUpdatedAt == null || Date.now() - stopsGrouping.lastUpdatedAt.getTime() > 1000 * 30) {
        const promises = stopsGrouping.stops.map((stop) => getData(stop.stopId, stop.limit));
        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i++) {
            const stop = stopsGrouping.stops[i];
            let trips = parseTrips(results[i]);
            trips.sort((a, b) => a.minutes - b.minutes);
            directions.push({
                name: stop.name,
                trips,
            });
            stop.trips = trips;
        }
        stopsGrouping.lastUpdatedAt = new Date();
    } else {
        for (let i = 0; i < stopsGrouping.stops.length; i++) {
            const stop = stopsGrouping.stops[i];
            directions.push({
                name: stop.name,
                trips: stop.trips,
            });
        }
    }

    return {
        stopName: stopsGrouping.name,
        lastUpdatedAt: stopsGrouping.lastUpdatedAt,
        directions,
    };
});
