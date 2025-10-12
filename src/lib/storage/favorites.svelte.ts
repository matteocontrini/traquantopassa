import { browser } from '$app/environment';

const STOPS_KEY = 'tqp_stops_favorites';
const STATIONS_KEY = 'tqp_stations_favorites';

export class LocalStore<T> {
	value = $state<T>() as T;
	key = '';
	#initialized = $state(false);

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			// Load from localStorage after hydration completes
			$effect(() => {
				if (!this.#initialized) {
					const item = localStorage.getItem(key);
					if (item) this.value = this.deserialize(item);
					this.#initialized = true;
				}
			});

			// Save to localStorage on changes (but not during initial load)
			$effect(() => {
				if (this.#initialized) {
					localStorage.setItem(this.key, this.serialize(this.value));
				}
			});
		}
	}

	serialize(value: T): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): T {
		return JSON.parse(item);
	}
}

export class FavoriteStations extends LocalStore<string[]> {
	addFavorite = (stationId: string) => {
		this.value.push(stationId);
	};
	removeFavorite = (stationId: string) => {
		this.value.splice(this.value.indexOf(stationId), 1);
	};
}

export function favoriteStationsStore(): FavoriteStations {
	return new FavoriteStations(STATIONS_KEY, []);
}

export class FavoriteStops extends LocalStore<string[]> {
	addFavorite = (stationId: string) => {
		this.value.push(stationId);
	};
	removeFavorite = (stationId: string) => {
		this.value.splice(this.value.indexOf(stationId), 1);
	};
}

export function favoriteStopsStore(): FavoriteStops {
	return new FavoriteStops(STOPS_KEY, []);
}
