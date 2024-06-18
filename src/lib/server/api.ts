import { env } from '$env/dynamic/private';

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
	routeColor: string | null;
}

export async function getStops() {
	const res = await fetch(BASE_URL + '/gtlservice/stops?type=U', {
		headers: {
			'Authorization': 'Basic ' + BASIC_AUTH
		}
		// TODO: timeout
	});

	let data: ApiStop[] = await res.json();

	// Keep only stops in Trento and exclude "funivia" which has a different stop code pattern
	data = data.filter(stop => stop.town == 'Trento' && /^[0-9]+[a-z-]*$/.test(stop.stopCode));

	return data;
}

export async function getRoutes() {
	const res = await fetch(BASE_URL + '/gtlservice/routes?areas=23', {
		headers: {
			'Authorization': 'Basic ' + BASIC_AUTH
		}
		// TODO: timeout
	});

	const data: ApiRoute[] = await res.json();

	return data;
}
