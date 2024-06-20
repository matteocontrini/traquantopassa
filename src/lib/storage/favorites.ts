import { browser } from '$app/environment';

const STOPS_KEY = 'tqp_stops_favorites';
const STATIONS_KEY = 'tqp_stations_favorites';

function persistFavorites(localStorageKey: string, favorites: Set<string>) {
	localStorage.setItem(localStorageKey, JSON.stringify([...favorites]));
}

function loadFavorites(localStorageKey: string): string[] {
	if (!browser) {
		return [];
	}
	const favorites = localStorage.getItem(localStorageKey);
	if (favorites) {
		try {
			return JSON.parse(favorites);
		} catch (e) {
			console.error(`Error parsing favorites from ${localStorageKey}`, e);
		}
	}
	return [];
}

export function persistStationsFavorites(favorites: Set<string>) {
	persistFavorites(STATIONS_KEY, favorites);
}

export function persistStopsFavorites(favorites: Set<string>) {
	persistFavorites(STOPS_KEY, favorites);
}

export function loadStationsFavorites(): string[] {
	return loadFavorites(STATIONS_KEY);
}

export function loadStopsFavorites(): string[] {
	return loadFavorites(STOPS_KEY);
}
