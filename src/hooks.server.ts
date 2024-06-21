import type { Handle } from '@sveltejs/kit';
import * as logger from '$lib/logger';

export const handle: Handle = ({ event, resolve }) => {
	logger.info(`${event.getClientAddress()} - ${event.request.method} ${event.url.pathname + event.url.search}`);
	return resolve(event);
};
