import Stop from '~/server/Stop';

export default class StopsGroup {
    name: string;
    lastUpdatedAt?: Date;
    stops: Stop[];

    constructor(name: string, stops: Stop[]) {
        this.name = name;
        this.stops = stops;
    }
}
