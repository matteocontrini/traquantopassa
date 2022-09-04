declare interface StopResponse {
    stopName: string;
    lastUpdatedAt: string;
    directions: { name: string; trips: Trip[] }[];
}
