declare interface StopResponse {
    stopName: string;
    lastUpdatedAt: string;
    trainSlug: string | null;
    directions: { name: string; trips: Trip[] }[];
}
