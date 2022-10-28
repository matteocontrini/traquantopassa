import StopDefinition from '~/server/StopDefinition';

export default class StopsGroup {
    name: string;
    lastUpdatedAt?: Date;
    stops: StopDefinition[];
    coordinates: number[];
    trainSlug: string | null;

    constructor(name: string, stops: StopDefinition[], coordinates: number[], trainSlug?: string) {
        this.name = name;
        this.stops = stops;
        this.coordinates = coordinates;
        this.trainSlug = trainSlug || null;
    }
}
