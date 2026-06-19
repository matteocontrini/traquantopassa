import * as stationsService from '$lib/server/stations-service';

export function load({ setHeaders }) {
	const stations = stationsService.getStationList();
	const railways = stationsService.getRailways();

	return {
		stations,
		railways
	};
}
