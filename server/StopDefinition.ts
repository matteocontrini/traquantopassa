export default class StopDefinition {
    stopId: number;
    name: string;
    limit: number;
    tripsCache: Trip[] = [];

    constructor(stopId: number, name: string, limit: number = 5) {
        this.stopId = stopId;
        this.name = name;
        this.limit = limit;
    }
}
