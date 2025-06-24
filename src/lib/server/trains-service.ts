import NodeCache from 'node-cache';
import * as api from './rfi-api';
import type { Train } from '$lib/Train';
import CachedItem from '$lib/server/CachedItem';

const cache = new NodeCache();

const cacheDurationSeconds = 30;

export async function getTrains(stationId: string): Promise<CachedItem<Train[]>> {
	let cachedItem = cache.get<CachedItem<Train[]>>(`trains-${stationId}`);
	if (cachedItem) {
		return cachedItem;
	}

	// Fetch from API
	const apiTrains = await api.getTrains(stationId);

	const trains = mapTrains(apiTrains);
	cachedItem = new CachedItem(trains);

	// Save to cache
	cache.set(`trains-${stationId}`, cachedItem, cacheDurationSeconds);

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

		const category = fixCategory(train.category);

		const icon = categoryToIcon(category);

		const isReplacedByBus = checkIsReplacedByBus(icon, delay, train.notes);

		// Train is cancelled but sometimes notes are missing for a while, so we don't know if it's replaced by bus or what
		const isIncomplete = delay == 'Cancellato' && train.notes == '';

		// Hide platform if it's "punto fermata" (bus) or if the train is replaced by bus (platform doesn't matter anymore)
		const platform = (train.platform == 'PF' || isReplacedByBus) ? '' : train.platform;

		return {
			carrier: capitalize(train.carrier),
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
			isIncomplete: isIncomplete
		};
	});
}

function capitalize(str: string): string {
	return str
		.toLowerCase()
		.replace(/\.(\w)/g, '. $1') // e.g. "VENEZIA S.LUCIA" -> "VENEZIA S. LUCIA"
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.substring(1))
		.join(' ');
}

function fixCategory(category: string): string {
	category = category.replace('Categoria ', '');

	// AV has "ITALO" as the alt text
	category = category.replace(/italo/i, 'Alta Velocità');
	// Regionale Veloce is called "Civitavecchia Express Regionale Veloce"
	category = category.replace(/civitavecchia express/i, '').trim();

	return capitalize(category);
}

function categoryToIcon(category: string): string | null {
	category = category.toLowerCase();
	if (category.includes('autocorsa')) {
		return 'bus';
	} else if (category.includes('regionale veloce')) {
		return 'rv';
	} else if (category.includes('regionale')) {
		return 'r';
	} else if (category.includes('eurocity')) {
		return 'ec';
	} else if (category.includes('alta velocità')) {
		return 'av';
	} else if (category.includes('intercity notte')) {
		return 'icn';
	} else if (category.includes('intercity')) {
		return 'ic';
	} else if (category.includes('railjet')) {
		return 'rj';
	}

	return null;
}

function checkIsReplacedByBus(icon: string | null, delay: string, notes: string): boolean {
	let isReplacedByBus = false;
	// If the train is marked as cancelled, look if it's replaced by a bus.
	// Note: sometimes the train is marked as replaced by bus even if it's actually not at the current station
	// (it could be in previous stations), hence the "cancelled" check, which tells us if it's actually a train.
	if (icon != 'bus' && delay == 'Cancellato') {
		isReplacedByBus =
			notes.toLowerCase().includes('autosostituito') || notes.toLowerCase().includes('bus sostitutivo');
	}

	return isReplacedByBus;
}
