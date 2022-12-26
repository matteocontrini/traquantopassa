import axios from 'axios';
import { apiAuthHeader, apiBaseUrl } from '~/server/config';
import axiosRetry from 'axios-retry';

let routes: { [routeId: string]: Route };
let stopRoutes: { [stopId: number]: Route[] };
let isLoaded = false;

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

async function getRoutesData() {
    const path = '/gtlservice/routes?areas=23';
    console.log(`Requesting ${path}`);
    let start = Date.now();
    const resp = await client.get(path);
    console.log(`Loaded routes in ${Date.now() - start} ms`);
    return resp.data;
}

async function getStopsData() {
    const path = '/gtlservice/stops?type=U';
    console.log(`Requesting ${path}`);
    let start = Date.now();
    const resp = await client.get(path);
    console.log(`Loaded stops in ${Date.now() - start} ms`);
    return resp.data;
}

async function load() {
    console.log('Loading routes...');
    const data = await getRoutesData();
    routes = {};
    for (const route of data) {
        routes[route['routeId']] = {
            color: route['routeColor'] ? '#' + route['routeColor'] : fixRouteColor(route['routeShortName']),
            name: route['routeShortName'],
        };
    }

    console.log('Loading stops...');
    const stopsData = await getStopsData();
    stopRoutes = {};
    for (const stop of stopsData) {
        const stopId: number = stop['stopId'];
        stopRoutes[stopId] = stop['routes'].map((route: any) => routes[route['routeId']]);
    }

    isLoaded = true;
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

function getRoutesForStop(stopId: number): Route[] {
    return stopRoutes[stopId];
}

function getIsLoaded() {
    return isLoaded;
}

export { load, getRoute, getRoutesForStop, getIsLoaded };
