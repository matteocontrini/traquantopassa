import type { StopTime } from "./Trip";

export interface Train {
	carrier: string;
	category: string;
	icon: string | null;
	number: string;
	destination: string;
	time: string;
	platform: string;
	delay: string;
	isDelayed: boolean;
	isBlinking: boolean;
	isReplacedByBus: boolean;
	isIncomplete: boolean;
	notes: string;
	id: string;
	stopTimes: StopTime[];
}
