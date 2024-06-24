import { env } from '$env/dynamic/private';
import NodeCache from 'node-cache';
import stopsRankingFallback from '$lib/server/stops-ranking-fallback';
import * as logger from '$lib/logger';
import type { StopGroup } from '$lib/StopGroup';
import { elapsed } from '$lib/server/time-helpers';

const rankingCacheKey = 'stop-rankings';

const cache = new NodeCache({
	stdTTL: 24 * 60 * 60 // 24 hours
});

export async function getRankings(stops: StopGroup[]) {
	let rankings = cache.get<Record<string, number>>(rankingCacheKey);
	if (rankings) {
		return rankings;
	}

	try {
		rankings = await loadMostVisitedStops(stops);
		cache.set(rankingCacheKey, rankings);
	} catch (e) {
		logger.error('Error while fetching most visited stops', e);
		rankings = stopsRankingFallback;
	}

	return rankings;
}

async function loadMostVisitedStops(stops: StopGroup[]): Promise<Record<string, number>> {
	// Fetch most visited stops in the last month
	const start = new Date();
	start.setDate(start.getDate() - 30);

	const url = 'https://traquantopassa.goatcounter.com/api/v0/stats/hits?start=' + start.toISOString();

	logger.info('Fetching stops ranking from API');
	const startTs = performance.now();

	const response = await fetch(url, {
		headers: {
			Authorization: 'Bearer ' + env.GOATCOUNTER_API_KEY
		},
		signal: AbortSignal.timeout(3 * 1000)
	});

	const data = await response.json();

	logger.info(`Fetched stops ranking in ${elapsed(startTs)} ms`);

	const rankings: Record<string, number> = {};

	for (const hit of data.hits) {
		// Extract slug from URL
		const match = hit.path.match(/^\/\w+/);
		if (match) {
			const slug = match[0].slice(1);
			// See if a stop with that slug exists
			const stop = stops.find(x => x.slugs.includes(slug));
			if (stop) {
				// Sum or save the total hits count
				const code = stop.code;
				if (rankings[code]) {
					rankings[code] += hit.count;
				} else {
					rankings[code] = hit.count;
				}
			}
		}
	}

	return rankings;
}
