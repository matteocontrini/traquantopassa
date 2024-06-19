import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';

const localStorageKey = 'tqp-favorites';

export interface FavoritesStore extends Writable<Set<string>> {
	addFavorite: (stopId: string) => void;
	removeFavorite: (stopId: string) => void;
}

function persistFavorites(favorites: Set<string>) {
	localStorage.setItem(localStorageKey, JSON.stringify([...favorites]));
}

function loadFavorites() {
	if (!browser) {
		return [];
	}
	const favorites = localStorage.getItem(localStorageKey);
	return JSON.parse(favorites ?? '[]');
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
