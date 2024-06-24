export interface Trip {
	id: string;
	routeName: string;
	routeColor: string;
	destination: string;
	minutes: number;
	delay: number | null;
	distanceInStops: number | null;
	currentStopSequenceNumber: number;
	isOutdated: boolean;
}
