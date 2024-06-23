// Mappings from stop slug to station slug
const mapping = {
	'stazione': 'trentofs',
	'mesianofs': 'povomesiano',
	'25650': 'villazzano',
	'questura': 'sanbartolameo',
	'21010': 'santachiara',
} as Record<string, string>;

export function getStationForStop(stopSlug: string): string | null {
	return mapping[stopSlug] || null;
}

export function getStopForStation(stationSlug: string): string | null {
	return Object.keys(mapping).find((key) => mapping[key] === stationSlug) || null;
}
