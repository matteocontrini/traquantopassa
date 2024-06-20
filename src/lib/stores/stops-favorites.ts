import { type Writable, writable } from 'svelte/store';
import { loadFavorites, persistFavorites } from '$lib/storage/stops-favorites';


export interface FavoritesStore extends Writable<Set<string>> {
	addFavorite: (stopId: string) => void;
	removeFavorite: (stopId: string) => void;
}


export function createFavoritesStore() {
	const { subscribe, update } = writable<Set<string>>(new Set(loadFavorites()));

	return {
		subscribe,
		addFavorite: (stopId: string) => update(favorites => {
			favorites.add(stopId);
			persistFavorites(favorites);
			return favorites;
		}),
		removeFavorite: (stopId: string) => update(favorites => {
			favorites.delete(stopId);
			persistFavorites(favorites);
			return favorites;
		})
	} as FavoritesStore;
}
