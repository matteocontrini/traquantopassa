declare interface StopResponse {
    coordinates: number[];
    stopName: string;
    lastUpdatedAt: string;
    trainSlug: string | null;
    directions: { name: string;  detailAvailable: boolean; trips: Trip[] }[];
}
