declare interface StationsResponse {
    coordinates: number[];
    stationName: string;
    lastUpdatedAt: string;
    trains: Train[];
    busSlug: string | null;
}
