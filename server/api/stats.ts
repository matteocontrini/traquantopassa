import { defineEventHandler } from 'h3';
import axios from 'axios';
import * as config from '~/server/config';

const statsCache = {
    count: 0,
    lastUpdate: 0,
};

const cacheTime = 10 * 60 * 1000;

export default defineEventHandler(async (event) => {
    if (!config.goatcounterToken) {
        return {
            count: 0,
        };
    }

    if (statsCache.lastUpdate && Date.now() - statsCache.lastUpdate < cacheTime) {
        return {
            count: statsCache.count,
        };
    }

    console.log('Updating stats...');

    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let resp = await axios.get('https://traquantopassa.goatcounter.com/api/v0/stats/total', {
        headers: {
            Authorization: 'Bearer ' + config.goatcounterToken,
        },
        params: {
            start: today.toISOString(),
        },
    });

    statsCache.count = resp.data.total_utc;
    statsCache.lastUpdate = Date.now();

    return {
        count: statsCache.count,
    };
});
