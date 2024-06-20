import { browser } from '$app/environment';

const LOCAL_STORAGE_KEY = 'tqp_stops_favorites';

export function persistFavorites(favorites: Set<string>) {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...favorites]));
}

export function loadFavorites() {
	if (!browser) {
		return [];
	}
	const favorites = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (favorites) {
		try {
			return JSON.parse(favorites);
		} catch (e) {
			console.error('Error parsing favorites', e);
		}
	}
	return [];
}
