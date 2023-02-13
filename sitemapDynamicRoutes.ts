export default async (): Promise<string[]> => {
    let stops: { slug: string }[] = await $fetch('/api/stops');
    let stations: { slug: string }[] = await $fetch('/api/stations');

    let stopsPaths = stops.map((stop) => `/${stop.slug}`);
    let stationsPaths = stations.map((station) => `/treni/${station.slug}`);

    return stopsPaths.concat(stationsPaths);
};
