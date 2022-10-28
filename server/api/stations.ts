import { defineEventHandler } from 'h3';
import stopsMapping from '~/server/stopsMapping';
import stations from '~/server/stations';
import StationDefinition from '~/server/StationDefinition';
import Station from '~/server/api/stations/[station]';

export default defineEventHandler(async (event) => {
    return Object.keys(stations).map<Station>((slug) => {
        let s = stations[slug];
        return {
            slug,
            name: s.name,
            coordinates: s.coordinates,
        };
    });
});
