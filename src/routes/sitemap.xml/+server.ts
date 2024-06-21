import * as stopsService from '$lib/server/stops-service';
import * as stationsService from '$lib/server/stations-service';

const BASE_URL = 'https://traquantopassa.in';

export async function GET() {
	let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>${BASE_URL}/</loc></url>
	<url><loc>${BASE_URL}/treni</loc></url>
	<url><loc>${BASE_URL}/info</loc></url>
	<url><loc>${BASE_URL}/aiuto</loc></url>
`;

	const stops = await stopsService.getStopGroups();

	for (const stop of stops) {
		xml += `	<url><loc>${BASE_URL}/${stop.slugs[0]}</loc></url>
`;
	}

	const stations = stationsService.getStations();
	for (const station of stations) {
		xml += `	<url><loc>${BASE_URL}/treni/${station.slug}</loc></url>
`;
	}

	xml += `</urlset>`;

	return new Response(
		xml,
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=3600'
			}
		}
	);
}
