import { defineEventHandler } from 'h3';
import stations from '~/server/stations';

export default defineEventHandler(async (event) => {
    return Object.keys(stations).map<Station>((slug) => {
        let s = stations[slug];
        return {
            slug,
            name: s.name,
            coordinates: s.coordinates,
            railway: s.railway,
        } as Station;
    });
});
