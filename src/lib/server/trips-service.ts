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

const tripsCacheDurationSeconds = 30;
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

		// Check if the trip is at the last stop and don't use the delay in that case
		// (the delay is always 0 in that case)
		// Note: use stopNext because sometimes the last stop is never reached
		const endOfRoute = trip.stopTimes.at(-1)!;
		const nextStopId = trip.stopNext;
		const delay = endOfRoute.stopId != nextStopId ? trip.delay : null;

		// *** Compute how many stops away the bus is
		let distanceInStops = null;
		const currentStopSequenceNumber = trip.lastSequenceDetection;

		// If the bus is detected to be already at the first stop
		if (currentStopSequenceNumber > 0) {
			// Find the stop where the bus is
			const currentBusStop = trip.stopTimes.find(
				(stop) => stop.stopSequence == currentStopSequenceNumber
			);
			// Find the stop where the user is, but only after the current bus stop
			const currentUserStop = trip.stopTimes.find(
				(stop) => stop.stopId == userStopId && stop.stopSequence >= currentStopSequenceNumber
			);
			// If it's null, it means the bus is already beyond the user stop
			if (currentUserStop == null) {
				distanceInStops = -2;
			} else {
				// Compute how many stops away the bus is
				distanceInStops = currentUserStop.stopSequence - currentBusStop!.stopSequence;
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
			const lastEventDate = new Date(trip.lastEventRecivedAt);
			isOutdated = (Date.now() - lastEventDate.getTime()) > outdatedDataThresholdMillis;
		}

		// Check if the trip will end at the current user stop
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

		// Add timestamp to the trip ID since there could be multiple trips with the same ID (e.g. hourly trips)
		const id = trip.tripId + '-' + new Date(trip.oraArrivoProgrammataAFermataSelezionata).getTime();

		const stopTimes = trip.stopTimes.map((stopTime) => {
			return {
				name: stopTime.stopId === userStopId 
							? "$current_stop" 
							: stopIdToName(stopTime.stopId),
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
			distanceInStops,
			currentStopSequenceNumber,
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
