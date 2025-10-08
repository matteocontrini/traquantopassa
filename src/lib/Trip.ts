export interface Trip {
	id: string;
	routeName: string;
	routeColor: string;
	colorTxt: string;
	destination: string;
	minutes: number;
	delay: number | null;
	currentStopSequenceNumber: number;
	userStopSequenceNumber: number;
	isOutdated: boolean;
	isEndOfRouteForUser: boolean;
	stopTimes: StopTime[];
}

export interface StopTime {
	name: string;
	time: string;
}
