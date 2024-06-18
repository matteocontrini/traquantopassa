import * as api from '$lib/server/api';
import NodeCache from 'node-cache';
import type { StopGroup } from '$lib/StopGroup';
import type { Stop } from '$lib/Stop';
import type { StopCoordinates } from '$lib/StopCoordinates';
import customSlugs from '$lib/server/custom-slugs';

const cache = new NodeCache();

export async function getStopGroups() {
	// Return from cache if available
	const stopGroups = cache.get<StopGroup[]>('stopGroups') ?? [];
	if (stopGroups.length) {
		console.log('Using cached stop groups');
		return stopGroups;
	}

	console.log('Fetching stop groups from API');

	// Fetch stops from the API
	const apiStops = await api.getStops();

	// Group stops by name
	for (const apiStop of apiStops) {
		// Find existing stop group with the same stop code
		const existing = stopGroups.find(sg =>
			sg.code === apiStop.stopCode.replace(/[^0-9]/g, '')
		);
		if (existing) {
			existing.stops.push(mapApiStopToStop(apiStop));
			apiStop.routes.forEach(r => existing.routeIds.add(r.routeId));
		} else {
			stopGroups.push(mapApiStopToStopGroup(apiStop));
		}
	}

	// Sort by name
	stopGroups.sort((a, b) => a.name.localeCompare(b.name));

	// Save to cache
	cache.set('stopGroups', stopGroups);

	return stopGroups;
}

function mapApiStopToStop(apiStop: api.ApiStop): Stop {
	return {
		id: apiStop.stopId,
		code: apiStop.stopCode,
		coordinates: {
			lat: apiStop.stopLat,
			lon: apiStop.stopLon
		}
	};
}

function mapApiStopToStopGroup(apiStop: api.ApiStop): StopGroup {
	const code = apiStop.stopCode.replace(/[^0-9]/g, ''); // keep only digits

	// TODO: remove?
	const automaticSlug = apiStop.stopName.toLowerCase()
		.replace(/\. /g, '') // es. 'S. Bartolameo' -> 'S.Bartolameo'
		.replace(/\s/g, '-') // convert spaces to hyphens
		.normalize('NFD') // https://stackoverflow.com/a/37511463/1633924
		.replace(/[^a-z0-9-]/g, '') // remove non-alphanumeric characters
		.replace(/-+/g, '-'); // merge multiple hyphens

	// Use slug override as default slug if available
	const slugs = [code, automaticSlug];
	if (customSlugs[code]) {
		slugs.splice(0, 0, customSlugs[code]);
	}

	const stop = mapApiStopToStop(apiStop);
	return {
		name: apiStop.stopName,
		code: code,
		slugs: slugs,
		coordinates: calculateCoordinates([stop]),
		stops: [stop],
		routeIds: new Set(apiStop.routes.map(r => r.routeId))
	};
}

function calculateCoordinates(stops: Stop[]) {
	const lat = stops.reduce((acc, stop) => acc + stop.coordinates.lat, 0) / stops.length;
	const lon = stops.reduce((acc, stop) => acc + stop.coordinates.lon, 0) / stops.length;

	return {
		lat,
		lon
	} as StopCoordinates;
}
