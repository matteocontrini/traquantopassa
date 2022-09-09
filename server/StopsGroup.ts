import StopDefinition from '~/server/StopDefinition';

export default class StopsGroup {
    name: string;
    lastUpdatedAt?: Date;
    stops: StopDefinition[];
    coordinates: number[];

    constructor(name: string, stops: StopDefinition[], coordinates: number[]) {
        this.name = name;
        this.stops = stops;
        this.coordinates = coordinates;
    }
}
