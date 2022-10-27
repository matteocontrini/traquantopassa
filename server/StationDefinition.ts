export default class StationDefinition {
    name: string;
    id: number;
    coordinates: number[];
    lastUpdatedAt?: Date;
    trainsCache: Train[] = [];

    constructor(name: string, id: number, coordinates: number[]) {
        this.name = name;
        this.id = id;
        this.coordinates = coordinates;
    }
}
