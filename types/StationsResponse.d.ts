declare interface StationsResponse {
    stationName: string;
    lastUpdatedAt: string;
    trains: Train[];
    busSlug: string | null;
}
