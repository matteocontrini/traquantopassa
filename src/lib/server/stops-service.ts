import * as api from '$lib/server/trentino-trasporti-api';
import NodeCache from 'node-cache';
import type { StopGroup } from '$lib/StopGroup';
import type { Stop } from '$lib/Stop';
import type { Coordinates } from '$lib/Coordinates';
import customSlugs from '$lib/server/custom-slugs';
import customStopNames from '$lib/server/custom-stop-names';

const cache = new NodeCache({
	stdTTL: 24 * 60 * 60 // 24 hours
});

const stopGroupsCacheKey = 'stop-groups';

const stopNameMapping: Record<number, string> = {};

export function stopIdToName(id: number){
	return stopNameMapping[id] || "";
}

function updateStopNameMapping(apiStops: api.ApiStop[]) {
	// Set stop mapping for 
	for (const apiStop of apiStops ){
		const code = getCode(apiStop);
		const name = customStopNames[code] ?  customStopNames[code] : apiStop.stopName;
		stopNameMapping[apiStop.stopId] = name;
	}
}


export async function getStopGroups() {
	// Return from cache if available
	const cached = cache.get<StopGroup[]> (stopGroupsCacheKey);
	if (cached) {
		return cached;
	}

	const stopGroups: StopGroup[] = [];

	// Fetch stops from the API
	const apiStops = await api.getStops();

	// Update the name mapping while we have the data
	updateStopNameMapping(apiStops);

	// Group stops by name
	for (const apiStop of filterStops(apiStops)) {

		// Find existing stop group with the same stop code
		const existing = stopGroups.find(sg =>
			sg.code === getCode(apiStop)
		);
		if (existing) {
			existing.stops.push(createStop(apiStop));
			apiStop.routes.forEach(r => existing.routeIds.add(r.routeId));
			existing.coordinates = calculateCoordinates(existing.stops);
		} else {
			const stopGroup = createStopGroup(apiStop);
			const stop = createStop(apiStop);
			stopGroup.stops.push(stop);
			apiStop.routes.forEach(r => stopGroup.routeIds.add(r.routeId));
			stopGroup.coordinates = calculateCoordinates(stopGroup.stops);
			stopGroups.push(stopGroup);
		}
	}

	// Sort by name
	stopGroups.sort((a, b) => a.name.localeCompare(b.name));

	// Save to cache
	cache.set(stopGroupsCacheKey, stopGroups);

	return stopGroups;
}

export async function getStopGroupBySlug(slug: string) {
	const stopGroups = await getStopGroups();
	return stopGroups.find(sg => sg.slugs.includes(slug));
}

function filterStops (apiStops: api.ApiStop[]){
	return apiStops.filter( stop => 
		(stop.town === null || stop.town == 'Trento' ||  stop.town == 'Lavis' ) &&
		stop.stopLat > 46    && stop.stopLon > 11.04 &&
		stop.stopLat < 46.16 && stop.stopLon < 11.2  &&
		/^[0-9]+[a-z-]*$/.test(stop.stopCode));
}

function getCode (apiStop: api.ApiStop){
	return apiStop.stopCode.replace(/[^0-9]/g, ''); // keep only digits
}

function createStop(apiStop: api.ApiStop): Stop {
	return {
		id: apiStop.stopId,
		code: apiStop.stopCode,
		coordinates: {
			latitude: apiStop.stopLat,
			longitude: apiStop.stopLon
		}
	};
}

function createStopGroup(apiStop: api.ApiStop): StopGroup {
	const code = getCode(apiStop)

	// Use slug override as default slug if available
	const slugs = [code];
	const customSlug = customSlugs[code];
	if (customSlug) {
		slugs.splice(0, 0, customSlug);
	}

	let name = apiStop.stopName;
	if (customStopNames[code]) {
		name = customStopNames[code];
	}

	return {
		name,
		code,
		slugs,
		coordinates: null!, // will be filled later
		stops: [],
		routeIds: new Set()
	};
}

function calculateCoordinates(stops: Stop[]) {
	const lat = stops.reduce((acc, stop) => acc + stop.coordinates.latitude, 0) / stops.length;
	const lon = stops.reduce((acc, stop) => acc + stop.coordinates.longitude, 0) / stops.length;

	return {
		latitude: lat,
		longitude: lon
	} as Coordinates;
}
