import * as api from '$lib/server/api';
import NodeCache from 'node-cache';
import type { StopGroup } from '$lib/StopGroup';
import type { Stop } from '$lib/Stop';
import type { StopCoordinates } from '$lib/StopCoordinates';
import customSlugs from '$lib/server/custom-slugs';
import customRanking from '$lib/server/custom-ranking';

const cache = new NodeCache();

const stopGroupsCacheKey = 'stop-groups';

export async function getStopGroups() {
	// Return from cache if available
	const stopGroups = cache.get<StopGroup[]>(stopGroupsCacheKey) ?? [];
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
	// TODO: cache expiration?
	cache.set(stopGroupsCacheKey, stopGroups);

	return stopGroups;
}

export async function getStopGroupBySlug(slug: string) {
	const stopGroups = await getStopGroups();
	return stopGroups.find(sg => sg.slugs.includes(slug));
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

	// Use slug override as default slug if available
	const slugs = [code];
	const customSlug = customSlugs[code];
	if (customSlug) {
		slugs.splice(0, 0, customSlug);
	}

	const stop = mapApiStopToStop(apiStop);
	return {
		name: apiStop.stopName,
		code: code,
		slugs: slugs,
		coordinates: calculateCoordinates([stop]),
		stops: [stop],
		routeIds: new Set(apiStop.routes.map(r => r.routeId)),
		ranking: customSlug ? customRanking[customSlug] ?? null : null
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