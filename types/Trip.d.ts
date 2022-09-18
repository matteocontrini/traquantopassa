declare interface Trip {
    routeName: string;
    routeColor: string;
    tripId: string;
    destination: string;
    direction: number;
    minutes: number;
    delay: number;
    expectedTime: Date;
    scheduledTime: Date;
    distanceInStops: number | null;
    isOutdated: boolean;
}
