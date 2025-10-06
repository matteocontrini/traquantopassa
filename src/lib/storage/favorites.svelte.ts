import { browser } from '$app/environment';

const STOPS_KEY = 'tqp_stops_favorites';
const STATIONS_KEY = 'tqp_stations_favorites';

export class LocalStore<T> {
	value = $state<T>() as T;
	key = '';

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) this.value = this.deserialize(item);
		}

		$effect(() => {
			localStorage.setItem(this.key, this.serialize(this.value));
		});
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
