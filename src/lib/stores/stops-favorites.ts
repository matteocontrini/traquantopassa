import { type Writable, writable } from 'svelte/store';
import { loadStopsFavorites, persistStopsFavorites } from '$lib/storage/favorites';


export interface FavoritesStore extends Writable<Set<string>> {
	addFavorite: (stopId: string) => void;
	removeFavorite: (stopId: string) => void;
}


export function createFavoritesStore() {
	const { subscribe, update } = writable<Set<string>>(new Set(loadStopsFavorites()));

	return {
		subscribe,
		addFavorite: (stopId: string) => update(favorites => {
			favorites.add(stopId);
			persistStopsFavorites(favorites);
			return favorites;
		}),
		removeFavorite: (stopId: string) => update(favorites => {
			favorites.delete(stopId);
			persistStopsFavorites(favorites);
			return favorites;
		})
	} as FavoritesStore;
}
