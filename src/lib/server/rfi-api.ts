import * as cheerio from 'cheerio';
import * as logger from '$lib/logger';
import { elapsed } from '$lib/server/time-helpers';
import type { Coordinates } from '$lib/Coordinates';
import type { StopTime } from '$lib/Trip';

export interface ApiTrain {
	carrier: string;
	category: string;
	number: string;
	destination: string;
	time: string;
	platform: string;
	delay: string;
	isBlinking: boolean;
	notes: string;
	stopTimes: StopTime[];
}

interface RfiJsonStation {
	name: string;
	loc: {
		lat: string;
		lng: string;
	};
	pr: string;
	rg: string;
	ct: string;
	lk: string;
}

export interface RfiStation {
	name: string;
	coordinates: Coordinates;
	province: string;
	region: string;
	city: string;
	slug: string;
}

const TIMEOUT = 10 * 1000;


export async function getStations(): Promise<RfiStation[]> {
	logger.info(`Fetching stations from RFI map page`);
	const start = performance.now();

	const res = await fetch(
		'https://www.rfi.it/it/stazioni.html',
		{
			signal: AbortSignal.timeout(TIMEOUT)
		}
	);

	const $ = cheerio.load(await res.text());

	const stationsJson = $('input#stationsJSON').prop('value');
	const parsedStations = JSON.parse(stationsJson) as RfiJsonStation[];

	if (!Array.isArray(parsedStations)) {
		throw new Error('Invalid stations JSON format, array expected');
	}

	const rfiStations: RfiStation[] = parsedStations.map((station) => {
		return {
			name: station.name,
			coordinates: {
				latitude: +station.loc.lat,
				longitude: +station.loc.lng
			},
			province: station.pr,
			region: station.rg,
			city: station.ct,
			slug: station.lk.replace('.html', '')
		};
	});

	logger.info(`Fetched ${rfiStations.length} stations in ${elapsed(start)} ms`);
	return rfiStations;
}

export async function getIdFromSlug(slug: string): Promise<string | null> {
	logger.info(`Fetching station ID from RFI for "${slug}"`);
	const res = await fetch(
		`https://www.rfi.it/it/stazioni/${slug}.html`,
		{
			signal: AbortSignal.timeout(TIMEOUT)
		}
	);

	const $ = cheerio.load(await res.text());
	const iechubLink = $('iframe').prop('src');

	if (!iechubLink) {
		return null;
	}

	const matches = /\?.*placeId=(\d+)/.exec(iechubLink);
	if (!matches) {
		return null;
	}

	return matches[1];
}

export async function getTrains(stationId: string, arrivals: boolean = false): Promise<ApiTrain[]> {
	const params = new URLSearchParams();
	params.append('placeId', stationId);
	params.append('arrivals', arrivals.toString());

	logger.info(`Fetching trains for station ${stationId}`);
	const start = performance.now();

	const res = await fetch(
		'https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?' + params.toString(),
		{
			signal: AbortSignal.timeout(TIMEOUT)
		}
	);
	const text = await res.text();

	logger.info(`Fetched trains for station ${stationId} in ${elapsed(start)} ms`);

	return parseTrains(text);
}

function parseTrains(html: string): ApiTrain[] {
	const $ = cheerio.load(html);

	const trains: ApiTrain[] = [];

	$('tbody tr').each((i, elem) => {
		const cells = $('td', elem);

		const carrier = cells.eq(0).find('img').attr('alt');
		if (!carrier) {
			return;
		}

		const category = cells.eq(1).find('img').attr('alt') ?? '';
		const number = cells.eq(2).text().trim();
		const destination = cells.eq(3).text().trim();
		const time = cells.eq(4).text().trim();
		const delay = cells.eq(5).text().trim();
		const platform = cells.eq(6).text().trim();
		const isBlinking = cells.eq(7).find('img').length > 0;

		const stopsAndNotes = cells.eq(8).find('div');
		// if "Fermate successive" is not provided, "Informazioni" can be present in its place
		// so it's not reliable to use .eq() to find it
		const callingAt = stopsAndNotes.find('div:contains("Fermate successive")')
			.next('div').text().trim().replace('FERMA A: ', '');

		const notes = stopsAndNotes.find('div:contains("Informazioni")')
			.next('div').text().trim();

		// If callingAt is an empty string, split() would return a one-element array.
		// Return an empty array instead.
		const stopTimes: StopTime[] = callingAt ? callingAt.split(') - ').map(stop => {
			const result = /^(.+) \((\d\d?.\d\d)\)?$/.exec(stop);

			return {
				// if regex fails, return the whole row in the name field as a fallback
				name: result ? result[1] : stop,
				time: result ? result[2].replace('.', ':') : ''
			} satisfies StopTime;
		}) : [];

		trains.push({
			carrier,
			category,
			number,
			destination,
			time,
			platform,
			delay,
			isBlinking,
			notes,
			stopTimes
		});
	});

	return trains;
}
