// Mappings from stop slug to station slug

export interface StopConnections {
	bus?: string;
	train?: string;
	ftm?: string
}

const mapping: StopConnections[] = [
	{
		bus: 'stazione',
		train: 'trentofs',
		ftm: 'trento',
	},
	/*{
		bus: '20150',
		train: 'trentofs',
		ftm: 'trento',
	}.*/
	{
		bus: 'mesianofs',
		train: 'povomesiano',
	},
	{
		bus: '25650',
		train: 'villazzano',
	},
	{
		bus: 'questura',
		train: 'sanbartolameo',
	},
	{
		bus: '21010',
		train: 'santachiara',
	},
	{
		train: 'mezzocorona',
		ftm: 'mezzocoronafs'
	},
	{
		bus: '22020',
		ftm: 'gardolo',
	},
	{
		bus: '22205',
		ftm: 'lamar'
	},
	{
		bus: '42042',
		ftm: 'sanfelice'
	},
	{
		bus: '22230',
		ftm: 'spini'
	},
	{
		bus: '29045',
		ftm: 'lavis'
	},
	{
		bus: '40202',
		train: 'lavis'
	}
]

export function getConnectionsForStop(stopSlug: string) {
	return mapping.find(stop => stop.bus == stopSlug);
}

export function getConnectionsForStation(stationSlug: string) {
	return mapping.find(stop => stop.train == stationSlug);
}

export function getConnectionsForFtm(ftmSlug: string) {
	return mapping.find(stop => stop.ftm == ftmSlug);
}