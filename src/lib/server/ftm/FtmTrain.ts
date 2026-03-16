import type { StopTime } from "../../Trip";

export interface FtmStopTime extends StopTime {
	requestOnly: boolean;
}

export interface FtmTrain {
	number: string | null;
	id: string;
	isEndOfRouteForUser: boolean;
	currentStopSequenceNumber: number;
	userStopSequenceNumber: number;
	time: string;
	destination: string;
	direction:  'Trento' | 'Malé';
	position: number | null;
	delay: number | null;
	isBlinking: boolean;
	stopTimes: FtmStopTime[];
}
