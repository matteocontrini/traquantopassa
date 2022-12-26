import { createError, defineEventHandler } from 'h3';
import StopsGroup from '~/server/StopsGroup';
import stopsMapping from '~/server/stopsMapping';

export default defineEventHandler(async (event) => {
    const stopSlug = event.context.params.stop;
    const stopsGroup: StopsGroup = stopsMapping[stopSlug];

    if (!stopsGroup) {
        throw createError({
            statusCode: 404,
            name: 'Not Found',
            statusMessage: 'Could not find stop',
        });
    }

    return {
        stopName: stopsGroup.name,
        trainSlug: stopsGroup.trainSlug,
    } as StopInfoResponse;
});
