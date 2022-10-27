import axios from 'axios';
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

async function getData(station: StationDefinition) {
    const resp = await client.get('/ArriviPartenze/ArrivalsDepartures/Monitor', {
        params: {
            placeId: station.id,
            arrivals: false,
        },
    });

    // TODO: handle response errors

    const $ = cheerio.load(resp.data);

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

        const platform = cells.eq(6).text().trim();

        const isBlinking = cells.eq(7).find('img').length > 0;

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
        });
    });

    return trains;
}

function capitalize(str: string): string {
    return str
        .toLowerCase()
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
        station.trainsCache = await getData(station);
        station.lastUpdatedAt = new Date();
    }

    return {
        stationName: station.name,
        lastUpdatedAt: station.lastUpdatedAt,
        trains: station.trainsCache.slice(0, LIMIT),
    } as StationsResponse;
});
