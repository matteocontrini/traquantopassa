import axios from 'axios';
import { apiAuthHeader, apiBaseUrl } from '~/server/config';
import axiosRetry from 'axios-retry';

interface Route {
    color: string;
    name: string;
}

let routes: { [key: string]: Route };

const client = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10000,
    headers: {
        Authorization: apiAuthHeader,
    },
});

axiosRetry(client, {
    retries: 5,
    retryDelay: axiosRetry.exponentialDelay,
});

async function getData() {
    const path = '/gtlservice/routes?areas=23';
    console.log(`Requesting ${path}`);
    let start = Date.now();
    const resp = await client.get(path);
    console.log(`Loaded routes in ${Date.now() - start} ms`);
    return resp.data;
}

async function loadRoutes() {
    console.log('Loading routes...');
    const data = await getData();
    routes = {};
    for (const route of data) {
        routes[route['routeId']] = {
            color: route['routeColor'] ? '#' + route['routeColor'] : fixRouteColor(route['routeShortName']),
            name: route['routeShortName'],
        };
    }
}

function fixRouteColor(routeShortName: string) {
    if (routeShortName === '5/') {
        return '#F5C500';
    }
    return '#000000';
}

function getRoute(routeId: string): Route {
    return routes[routeId];
}

export { getRoute, loadRoutes };
