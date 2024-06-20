import type { Station } from '$lib/Station';

function station(id: number, slug: string, name: string, coordinates: number[], railways: string[]): Station {
	return {
		id: id.toString(),
		slug,
		name,
		coordinates: {
			latitude: coordinates[0],
			longitude: coordinates[1]
		},
		railways
	};
}

const railwayBrennero = ['Ferrovia del Brennero'];
const railwayValsugana = ['Ferrovia della Valsugana'];

export default [
	// Ferrovia del Brennero
	station(
		2912,
		'stazione',
		'Trento FS',
		[46.07224810063012, 11.119214853916196],
		railwayBrennero.concat(railwayValsugana)
	),
	station(
		685,
		'bolzano',
		'Bolzano',
		[46.49656316506866, 11.358614859132068],
		railwayBrennero
	),
	station(
		1943,
		'ora',
		'Ora',
		[46.36092426682081, 11.296871287421304],
		railwayBrennero
	),
	station(
		1706,
		'mezzocorona',
		'Mezzocorona',
		[46.20737958555397, 11.128475265479477],
		railwayBrennero
	),
	station(
		1545,
		'lavis',
		'Lavis',
		[46.14823475150998, 11.096274994470582],
		railwayBrennero
	),
	station(
		2440,
		'rovereto',
		'Rovereto',
		[45.89109383031191, 11.033940587207475],
		railwayBrennero
	),
	station(
		694,
		'borghetto',
		'Borghetto sull\'Adige',
		[45.696764321073516, 10.92708582463834],
		railwayBrennero
	),
	station(
		2090,
		'peri',
		'Peri',
		[45.65836167420163, 10.90041257467049],
		railwayBrennero
	),
	station(
		1252,
		'domegliara',
		'Domegliara-Sant\'Ambrogio',
		[45.52238953600898, 10.820587113472024],
		railwayBrennero
	),
	station(
		3025,
		'verona',
		'Verona Porta Nuova',
		[45.42845269880447, 10.982008923610254],
		railwayBrennero
	),


	// Ferrovia della Valsugana
	station(
		4030,
		'santachiara',
		'Trento S. Chiara',
		[46.05413549349008, 11.135663623408977],
		railwayValsugana
	),
	station(
		4079,
		'sanbartolameo',
		'Trento S. Bartolameo',
		[46.04760529365945, 11.135257245851609],
		railwayValsugana
	),
	station(
		3106,
		'villazzano',
		'Villazzano',
		[46.04592632342654, 11.139324479257006],
		railwayValsugana
	),
	station(
		2270,
		'povomesiano',
		'Povo-Mesiano',
		[46.06535630630152, 11.14263561042483],
		railwayValsugana
	),
	station(
		2088,
		'pergine',
		'Pergine Valsugana',
		[46.0627963, 11.2323359],
		railwayValsugana
	),
	station(
		803,
		'caldonazzo',
		'Caldonazzo',
		[45.99747507490504, 11.26455984902087],
		railwayValsugana
	),
	station(
		1568,
		'levicoterme',
		'Levico Terme',
		[46.005760868708784, 11.30499111417164],
		railwayValsugana
	),
	station(
		3503,
		'borgoest',
		'Borgo Valsugana Est',
		[46.0523749376969, 11.463952179084858],
		railwayValsugana
	),
	station(
		1463,
		'grigno',
		'Grigno',
		[46.015132389836545, 11.624921009185599],
		railwayValsugana
	),
	station(
		2795,
		'strigno',
		'Strigno',
		[46.05119734847815, 11.514409175358631],
		railwayValsugana
	),
	station(
		2292,
		'primolano',
		'Primolano',
		[45.9654632157231, 11.700971759327679],
		railwayValsugana
	),
	station(
		1112,
		'cismondelgrappa',
		'Cismon del Grappa',
		[45.91962872949797, 11.729705735866421],
		railwayValsugana
	),
	station(
		911,
		'carpanevalstagna',
		'Carpanè-Valstagna',
		[45.86016708056311, 11.66111335438478],
		railwayValsugana
	),
	station(
		602,
		'bassano',
		'Bassano del Grappa',
		[45.7666368664187, 11.741322752385827],
		railwayValsugana
	)
] satisfies Station[] as Station[];
