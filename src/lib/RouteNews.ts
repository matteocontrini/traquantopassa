export interface News {
	id: number;
	title: string;
	details: string;
	startDate: Date;
	endDate: Date;
	url: string;
}

export interface RouteNews {
	route: number;
	news: News[];
}
