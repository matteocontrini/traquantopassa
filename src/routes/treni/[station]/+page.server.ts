import * as stationsService from '$lib/server/stations-service';
import * as trainsService from '$lib/server/trains-service';
import { error } from '@sveltejs/kit';
import type StationDetails from '$lib/StationDetails';
import { getStopForStation } from '$lib/server/stops-stations-mapping';
import * as logger from '$lib/logger';
import type { News } from '$lib/RouteNews';

export async function load({ params }) {
	const slug = params.station;

	const station = stationsService.getStationBySlug(slug);
	if (!station) {
		error(404);
	}

	let trains, news;
	try {
		trains = await trainsService.getTrains(station.id);
		news = await trainsService.getTrainNews(station.id);
	} catch (e) {
		logger.error(`Error while fetching trains for station ${station.slug}:`, e);
		error(503);
	}

	let trainNews: News[] = [];

	if (news !== '') {
		trainNews = news.split(' / ').map((alert, ind) => {
			return {
				id: ind,
				title: 'Avviso',
				details: alert,
				startDate: new Date(),
				endDate: new Date(),
				url: '',
				routes: []
			};
		});
	}

	return {
		details: {
			id: station.id,
			name: station.name,
			canonicalSlug: station.slug,
			lastUpdatedAt: trains.cachedAt,
			trains: trains.value,
			trainNews,
			stopSlug: getStopForStation(station.slug)
		} satisfies StationDetails as StationDetails
	};
}
