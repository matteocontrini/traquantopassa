import { env } from '$env/dynamic/private';
import * as logger from '$lib/logger';
import { elapsed } from '$lib/server/time-helpers';

const BASE_URL = env.API_BASE_URL;

if (!BASE_URL) {
	throw new Error('Missing API_BASE_URL environment variable');
}

const BASIC_AUTH = Buffer.from(env.API_USERNAME + ':' + env.API_PASSWORD).toString('base64');

export interface ApiStop {
	stopId: number;
	stopName: string;
	town: string;
	stopCode: string;
	stopLat: number;
	stopLon: number;
	routes: { routeId: number }[];
}

export interface ApiRoute {
	routeId: number;
	routeShortName: string;
	routeLongName: string;
	routeColor: string | null;
}

export interface ApiTrip {
	tripId: string;
	routeId: number;
	oraArrivoEffettivaAFermataSelezionata: string;
	oraArrivoProgrammataAFermataSelezionata: string;
	stopNext: number | null;
	lastSequenceDetection: number;
	delay: number | null;
	lastEventRecivedAt: string;
	tripHeadsign: string;
	stopTimes: ApiStopTime[];
}

export interface ApiStopTime {
	stopId: number;
	stopSequence: number;
}

export async function getStops() {
	const path = '/gtlservice/stops?type=U';

	logger.info('Fetching stops from API');
	const start = performance.now();

	const res = await fetch(BASE_URL + path, {
		headers: {
			'Authorization': 'Basic ' + BASIC_AUTH
		},
		signal: AbortSignal.timeout(10 * 1000)
	});

	let data: ApiStop[] = await res.json();

	logger.info(`Fetched stops in ${elapsed(start)} ms`);

	// Keep only stops in Trento and exclude "funivia" which has a different stop code pattern
	data = data.filter(stop => stop.town == 'Trento' && /^[0-9]+[a-z-]*$/.test(stop.stopCode));

	return data;
}

export async function getRoutes() {
	const path = '/gtlservice/routes?areas=23';

	logger.info('Fetching routes from API');
	const start = performance.now();

	const res = await fetch(BASE_URL + path, {
		headers: {
			'Authorization': 'Basic ' + BASIC_AUTH
		},
		signal: AbortSignal.timeout(10 * 1000)
	});

	const data: ApiRoute[] = await res.json();

	logger.info(`Fetched routes in ${elapsed(start)} ms`);

	return data;
}

export async function getTrips(stopId: number, limit: number) {
	const path = `/gtlservice/trips_new?limit=${limit}&stopId=${stopId}&type=U`;

	logger.info(`Fetching trips for ${stopId}`);
	const start = performance.now();

	const res = await fetch(BASE_URL + path, {
		headers: {
			'Authorization': 'Basic ' + BASIC_AUTH
		},
		signal: AbortSignal.timeout(6 * 1000)
	});

	const data: ApiTrip[] = await res.json();

	logger.info(`Fetched trips for ${stopId} in ${elapsed(start)} ms`);

	return data;
}
