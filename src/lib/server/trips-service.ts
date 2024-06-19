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
	// TODO: limit
	const apiTrips = await api.getTrips(stopId, defaultLimit);
	const routes = await routesService.getRoutes();

	const trips = await mapApiTrips(apiTrips, routes);

	direction = {
		name: directionName(stop),
		trips
	} as StopDirection;

	// Save to cache
	cache.set(`trips-${stopId}`, direction, tripsCacheDurationSeconds);

	return direction;
}

async function mapApiTrips(apiTrips: api.ApiTrip[], routes: Route[]) {
	return apiTrips.map(trip => {
		const route = routes.find(r => r.id === trip.routeId)!;
		return {
			id: trip.tripId,
			routeName: route.name,
			routeColor: route.color,
			destination: trip.tripHeadsign,
			minutes: 0, // TODO
			delay: trip.delay,
			distanceInStops: null, // TODO
			isOutdated: false // TODO
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
