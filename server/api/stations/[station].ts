import axios, { AxiosResponse } from 'axios';
import { createError, defineEventHandler } from 'h3';
import * as cheerio from 'cheerio';
import StationDefinition from '~/server/StationDefinition';
import stations from '~/server/stations';

const CACHE_DURATION = 1000 * 30;
const LIMIT = 20;

const client = axios.create({
    baseURL: 'https://iechub.rfi.it',
    timeout: 6000,
    transitional: {
        clarifyTimeoutError: true,
    },
});

async function getHtml(stationId: number) {
    let start = Date.now();

    try {
        const resp = await client.get('/ArriviPartenze/ArrivalsDepartures/Monitor', {
            params: {
                placeId: stationId,
                arrivals: false,
            },
        });
        console.log(`Loaded RFI ${stationId} in ${Date.now() - start} ms`);
        return resp.data;
    } catch (err) {
        const elapsed = Date.now() - start;
        if (axios.isAxiosError(err)) {
            if (err.response) {
                const resp = err.response as AxiosResponse;
                console.error(
                    `Error while fetching RFI ${stationId} after ${elapsed} ms: ${resp.status} ${resp.statusText}`
                );
            } else if (err.code == 'ETIMEDOUT') {
                console.error(`Error (timeout) while fetching RFI ${stationId} after ${elapsed} ms`);
            } else {
                console.error(`Error while fetching RFI ${stationId} after ${elapsed} ms: ${err.message}`);
            }

            throw createError({
                statusCode: 503,
                name: 'Service Unavailable',
                message: 'The service is temporarily unavailable',
            });
        }

        console.error(`Error while fetching RFI ${stationId} after ${elapsed} ms`);

        throw err;
    }
}

function parseTrains(html: string): Train[] {
    const $ = cheerio.load(html);

    const trains: Train[] = [];

    $('tbody tr').each((i, elem) => {
        const cells = $('td', elem);

        let carrier = cells.eq(0).find('img').attr('alt');
        if (!carrier) {
            return;
        }
        carrier = capitalize(carrier);

        let category = cells.eq(1).find('img').attr('alt') ?? '';
        category = category.replace('Categoria ', '');
        category = fixCategory(category);
        category = capitalize(category);

        const icon = categoryToIcon(category);

        const number = cells.eq(2).text().trim();

        let destination = cells.eq(3).text().trim();
        destination = capitalize(destination);

        const time = cells.eq(4).text().trim();

        let delay = cells.eq(5).text().trim();
        let isDelayed = false;
        if (/^[0-9]+$/.test(delay)) {
            delay = `+${delay}'`;
            isDelayed = true;
        }

        let platform = cells.eq(6).text().trim();

        const isBlinking = cells.eq(7).find('img').length > 0;

        const notes = cells.eq(8).text().trim();

        let isReplacedByBus = false;
        // If the train is marked as cancelled, look if it's replaced by a bus.
        // Note: sometimes the train is marked as replaced by bus even if it's actually not at the current station
        // (it could be in previous stations), hence the "cancelled" check, which tells us if it's actually a train.
        if (icon != 'bus' && delay == 'Cancellato') {
            isReplacedByBus =
                notes.toLowerCase().includes('autosostituito') || notes.toLowerCase().includes('bus sostitutivo');
        }

        // Hide platform if it's "punto fermata" (bus) or if the train is replaced by bus (platform doesn't matter anymore)
        if (platform == 'PF' || isReplacedByBus) {
            platform = '';
        }

        const isIncomplete = delay == 'Cancellato' && notes == '';

        trains.push({
            carrier,
            category,
            icon,
            number,
            destination,
            time,
            platform,
            delay,
            isDelayed,
            isBlinking,
            isReplacedByBus,
            isIncomplete,
        });
    });

    return trains;
}

function capitalize(str: string): string {
    return str
        .toLowerCase()
        .replace(/\.(\w)/g, '. $1') // e.g. "VENEZIA S.LUCIA" -> "VENEZIA S. LUCIA"
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
        .join(' ');
}

function categoryToIcon(category: string): string | null {
    category = category.toLowerCase();
    if (category.includes('autocorsa')) {
        return 'bus';
    } else if (category.includes('regionale veloce')) {
        return 'rv';
    } else if (category.includes('regionale')) {
        return 'r';
    } else if (category.includes('eurocity')) {
        return 'ec';
    } else if (category.includes('alta velocità')) {
        return 'av';
    } else if (category.includes('intercity')) {
        return 'ic';
    } else if (category.includes('intercity notte')) {
        return 'icn';
    }

    return null;
}

function fixCategory(category: string): string {
    // AV has "ITALO" as the alt text
    category = category.replace(/italo/i, 'Alta Velocità');
    // Regionale Veloce is called "Civitavecchia Express Regionale Veloce"
    category = category.replace(/civitavecchia express/i, '').trim();
    return category;
}

export default defineEventHandler(async (event) => {
    const stationSlug = event.context.params.station;
    const station: StationDefinition = stations[stationSlug];

    if (!station) {
        throw createError({
            statusCode: 404,
            name: 'Not Found',
            statusMessage: 'Could not find station',
        });
    }

    if (!station.lastUpdatedAt || Date.now() - station.lastUpdatedAt.getTime() > CACHE_DURATION) {
        const html = await getHtml(station.id);
        station.trainsCache = parseTrains(html);
        station.lastUpdatedAt = new Date();
    }

    return {
        coordinates: station.coordinates,
        stationName: station.name,
        lastUpdatedAt: station.lastUpdatedAt.toISOString(),
        trains: station.trainsCache.slice(0, LIMIT),
        busSlug: station.busSlug,
    } as StationsResponse;
});
