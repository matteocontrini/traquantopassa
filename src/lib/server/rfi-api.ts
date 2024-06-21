import * as cheerio from 'cheerio';
import * as logger from '$lib/logger';
import { elapsed } from '$lib/server/time-helpers';

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
}

export async function getTrains(stationId: string): Promise<ApiTrain[]> {
	const params = new URLSearchParams();
	params.append('placeId', stationId);
	params.append('arrivals', 'false');

	logger.info(`Fetching trains for station ${stationId}`);
	const start = performance.now();

	const res = await fetch(
		'https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?' + params.toString(),
		{
			signal: AbortSignal.timeout(6 * 1000)
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
		const notes = cells.eq(8).text().trim();

		trains.push({
			carrier,
			category,
			number,
			destination,
			time,
			platform,
			delay,
			isBlinking,
			notes
		});
	});

	return trains;
}
