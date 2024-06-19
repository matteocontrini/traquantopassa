import * as stopsService from '$lib/server/stops-service';
import { error } from '@sveltejs/kit';
import type { StopGroupDetails } from '$lib/StopGroupDetails';

export async function load({ params }) {
	const slug = params.stop;

	const stop = await stopsService.getStopGroupBySlug(slug);
	if (!stop) {
		error(404);
	}

	return {
		details: {
			code: stop.code,
			name: stop.name,
			lastUpdatedAt: new Date(),
		} as StopGroupDetails
	};
}
