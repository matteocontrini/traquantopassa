import type { Handle } from '@sveltejs/kit';
import * as logger from '$lib/logger';

export const handle: Handle = async ({ event, resolve }) => {
	const ip = event.request.headers.get('x-forwarded-for')?.split(',')[0] || event.getClientAddress();
	logger.info(`${ip} - ${event.request.method} ${event.url.pathname + event.url.search}`);

	const response = await resolve(event);

	// Disable HTTP caching on all HTML pages.
	// HTML pages embed references to hashed, immutable JS chunks that change on
	// every deploy, so they must never be served stale or they'll point at chunks that no longer exist.
	if (response.headers.get('content-type')?.startsWith('text/html')) {
		response.headers.set('Cache-Control', 'no-cache');
	}

	return response;
};

async function logExternalIp() {
	const res = await fetch('http://ip-api.com/json');
	const json = await res.json();
	logger.info(`External IP: ${json.query}`);
}

logExternalIp();
