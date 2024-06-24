import NodeCache from 'node-cache';
import type { StopDirection } from '$lib/StopDirection';
import * as api from '$lib/server/trentino-trasporti-api';
import * as routesService from '$lib/server/routes-service';
import type { Stop } from '$lib/Stop';
import type { Route } from '$lib/Route';
import type { Trip } from '$lib/Trip';
import * as logger from '$lib/logger';
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
	return apiTrips.map(trip => {
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
		const endOfRouteStopId = trip.stopTimes.at(-1)!.stopId;
		const nextStopId = trip.stopNext;
		const delay = endOfRouteStopId != nextStopId ? trip['delay'] : null;

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

		// Add timestamp to the trip ID since there could be multiple trips with the same ID (e.g. hourly trips)
		const id = trip.tripId + '-' + new Date(trip.oraArrivoProgrammataAFermataSelezionata).getTime();

		return {
			id,
			routeName: route.name,
			routeColor: route.color,
			destination: trip.tripHeadsign,
			minutes,
			delay,
			distanceInStops,
			currentStopSequenceNumber,
			isOutdated
		} as Trip;
	});
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
