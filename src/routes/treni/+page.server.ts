import * as stationsService from '#lib/server/stations-service.js';

export function load() {
	const stations = stationsService.getStationList();
	const railways = stationsService.getRailways();

	return {
		stations,
		railways,
	};
}
