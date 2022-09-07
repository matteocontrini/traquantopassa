import { defineEventHandler } from 'h3';
import stopsMapping from '~/server/stopsMapping';

export default defineEventHandler(async (event) => {
    return Object.keys(stopsMapping).map((slug) => ({
        slug,
        name: stopsMapping[slug].name
    }));
});
