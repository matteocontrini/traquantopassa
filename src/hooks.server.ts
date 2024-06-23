import type { Handle } from '@sveltejs/kit';
import * as logger from '$lib/logger';

export const handle: Handle = ({ event, resolve }) => {
	const ip = event.request.headers.get('fly-client-ip') || event.getClientAddress();
	logger.info(`${ip} - ${event.request.method} ${event.url.pathname + event.url.search}`);
	return resolve(event);
};
