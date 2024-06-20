import * as stationsService from '$lib/server/stations-service';

export function load({ setHeaders }) {
	const stations = stationsService.getStations();
	const railways = stationsService.getRailways();

	setHeaders({ 'Cache-Control': 'max-age=3600' });

	return {
		stations,
		railways
	};
}
