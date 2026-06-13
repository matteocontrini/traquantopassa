export interface Trip {
	id: string;
	routeName: string;
	routeColor: string;
	destination: string;
	minutes: number;
	delay: number | null;
	currentStopSequenceNumber: number;
	userStopSequenceNumber: number;
	isOutdated: boolean;
	isEndOfRouteForUser: boolean;
	stopTimes: StopTime[];
	arrivalTime: string;
	isFutureSearch: boolean;
}

export interface StopTime {
	name: string;
	time: string;
}

export interface ExpandedTripState {
	id: string | null;
}
