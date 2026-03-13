import NodeCache from 'node-cache';
import * as api from './rfi-api';
import type { Train } from '$lib/Train';
import CachedItem from '$lib/server/CachedItem';
import type { StopTime } from '$lib/Trip';

const cache = new NodeCache();

const cacheDurationSeconds = 30;

export async function getTrains(stationId: string, isDeparture = true): Promise<CachedItem<Train[]>> {
	let cachedItem = cache.get<CachedItem<Train[]>>(`trains-${stationId}-${isDeparture}`);
	if (cachedItem) {
		return cachedItem;
	}

	// Fetch from API
	const apiTrains = await api.getTrains(stationId, !isDeparture);

	const trains = mapTrains(apiTrains);
	cachedItem = new CachedItem(trains);

	// Save to cache
	cache.set(`trains-${stationId}-${isDeparture}`, cachedItem, cacheDurationSeconds);

	return cachedItem;
}

function mapTrains(apiTrains: api.ApiTrain[]): Train[] {
	return apiTrains.map((train) => {
		let isDelayed = false;
		let delay = train.delay;
		if (/^[0-9]+$/.test(delay)) {
			delay = `+${delay}′`;
			isDelayed = true;
		}

		const carrier = fixCarrier(train.carrier);
		const category = fixCategory(train.category);
		const icon = categoryToIcon(train.category);

		const isReplacedByBus = checkIsReplacedByBus(icon, delay, train.notes);

		// Train is cancelled but sometimes notes are missing for a while, so we don't know if it's replaced by bus or what
		const isIncomplete = delay == 'Cancellato' && train.notes == '' && train.callingAt == '';

		// Hide platform if it's "punto fermata" (bus) or if the train is replaced by bus (platform doesn't matter anymore)
		const platform = (train.platform == 'PF' || isReplacedByBus) ? '' : train.platform;

		// If callingAt is an empty string, it will just be split into 1 empty array
		// an empty array is retruned instead
		const stopTimes: StopTime[] = train.callingAt ? train.callingAt.split(') - ').map(stop => {
			const result = /^(.+) \((\d\d?.\d\d)\)?$/.exec(stop)

			return {
				// if regex fails, return the whole row in the name field as a fallback
				name: result ? capitalize(result[1]) : stop,
				time: result ? result[2].replace('.', ':') : '',
			} satisfies StopTime;
		}) : [];

		return {
			carrier: carrier,
			uid: carrier + train.number,
			category: category,
			icon: icon,
			number: train.number,
			destination: capitalize(train.destination),
			time: train.time,
			platform: platform,
			delay: delay,
			isDelayed: isDelayed,
			isBlinking: train.isBlinking,
			isReplacedByBus,
			isIncomplete: isIncomplete,
			notes: train.notes,
			stopTimes
		};
	});
}

function capitalize(str: string): string {
	return str
		.toLowerCase()
		.replaceAll(/\.(\w)/g, '. $1') // e.g. "VENEZIA S.LUCIA" -> "VENEZIA S. LUCIA"
		.replaceAll(/(\w)\/(\w)/g, '$1 / $2') // e.g. "MERANO/MERAN" -> "MERANO / MERAN"
		.replaceAll(/'+/g, "'") // For some reason apostrophes are repated 4 times in RFI monitor"
		// split along spaces, dashes and apostrophes before re-capitalizing
		//  e.g. "PONTE D'ADIGE" -> "Ponte D'Adige" 
		.split(/(?<=[ \-'])/g)
		.map((word) => word.charAt(0).toUpperCase() + word.substring(1))
		.join('');
}

function fixCarrier(carrier: string): string {
	if (carrier.toLowerCase() === 'tt') {
		return 'Trentino Trasporti';
	}

	if (carrier.length <= 3) {
		return carrier.toUpperCase();
	}

	return capitalize(carrier);
}

function fixCategory(category: string): string {
	category = category.replace('Categoria ', '');

	const mapping = {
		'bus': 'Bus',
		'rv': 'Regionale Veloce',
		'reg': 'Regionale',
		'ec': 'Eurocity',
		'alta velocita\'': 'Alta Velocità',
		'italo': 'Alta Velocità Italo',
		'intercity': 'Intercity',
		'intercity notte': 'Intercity Notte',
		'rj': 'Railjet',
		're': 'RegioExpress',
		'nj': 'Nightjet',
		'en': 'Euronight'
	};

	category = category.toLowerCase();

	if (category in mapping) {
		return mapping[category as keyof typeof mapping];
	}

	return category.toUpperCase();
}

function categoryToIcon(category: string): string | null {
	const mapping = {
		'bus': 'bus',
		'rv': 'rv', // regionale veloce
		'reg': 'r', // regionale
		'ec': 'ec', // eurocity
		'alta velocita\'': 'av',
		'italo': 'av',
		'intercity': 'ic',
		'intercity notte': 'icn',
		'rj': 'rj', // railjet
		'nj': 'nj', // nightjet
		'en': 'en', // euronight
		're': 're', // regio express
	};

	category = category.replace('Categoria ', '').toLowerCase();

	if (category in mapping) {
		return mapping[category as keyof typeof mapping];
	}

	return null;
}

function checkIsReplacedByBus(icon: string | null, delay: string, notes: string): boolean {
	let isReplacedByBus = false;
	// If the train is marked as cancelled, look if it's replaced by a bus.
	// Note: sometimes the train is marked as replaced by bus even if it's actually not at the current station
	// (it could be in previous stations), hence the "cancelled" check, which tells us if it's actually a train.
	notes = notes.toLocaleLowerCase();
	if (icon != 'bus' && delay == 'Cancellato') {
		isReplacedByBus =
			notes.includes('autosostituito') || notes.includes('bus sostitutivo');
	}

	return isReplacedByBus;
}
