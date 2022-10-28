export default class StationDefinition {
    name: string;
    id: number;
    coordinates: number[];
    railway: string;
    lastUpdatedAt?: Date;
    trainsCache: Train[] = [];

    constructor(name: string, id: number, coordinates: number[], railway: string) {
        this.name = name;
        this.id = id;
        this.coordinates = coordinates;
        this.railway = railway;
    }
}
