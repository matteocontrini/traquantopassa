import { createError, defineEventHandler } from 'h3';
import stopsMapping from '~/server/stopsMapping';
import { getRoute } from '~/server/routes';
import StopsGroup from '~/server/StopsGroup';
import StopDefinition from '~/server/StopDefinition';
import axios, { AxiosResponse } from 'axios';
import { apiAuthHeader, apiBaseUrl } from '~/server/config';

const OUTDATED_DATA_THRESHOLD = 1000 * 60 * 5;

const client = axios.create({
    baseURL: apiBaseUrl,
    timeout: 5000,
    headers: {
        Authorization: apiAuthHeader,
    },
    transitional: {
        clarifyTimeoutError: true,
    },
});

async function getData(stopId: number, limit: number = 5) {
    const path = `/gtlservice/trips_new?limit=${limit}&stopId=${stopId}&type=U`;
    let start = Date.now();

    try {
        const resp = await client.get(path);
        console.log(`Loaded ${path} in ${Date.now() - start} ms`);
        return resp.data;
    } catch (err) {
        const elapsed = Date.now() - start;
        if (axios.isAxiosError(err)) {
            if (err.response) {
                const resp = err.response as AxiosResponse;
                console.error(`Error while fetching ${path} after ${elapsed} ms: ${resp.status} ${resp.statusText}`);
            } else if (err.code == 'ETIMEDOUT') {
                console.error(`Error (timeout) while fetching ${path} after ${elapsed} ms`);
            } else {
                console.error(`Error while fetching ${path} after ${elapsed} ms: ${err.message}`);
            }

            throw createError({
                statusCode: 503,
                name: 'Service Unavailable',
                message: 'The service is temporarily unavailable',
            });
        }

        console.error(`Error while fetching ${path} after ${elapsed} ms`);

        throw err;
    }
}

function parseTrips(stopId: number, data: any): Trip[] {
    return data.map((trip: any): Trip => {
        // Compute wait time in minutes
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

        // If the bus is detected to be already at the first stop
        if (currentStopSequenceNumber > 0) {
            // Find the stop where the bus is
            const currentBusStop = trip['stopTimes'].find(
                (stop: any) => stop['stopSequence'] == currentStopSequenceNumber
            );
            // Find the stop where the user is, but only after the current bus stop
            const currentUserStop = trip['stopTimes'].find(
                (stop: any) => stop['stopId'] == stopId && stop['stopSequence'] >= currentStopSequenceNumber
            );
            // If it's null, it means the bus is already beyond the user stop
            if (currentUserStop == null) {
                distanceInStops = -2;
            } else {
                // Compute how many stops away the bus is
                distanceInStops = currentUserStop['stopSequence'] - currentBusStop['stopSequence'];
            }
        }
        // If the bus hasn't still reached the first stop, but it's sending data,
        // it means it's about to depart
        else if (currentStopSequenceNumber == 0 && delay != null) {
            distanceInStops = -1;
        }

        // Check if the last update of real-time data isn't recent enough
        let isOutdated = false;
        if (delay != null) {
            const lastEventDate = new Date(trip['lastEventRecivedAt']);
            isOutdated = Date.now() - lastEventDate.getTime() > OUTDATED_DATA_THRESHOLD;
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
            isOutdated,
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
