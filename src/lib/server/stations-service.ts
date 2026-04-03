import stationsList from '$lib/server/stations-list';
import type { Station } from '$lib/Station';
import { getIdFromSlug, getStations } from './rfi-api';

interface LazyStation extends Omit<Station, 'id'> {
	id: string | null;
}


const stationMap = new Map<string, Station | LazyStation>();
async function getStationMap() {
	if (stationMap.size != 0) {
		return stationMap;
	}

	for (const station of stationsList) {
		stationMap.set(station.slug, station);
	}

	for (const station of await getStations()) {
		if (stationMap.has(station.slug) ) {
			continue;
		}
		stationMap.set(station.slug, {
			id: null,
			slug: station.slug,
			name: station.name,
			coordinates: station.coordinates,
			railways: []
		} satisfies LazyStation);
	}

	return stationMap;
}

export function getStationList() {
	return stationsList;
}

export function getRailways() {
	const railways = new Set<string>();
	for (const station of stationsList) {
		for (const railway of station.railways) {
			railways.add(railway);
		}
	}
	return Array.from(railways);
}

export async function getStationBySlug(slug: string): Promise<Station | null> {
	const stationMap = await getStationMap();
	const station = stationMap.get(slug);
	if (!station) {
		return null;
	}

	if (station.id == null) {
		const id = await getIdFromSlug(slug);
		if (id == null) {
			// If we cannot find it on RFI, delete the entry to avoid bothering RFI too much.
			stationMap.delete(slug);
			return null;
		}
		station.id = id;
	}

	return station as Station;
}
