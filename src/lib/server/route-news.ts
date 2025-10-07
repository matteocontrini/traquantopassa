import * as api from '$lib/server/trentino-trasporti-api';
import NodeCache from 'node-cache';
import type { RouteNews, News, RouteFe } from '$lib/RouteNews';
import { mapRouteColor, mapRouteLightBG } from './routes-service';

const cache = new NodeCache({
	stdTTL: 24 * 60 * 60 // 24 hours
});

const routeNewsCacheKey = 'route-news';

export async function routeNews() {
	// Return from cache if available
	const cached = cache.get<RouteNews[]>(routeNewsCacheKey);

	if (cached) {
		return cached;
	}

	const routeNews: RouteNews[] = [];

	// Fetch stops from the API
	const apiStops = await api.getRoutes();

	// Group stops by name
	for (const apiStop of apiStops) {
		if (!apiStop.news.length) continue;

		apiStop.news.forEach((news) => {
			const newsId = news.idFeed;
			const newsInfo = newsCreate(news, apiStops);

			news.routeIds.split(',').forEach((routeId: string) => {
				const routeIdInt = parseInt(routeId, 10);

				const routeExisting = routeNews.find((el) => el.route === routeIdInt);

				if (routeExisting) {
					const newsExisiting = routeExisting.news.find((el) => el.id == newsId);

					if (!newsExisiting) routeExisting.news.push(newsInfo);
				} else {
					const newsNew: RouteNews = {
						route: routeIdInt,
						news: [newsInfo]
					};

					routeNews.push(newsNew);
				}
			});
		});
	}

	cache.set(routeNewsCacheKey, routeNews);

	return routeNews;
}

export async function getRouteNews(routes: Set<number>) {
	const routeNewsList = await routeNews();

	const uniqueNews: Map<number, News> = new Map();

	routes.forEach((route) => {
		const routeEl = routeNewsList.find((el) => {
			return route === el.route;
		});

		if (!routeEl) return;

		routeEl.news.forEach((news) => {
			if (uniqueNews.has(news.id)) return;

			uniqueNews.set(news.id, news);
		});
	});

	return Array.from(uniqueNews.values());
}

function newsCreate(data: api.ApiNews, apiStop: api.ApiRoute[]): News {
	const routes: RouteFe[] = data.routeIds.split(',').map((el) => {
		const routeInfo = apiStop.find((apiEl) => apiEl.routeId === parseInt(el, 10)) as api.ApiRoute;

		return {
			name: routeInfo.routeShortName,
			colorBG: mapRouteColor(routeInfo),
			colorTxt: mapRouteLightBG(routeInfo.routeShortName)
		};
	});

	return {
		title: data.header,
		details: data.details,
		id: data.idFeed,
		startDate: new Date(data.startDate),
		endDate: new Date(data.endDate),
		url: data.url,
		routes
	};
}
