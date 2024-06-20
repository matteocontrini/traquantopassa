import stationsList from '$lib/server/stations-list';

export function getStations() {
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

export function getStationBySlug(slug: string) {
	return stationsList.find(s => s.slug === slug);
}
