import NodeCache from 'node-cache';
import type { StopDirection } from '$lib/StopDirection';
import * as api from '$lib/server/trentino-trasporti-api';
import * as routesService from '$lib/server/routes-service';
import type { Stop } from '$lib/Stop';
import type { Route } from '$lib/Route';
import type { Trip, StopTime } from '$lib/Trip';
import * as logger from '$lib/logger';
import { getStopName } from '$lib/server/stops-service';
import CachedItem from '$lib/server/CachedItem';

const cache = new NodeCache();

// Cache is 1s less than refresh time to avoid an issue where the auto refresh
// sometimes only happens every 1 minute instead of every 30s
const tripsCacheDurationSeconds = 29;

const DEFAULT_LIMIT = 16;
const EARLY_THRESHOLD_MINS = 5;
const STOP_AHEAD_THRESHOLD = 2;

export async function getTrips(stop: Stop): Promise<CachedItem<StopDirection>> {
	const stopId = stop.id;

	// Return from cache if available
	let cachedItem = cache.get<CachedItem<StopDirection>>(`trips-${stopId}`);
	if (cachedItem) {
		return cachedItem;
	}

	// Fetch from API
	logger.info(`Fetching trips for stop ${stopId}`);
	const apiTrips = await api.getTrips(stopId, DEFAULT_LIMIT);
	const routes = await routesService.getRoutes();

	let trips = await mapApiTrips(apiTrips, routes, stopId);

	// Sometimes an incorrect trip ID is inserted, causing data from the next trip
	// to be displayed. This can make a bus appear massively early.
	// Example: a bus that is 5 minutes late may show the next trip's data and appear
	// 55 minutes early. The trip remains visible at all stops until its scheduled
	// departure time, which is confusing for users.
	//
	// Hide suspiciously early trips if the bus has already passed the current stop
	// or reached the end of the line. Smaller early values are kept visible since
	// they may be legitimate and allow users to see that they missed the bus.
	trips = trips.filter((trip) => {
		const distanceInStops = trip.userStopSequenceNumber - trip.currentStopSequenceNumber;
		const isFarAhead = distanceInStops < -STOP_AHEAD_THRESHOLD;
		const isEndOfLine = trip.currentStopSequenceNumber === trip.stopTimes.length;

		const isTooEarly = trip.delay != null && trip.delay < -EARLY_THRESHOLD_MINS;

		return !(isTooEarly && (isFarAhead || isEndOfLine));
	});

	const direction = {
		name: directionName(stop),
		trips,
	} as StopDirection;

	cachedItem = new CachedItem(direction);

	// Save to cache
	cache.set(`trips-${stopId}`, cachedItem, tripsCacheDurationSeconds);

	return cachedItem;
}

async function mapApiTrips(apiTrips: api.ApiTrip[], routes: Route[], userStopId: number) {
	return Promise.all(
		apiTrips.map(async (trip) => {
			const route = routes.find((r) => r.id === trip.routeId)!;

			// Compute wait time in minutes
			const expectedTime = new Date(trip.oraArrivoEffettivaAFermataSelezionata);
			let minutes = Math.ceil((expectedTime.getTime() - Date.now()) / 1000 / 60);
			if (minutes < 0) {
				minutes = 0;
			}

			const delay = trip.delay;

			let currentStopSequenceNumber = trip.lastSequenceDetection;

			// If a bus is delayed enough that it won't make it to the next route in time,
			// it is incorrectly shown as being on the first stop, this sets it to -1 so we can display the information
			if (trip.stopNext === 0 && delay != null) {
				currentStopSequenceNumber = -1;
			}

			// Check if the last update of real-time data isn't recent enough
			let lastUpdatedTimestamp = 0;
			if (delay != null && trip.lastEventRecivedAt != null) {
				lastUpdatedTimestamp = new Date(trip.lastEventRecivedAt).getTime();
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
				isEndOfRouteForUser =
					currentStopSequenceNumber > 1 || formatTime(expectedTime) == endOfRoute.arrivalTime;
			}

			const userStopSequenceNumber = isEndOfRouteForUser
				? trip.stopTimes.length
				: trip.stopTimes.find((stop) => stop.stopId == userStopId)!.stopSequence;

			// Add timestamp to the trip ID since there could be multiple trips with the same ID (e.g. hourly trips)
			const id =
				trip.tripId + '-' + new Date(trip.oraArrivoProgrammataAFermataSelezionata).getTime();

			const stopTimes = trip.stopTimes.map((stopTime) => {
				return {
					name: getStopName(stopTime.stopId),
					// Time is returned with seconds that are always 00 so we omit them
					time: stopTime.arrivalTime.substring(0, 5),
				} satisfies StopTime as StopTime;
			});

			return {
				id,
				routeName: route.name,
				routeColor: route.color,
				destination: trip.tripHeadsign,
				vehicleId: trip.matricolaBus?.toString() || null,
				minutes,
				delay,
				currentStopSequenceNumber,
				userStopSequenceNumber,
				lastUpdatedTimestamp,
				isEndOfRouteForUser,
				stopTimes,
			} satisfies Trip as Trip;
		}),
	);
}

function directionName(stop: Stop): string {
	if (stop.code.endsWith('z')) {
		return `» Periferia`;
	} else if (stop.code.endsWith('x')) {
		return `» Centro`;
	} else if (stop.code.endsWith('c')) {
		return `Capolinea`;
	} else if (stop.code.endsWith('s')) {
		return `Sud`;
	} else if (stop.code.endsWith('n')) {
		return `Nord`;
	} else if (stop.code.endsWith('o')) {
		return `Ovest`;
	} else if (stop.code.endsWith('e')) {
		return `Est`;
	} else {
		return '';
	}
}

function formatTime(date: Date) {
	// Output format should always be 15:00:00
	return date.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome' });
}
