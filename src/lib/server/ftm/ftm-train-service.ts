import NodeCache from "node-cache";
import { getTrains, getTrainTimes, type AlgorabTime, type AlgorabTrain } from "./algorab-api";
import ftmStationsList from "./ftm-stations-list";
import type { FtmStopTime, FtmTrain } from "$lib/server/ftm/FtmTrain";
import { getTripsForRoute } from "../trentino-trasporti-api";
import CachedItem from "../CachedItem";
import type { FtmStation } from "./FtmStation";

// Different format than the output one, as this needs to be further processed
interface CachedTrain {
    number: string | null;
    id: string;
    destination: string;
    direction: 'Trento' | 'Malé';
    currentStopSequenceNumber: number;
    position: number | null;
    delay: number | null;
    stopTimes: {
        time: string;
        station?: FtmStation; // in case a new station gets built this should stop it from crashing
    }[];
}

const FTM_ROUTE_ID = "352"
const CACHE_DURATION = 29 // seconds
const SCEHDEULED_TRAIN_CACHE_DURATION = 60 * 60 // 1 hour
const SCEHDEULED_TRAIN_CACHE_KEY = "ftm-scheduled-trains"
const TRAINS_CACHE_KEY = 'ftm-trains'

const cache = new NodeCache();
const stationsCahe = new NodeCache({
    stdTTL: CACHE_DURATION
});


// Sometimes trains are are stuck at .1km from the final station and accumulate delay until it's turned around.
function isNotStuck(train: CachedTrain) {
    if (train.delay == null || train.position == null || train.stopTimes.length > 1) {
        return true;
    }

    const finalStation = train.stopTimes[0].station;

    // The delay check is needed so the train is not deleted before its scheduled arrival time
    return !(train.delay > 2 &&
        finalStation?.position &&
        Math.abs(finalStation.position - train.position) < 500);
}

export async function getFtmTrains(): Promise<CachedItem<CachedTrain[]>> {
    let trains: CachedItem<CachedTrain[]> | undefined = cache.get(TRAINS_CACHE_KEY);
    if (trains) {
        return trains;
    }

    const rtTrains = mapRealTimeTrains(await getTrains(), await getTrainTimes())
        .filter(isNotStuck);

    let scheduledTrains = await getScheduledTrains();
    // remove scheduled trains that have actually departed 
    // by checking the destination is the same and the scheduled arrival time is also the same
    scheduledTrains = scheduledTrains.filter(train => {
        const realtime = rtTrains.find(rtTrain =>
            train.destination == rtTrain.destination &&
            train.stopTimes.at(-1)?.time == rtTrain.stopTimes.at(-1)?.time
        )
        if (realtime) {
            // replace the id of the algorab train with the one from the scheduled train
            // this is done to make the transition more seamless between scheduled and live trains 
            realtime.id = train.id;

            // use the scheduled stops so we also get all the stops before the current train position, like for busses
            // if we are unable to find it, live algorab trains will always be displayed just without the previous stops
            realtime.currentStopSequenceNumber = train.stopTimes.length - realtime.stopTimes.length;
            realtime.stopTimes = train.stopTimes;
            return false;
        }
        return true;
    });

    trains = new CachedItem(rtTrains.concat(scheduledTrains));

    // Since stations data is also erase the cache to avoid using stale data
    stationsCahe.flushAll()

    cache.set(TRAINS_CACHE_KEY, trains, CACHE_DURATION);
    return trains;
}

function mapRealTimeTrains(trains: AlgorabTrain[], times: AlgorabTime[]): CachedTrain[] {
    return trains.map(train => {
        const trainId = train.trainId.toString();
        const direction = train.trainNumber % 2 ? 'Trento' : 'Malé';

        const stopTimes = times
            .filter(stopTime => stopTime.c_train.toString() == trainId)
            .map(stopTime => ({
                // time information from Algorab is time-shifted server side by the delay, we undo this to show the scheduled time 
                time: adjustTime(stopTime.i_hours, stopTime.i_minutes, train.currentDelay),
                station: ftmStationsList.find(station => station.algorabId == stopTime.c_stop.toString()),
            }));

        return {
            id: trainId,
            number: train.trainNumber.toString(),
            direction,
            // Since the trains will only have future stopTimes, the current sequence number is always 0
            currentStopSequenceNumber: 0,
            position: train.position,
            delay: train.currentDelay,
            destination: stopTimes.at(-1)?.station?.name || direction,
            stopTimes
        } satisfies CachedTrain;
    });
}

async function getScheduledTrains(): Promise<CachedTrain[]> {
    let trains: CachedTrain[] | undefined = cache.get(SCEHDEULED_TRAIN_CACHE_KEY);
    if (trains) {
        return trains;
    }

    const trips = await getTripsForRoute(FTM_ROUTE_ID, 100);
    trains = trips
        .map(train => {
            const stopTimes = train.stopTimes
                .map(stopTime => ({
                    // Time is returned with seconds that are always :00 so we omit them
                    time: stopTime.arrivalTime.substring(0, 5),
                    station: ftmStationsList.find(station => station.stopId == stopTime.stopId.toString())
                }));

            return {
                id: train.tripId,
                number: null,
                // Since all trains going towards Malé start from Trento we can do this
                // This is only used to show the direction icon, not the actual display destination
                direction: stopTimes[0].station?.stopId == '2426' ? 'Malé' : 'Trento',
                currentStopSequenceNumber: 0,
                position: null,
                delay: null,
                destination: stopTimes.at(-1)?.station?.name || train.tripHeadsign, // normalize train destination with custom station names for consistency
                stopTimes
            } satisfies CachedTrain;
        });

    // scheduled trains don't change, we can use a longer cache duration, since there's no trains at midnight so it won't cause issues
    cache.set(SCEHDEULED_TRAIN_CACHE_KEY, trains, SCEHDEULED_TRAIN_CACHE_DURATION);
    return trains;
}


export function getStationBySlug(slug: string) {
    return ftmStationsList.find(station => station.slug === slug);
}

export async function getTrainsForStation(stationId: string) {
    const cacheKey = `ftm-${stationId}`;
    let cachedItem: CachedItem<FtmTrain[]> | undefined = stationsCahe.get(cacheKey);

    if (cachedItem) {
        return cachedItem;
    }

    const currentTime = formatTime(new Date());

    const stationTrains: FtmTrain[] = []

    const cachedTrains = await getFtmTrains();

    for (const train of cachedTrains.value) {
        const userStopSequenceNumber = train.stopTimes.findIndex((stopTime) => stopTime.station?.stopId === stationId);
        // ignore trains that don't stop here or have been passed already
        if (userStopSequenceNumber == -1 || train.currentStopSequenceNumber > userStopSequenceNumber) {
            continue;
        }

        const currentStopTime = train.stopTimes[userStopSequenceNumber];
        // if no real-time is available, filter trains that are in the past
        if (train.delay == null && currentStopTime.time < currentTime) {
            continue;
        }

        stationTrains.push({
            id: train.id,
            number: train.number,
            direction: train.direction,
            isEndOfRouteForUser: currentStopTime === train.stopTimes.at(-1),
            time: currentStopTime.time,
            currentStopSequenceNumber: train.currentStopSequenceNumber,
            userStopSequenceNumber,
            position: train.position,
            delay: train.delay,
            destination: train.destination,
            // remap to reduce the amount of info sent to the client
            stopTimes: train.stopTimes.map(stop => ({
                time: stop.time,
                name: stop.station?.name || '',
                requestOnly: stop.station?.requestOnly || false,
            } satisfies FtmStopTime)),
            isBlinking: isDeaprting(currentStopTime.time, currentTime, train.delay)
        } satisfies FtmTrain);
    }

    stationTrains.sort((a, b) => a.time > b.time ? 1 : -1);
    cachedItem = {
        value: stationTrains,
        cachedAt: cachedTrains.cachedAt // use the cached trains date instead of the current time
    } satisfies CachedItem<FtmTrain[]>

    stationsCahe.set(cacheKey, cachedItem);
    return cachedItem;
}


function isDeaprting(depatureTime: string, currentTime: string, delay: number | null) {
    // If no real time data is available, do not show departing animation
    if (delay == null) {
        return false;
    }
    let [hours, mins] = depatureTime.split(':').map(Number);
    const departureMinutes = hours * 60 + mins + delay;

    [hours, mins] = currentTime.split(':').map(Number);
    const currentMinutes = hours * 60 + mins;

    return (departureMinutes - currentMinutes) < 2;
}


function adjustTime(hours: string, minutes: string, delay: number): string {
    if (delay == 0) {
        return `${hours}:${minutes}`;
    }

    const date = new Date();
    date.setHours(+hours, +minutes - delay, 0, 0);
    return formatTime(date);
}

function formatTime(date: Date) {
    const newHours = date.getHours().toString().padStart(2, '0');
    const newMins = date.getMinutes().toString().padStart(2, '0');

    return `${newHours}:${newMins}`;
}