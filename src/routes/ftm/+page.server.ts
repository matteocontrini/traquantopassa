import ftmStationsList from '$lib/server/ftm/ftm-stations-list.js';

export function load({ setHeaders }) {
	const stations = ftmStationsList;

	setHeaders({ 'Cache-Control': 'max-age=3600' });

	return {
		stations,
	};
}
