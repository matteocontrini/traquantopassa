import NodeCache from 'node-cache';
import type { StopDirection } from '$lib/StopDirection';
import * as api from '$lib/server/trentino-trasporti-api';
import * as routesService from '$lib/server/routes-service';
import type { Stop } from '$lib/Stop';
import type { Route } from '$lib/Route';
import type { Trip, StopTime} from '$lib/Trip';
import * as logger from '$lib/logger';
import { stopIdToName } from '$lib/server/stops-service';
import CachedItem from '$lib/server/CachedItem';

const cache = new NodeCache();

// Cache is 1s less than refresh time to avoid an issue where the auto refresh
// sometimes only happens every 1 minute instead of every 30s

const tripsCacheDurationSeconds = 29;
const defaultLimit = 15;
const outdatedDataThresholdMillis = 1000 * 60 * 5;

export async function getTrips(stop: Stop): Promise<CachedItem<StopDirection>> {
	const stopId = stop.id;

	// Return from cache if available
	let cachedItem = cache.get<CachedItem<StopDirection>>(`trips-${stopId}`);
	if (cachedItem) {
		return cachedItem;
	}

	// Fetch from API
	logger.info(`Fetching trips for stop ${stopId}`);
	const apiTrips = await api.getTrips(stopId, defaultLimit);
	const routes = await routesService.getRoutes();

	const trips = await mapApiTrips(apiTrips, routes, stopId);

	const direction = {
		name: directionName(stop),
		trips
	} as StopDirection;

	cachedItem = new CachedItem(direction);

	// Save to cache
	cache.set(`trips-${stopId}`, cachedItem, tripsCacheDurationSeconds);

	return cachedItem;
}

async function mapApiTrips(apiTrips: api.ApiTrip[], routes: Route[], userStopId: number) {
	return Promise.all(apiTrips.map(async trip => {
		const route = routes.find(r => r.id === trip.routeId)!;

		// Compute wait time in minutes
		const expectedTime = new Date(trip.oraArrivoEffettivaAFermataSelezionata);
		let minutes = Math.ceil((expectedTime.getTime() - Date.now()) / 1000 / 60);
		if (minutes < 0) {
			minutes = 0;
		}

		const delay = trip.delay;
		
		const currentStopSequenceNumber = trip.lastSequenceDetection;
		
		// Check if the last update of real-time data isn't recent enough
		let isOutdated = false;
		if (delay != null) {
			const lastEventDate = new Date(trip.lastEventRecivedAt);
			isOutdated = (Date.now() - lastEventDate.getTime()) > outdatedDataThresholdMillis;
		}
		
		// Check if the trip will end at the current user stop
		const endOfRoute = trip.stopTimes.at(-1)!;
		let isEndOfRouteForUser = endOfRoute.stopId == userStopId;
		// If this route is a circular route, also make sure that this trip is
		// for an arrival at the current user stop and not a departure from the stop.
		// We use two strategies, in this order:
		// 1. When live data is available, detect if the bus is already beyond the first stop
		// 2. Check if the expected time at the current stop matches the time of the last stop of the trip
		if (isEndOfRouteForUser && trip.stopTimes[0].stopId == endOfRoute.stopId) {
			isEndOfRouteForUser = currentStopSequenceNumber > 1
				|| formatTime(expectedTime) == endOfRoute.arrivalTime;
		}


		const userStopSequenceNumber = isEndOfRouteForUser ?
										trip.stopTimes.length :
										trip.stopTimes.find((stop) => stop.stopId == userStopId)!.stopSequence;

		// Add timestamp to the trip ID since there could be multiple trips with the same ID (e.g. hourly trips)
		const id = trip.tripId + '-' + new Date(trip.oraArrivoProgrammataAFermataSelezionata).getTime();

		const stopTimes = trip.stopTimes.map((stopTime) => {
			return {
				name: stopIdToName(stopTime.stopId),
				// Time is returned with seconds that are always 00 so we omit them
				time: stopTime.arrivalTime.substring(0, 5),
			} satisfies StopTime as StopTime;
		})
1
		return {
			id,
			routeName: route.name,
			routeColor: route.color,
			destination: trip.tripHeadsign,
			minutes,
			delay,
			currentStopSequenceNumber,
			userStopSequenceNumber,
			isOutdated,
			isEndOfRouteForUser,
			stopTimes,
		} satisfies Trip as Trip;
	}));
}

function directionName(stop: Stop): string {
	if (stop.code.endsWith('z')) {
		return `» Periferia`;
	} else if (stop.code.endsWith('x')) {
		return `» Centro`;
	} else if (stop.code.endsWith('s')) {
		return `» Sud`;
	} else if (stop.code.endsWith('n')) {
		return `» Nord`;
	} else if (stop.code.endsWith('o')) {
		return `» Ovest`;
	} else if (stop.code.endsWith('e')) {
		return `» Est`;
	} else {
		return '';
	}
}

function formatTime(date: Date) {
	// Output format should always be 15:00:00
	return date.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome' });
}
