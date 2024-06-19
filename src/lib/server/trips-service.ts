import NodeCache from 'node-cache';
import type { StopDirection } from '$lib/StopDirection';
import * as api from '$lib/server/api';
import * as routesService from '$lib/server/routes-service';
import type { Stop } from '$lib/Stop';
import type { Route } from '$lib/Route';
import type { Trip } from '$lib/Trip';

const cache = new NodeCache();

const tripsCacheDurationSeconds = 30;
const defaultLimit = 15;
const outdatedDataThresholdMillis = 1000 * 60 * 5;

export async function getTrips(stop: Stop) {
	const stopId = stop.id;

	// Return from cache if available
	let direction = cache.get<StopDirection>(`trips-${stopId}`);
	if (direction) {
		console.log('Using cached trips for stop', stopId);
		return direction;
	}

	// Fetch from API
	console.log('Fetching trips for stop', stopId);
	const apiTrips = await api.getTrips(stopId, defaultLimit);
	const routes = await routesService.getRoutes();

	const trips = await mapApiTrips(apiTrips, routes, stopId);

	direction = {
		name: directionName(stop),
		trips
	} as StopDirection;

	// Save to cache
	cache.set(`trips-${stopId}`, direction, tripsCacheDurationSeconds);

	return direction;
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

		return {
			id: trip.tripId,
			routeName: route.name,
			routeColor: route.color,
			destination: trip.tripHeadsign,
			minutes,
			delay,
			distanceInStops,
			isOutdated
		} as Trip;
	});
}

function directionName(stop: Stop) {
	if (stop.code.endsWith('z')) {
		return `» Periferia`;
	} else if (stop.code.endsWith('x')) {
		return `» Centro`;
	} else {
		return '';
	}
}