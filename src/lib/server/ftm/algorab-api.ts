import * as logger from '$lib/logger';
import { elapsed } from '$lib/server/time-helpers';

export interface AlgorabTrain {
    trainId: number;
    trainNumber: number;
    currentDelay: number;
    position: number;
}

export interface AlgorabTime {
    c_train: number;
    c_stop: number;
    i_hours: string;
    i_minutes: string;
}

const TIMEOUT = 6 * 1000;

export async function getTrains(): Promise<AlgorabTrain[]> {
    logger.info(`Fetching FTM trains`);
    const start = performance.now();

    const res = await fetch(
        'http://trainview.algorab.net/Tdati.ashx',
        {
            signal: AbortSignal.timeout(TIMEOUT)
        }
    );
    const trains: AlgorabTrain[] = (await res.json()).treni;
    logger.info(`Fetched FTM trains ${elapsed(start)} ms`);

    return trains;
}

export async function getTrainTimes(): Promise<AlgorabTime[]> {
    logger.info(`Fetching FTM timetable`);
    const start = performance.now();

    const res = await fetch(
        'http://trainview.algorab.net/Ddati.ashx',
        {
            signal: AbortSignal.timeout(TIMEOUT)
        }
    );
    const times: AlgorabTime[] = (await res.json()).orari;

    logger.info(`Fetched FTM timetable ${elapsed(start)} ms`);

    return times
}