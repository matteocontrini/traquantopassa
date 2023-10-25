import { defineEventHandler } from 'h3';
import { getIsLoaded, getAllRoutes } from '../routes';

export default defineEventHandler(async (event) => {
    if(!getIsLoaded()) {
        return [];
    }
    return getAllRoutes();
});