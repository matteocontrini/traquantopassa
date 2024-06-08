import { asSitemapUrl, defineSitemapEventHandler } from '#imports';

export default defineSitemapEventHandler(async () => {
    let stops: { slug: string }[] = await $fetch('/api/stops');
    let stations: { slug: string }[] = await $fetch('/api/stations');

    let stopsPaths = stops.map((stop) => `/${stop.slug}`);
    let stationsPaths = stations.map((station) => `/treni/${station.slug}`);

    const paths = stopsPaths.concat(stationsPaths);

    return paths.map((path) =>
        asSitemapUrl({
            loc: path,
            _sitemap: 'pages',
        })
    );
});
