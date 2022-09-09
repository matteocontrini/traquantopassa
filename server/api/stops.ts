import { defineEventHandler } from 'h3';
import stopsMapping from '~/server/stopsMapping';

export default defineEventHandler(async (event) => {
    return Object.keys(stopsMapping).map<Stop>((slug) => {
        let s = stopsMapping[slug];
        return {
            slug,
            name: s.name,
            coordinates: s.coordinates,
        };
    });
});
