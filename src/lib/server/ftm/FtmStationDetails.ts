import type { StopConnections } from '../stops-stations-mapping';
import type { FtmTrain } from './FtmTrain';

export default interface FtmStationDetails {
	id: string;
	name: string;
	canonicalSlug: string;
	position: number;
	lastUpdatedAt: Date;
	trains: FtmTrain[];
	stopMapping?: StopConnections;
}
