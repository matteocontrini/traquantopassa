import { createError, defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';
import stopsMapping from '~/server/stopsMapping';
import { getRoute, loadRoutes } from '~/server/routes';
import StopsGroup from '~/server/StopsGroup';
import StopDefinition from '~/server/StopDefinition';

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

function parseTrips(stopId: number, data: any): Trip[] {
    return data.map((trip: any): Trip => {
        const expectedTime = new Date(trip['oraArrivoEffettivaAFermataSelezionata']);
        let minutes = Math.ceil((expectedTime.getTime() - Date.now()) / 1000 / 60);
        if (minutes < 0) {
            minutes = 0;
        }

        // Check if the trip is at the last stop and don't use the delay in that case
        // (the delay is always 0 in that case)
        // Note: use stopNext because sometimes the last stop is never reached
        const endOfRouteStopId = trip['stopTimes'].at(-1)['stopId'];
        const nextStopId = trip['stopNext'];
        const delay = endOfRouteStopId != nextStopId ? trip['delay'] : null;

        // *** Compute how many stops away the bus is
        let distanceInStops = null;
        const currentStopSequenceNumber = trip['lastSequenceDetection'];
        // Skip calculation if the sequence number is 0 (no data) or...
        // if the bus is at/nearby the first stop (it might be there waiting to depart, like in Stazione FS)
        if (currentStopSequenceNumber > 1) {
            // Find the stop where the bus is
            const currentBusStop = trip['stopTimes'].find(
                (stop: any) => stop['stopSequence'] == currentStopSequenceNumber
            );
            // Find the stop where the user is, but only after the current bus stop
            const currentUserStop = trip['stopTimes'].find(
                (stop: any) => stop['stopId'] == stopId && stop['stopSequence'] >= currentStopSequenceNumber
            );
            // Note: the currentBusStop check shouldn't be required, but you never know
            // The currentUserStop check is required because the bus might be already beyond the user stop
            if (currentBusStop != null && currentUserStop != null) {
                // Compute how many stops away the bus is
                distanceInStops = currentUserStop['stopSequence'] - currentBusStop['stopSequence'];
            }
        }

        let route = getRoute(trip['routeId']);

        return {
            routeName: route.name,
            routeColor: route.color,
            tripId: trip['tripId'],
            destination: trip['tripHeadsign'],
            direction: trip['directionId'],
            minutes,
            delay,
            expectedTime,
            scheduledTime: new Date(trip['oraArrivoProgrammataAFermataSelezionata']),
            distanceInStops,
        };
    });
}

export default defineEventHandler(async (event) => {
    const stopSlug = event.context.params.stop;
    const stopsGroup: StopsGroup = stopsMapping[stopSlug];

    if (!stopsGroup) {
        throw createError({
            statusCode: 404,
            name: 'Not Found',
            statusMessage: 'Could not find stop',
        });
    }

    let directions: { name: string; trips: Trip[] }[] = [];

    if (!stopsGroup.lastUpdatedAt || Date.now() - stopsGroup.lastUpdatedAt.getTime() > 1000 * 30) {
        const promises = stopsGroup.stops.map((stop) => getData(stop.stopId, stop.limit));
        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i++) {
            const stop: StopDefinition = stopsGroup.stops[i];
            let trips = parseTrips(stop.stopId, results[i]);
            trips.sort((a, b) => a.minutes - b.minutes);
            directions.push({
                name: stop.name,
                trips,
            });
            stop.tripsCache = trips;
        }
        stopsGroup.lastUpdatedAt = new Date();
    } else {
        for (let i = 0; i < stopsGroup.stops.length; i++) {
            const stop = stopsGroup.stops[i];
            directions.push({
                name: stop.name,
                trips: stop.tripsCache,
            });
        }
    }

    return {
        stopName: stopsGroup.name,
        lastUpdatedAt: stopsGroup.lastUpdatedAt,
        directions,
    };
});
