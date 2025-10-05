export interface RouteFe {
	name: string;
	color: string;
}

export interface News {
	id: number;
	title: string;
	details: string;
	startDate: Date;
	endDate: Date;
	url: string;
	routes: RouteFe[]
}

export interface RouteNews {
	route: number;
	news: News[];
}
