import { createError, defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();

interface Trip {
    route: string;
    tripId: string;
    destination: string;
    direction: number;
    minutes: number;
    delay: number;
}

interface StopsGrouping {
    lastUpdatedAt: Date | null;
    stops: Stop[];
}

interface Stop {
    stopId: number;
    name: string;
    trips: Trip[];
}

const stopsMapping: { [key: string]: StopsGrouping } = {
    valoni: {
        lastUpdatedAt: null,
        stops: [
            {
                stopId: 150,
                name: '» Trento',
                trips: [],
            },
            {
                stopId: 149,
                name: '» Povo',
                trips: [],
            },
        ],
    },
};

async function getData(stopId: number) {
    const url = `${config.apiBaseUrl}/gtlservice/trips_new?limit=10&stopId=${stopId}&type=U`;
    console.log(`Requesting ${url}`);
    const resp = await fetch(url, {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${config.apiUsername}:${config.apiPassword}`).toString('base64'),
        },
    });
    return resp.json();
}

function parseTrips(data: any): Trip[] {
    return data.map((trip: any): Trip => {
        const expectedTime = new Date(trip['oraArrivoEffettivaAFermataSelezionata']);
        let minutes = Math.round((expectedTime.getTime() - Date.now()) / 1000 / 60);
        if (minutes < 0) {
            minutes = 0;
        }
        const endOfRouteStopId = trip['stopTimes'].at(-1)['stopId'];
        const nextStopId = trip['stopNext'];
        let delay;
        if (endOfRouteStopId == nextStopId) {
            // ^ use stopNext because sometimes the last stop is never reached
            delay = null;
        } else {
            delay = trip['delay'];
        }
        return {
            route: trip['routeId'],
            tripId: trip['tripId'],
            destination: trip['tripHeadsign'],
            direction: trip['directionId'],
            minutes,
            delay,
        };
    });
}

export default defineEventHandler(async (event) => {
    const stopSlug = event.context.params.stop;
    console.log('GET ' + event.req.url);

    const stopsGrouping = stopsMapping[stopSlug];

    if (!stopsGrouping) {
        throw createError({
            statusCode: 404,
            name: 'Not Found',
            statusMessage: 'Could not find stop',
        });
    }

    let directions: { name: string; trips: Trip[] }[] = [];

    if (stopsGrouping.lastUpdatedAt == null || Date.now() - stopsGrouping.lastUpdatedAt.getTime() > 1000 * 30) {
        const promises = stopsGrouping.stops.map((stop) => getData(stop.stopId));
        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i++) {
            let trips = parseTrips(results[i]);
            trips.sort((a, b) => a.minutes - b.minutes);
            trips = trips.slice(0, 5);
            directions.push({
                name: stopsGrouping.stops[i].name,
                trips,
            });
            stopsGrouping.stops[i].trips = trips;
        }
        stopsGrouping.lastUpdatedAt = new Date();
    } else {
        for (let i = 0; i < stopsGrouping.stops.length; i++) {
            const stop = stopsGrouping.stops[i];
            directions.push({
                name: stop.name,
                trips: stop.trips,
            });
        }
    }

    return {
        stopName: 'Povo via Valoni',
        lastUpdatedAt: stopsGrouping.lastUpdatedAt,
        directions,
    };
});
