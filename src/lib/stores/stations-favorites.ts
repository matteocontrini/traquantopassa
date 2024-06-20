import { type Writable, writable } from 'svelte/store';
import { loadStationsFavorites, persistStationsFavorites } from '$lib/storage/favorites';

export interface FavoritesStore extends Writable<Set<string>> {
	addFavorite: (stationId: string) => void;
	removeFavorite: (stationId: string) => void;
}

export function createFavoritesStore() {
	const { subscribe, update } = writable<Set<string>>(new Set(loadStationsFavorites()));

	return {
		subscribe,
		addFavorite: (stationId: string) => update(favorites => {
			favorites.add(stationId);
			persistStationsFavorites(favorites);
			return favorites;
		}),
		removeFavorite: (stationId: string) => update(favorites => {
			favorites.delete(stationId);
			persistStationsFavorites(favorites);
			return favorites;
		})
	} as FavoritesStore;
}
