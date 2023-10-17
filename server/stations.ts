import StationDefinition from '~/server/StationDefinition';

/* prettier-ignore */
const stations: { [key: string]: StationDefinition } = {
    // Ferrovia del Brennero
    trentofs: new StationDefinition(
        'Trento FS',
        2912,
        [46.07224810063012, 11.119214853916196],
        'Ferrovia del Brennero/Valsugana',
        'stazione',
    ),
    bolzano: new StationDefinition(
        'Bolzano',
        685,
        [46.49656316506866, 11.358614859132068],
        'Ferrovia del Brennero',
    ),
    ora: new StationDefinition(
        'Ora',
        1943,
        [46.36092426682081, 11.296871287421304],
        'Ferrovia del Brennero',
    ),
    mezzocorona: new StationDefinition(
        'Mezzocorona',
        1706,
        [46.20737958555397, 11.128475265479477],
        'Ferrovia del Brennero',
    ),
    lavis: new StationDefinition(
        'Lavis',
        1545,
        [46.14823475150998, 11.096274994470582],
        'Ferrovia del Brennero',
    ),
    rovereto: new StationDefinition(
        'Rovereto',
        2440,
        [45.89109383031191, 11.033940587207475],
        'Ferrovia del Brennero',
    ),
    borghetto: new StationDefinition(
        'Borghetto sull\'Adige',
        694,
        [45.696764321073516, 10.92708582463834],
        'Ferrovia del Brennero',
    ),
    peri: new StationDefinition(
        'Peri',
        2090,
        [45.65836167420163, 10.90041257467049],
        'Ferrovia del Brennero',
    ),
    domegliara: new StationDefinition(
        'Domegliara-Sant\'Ambrogio',
        1252,
        [45.52238953600898, 10.820587113472024],
        'Ferrovia del Brennero',
    ),
    verona: new StationDefinition(
        'Verona Porta Nuova',
        3025,
        [45.42845269880447, 10.982008923610254],
        'Ferrovia del Brennero',
    ),


    // Ferrovia della Valsugana
    santachiara: new StationDefinition(
        'Trento S. Chiara',
        4030,
        [46.05413549349008, 11.135663623408977],
        'Ferrovia della Valsugana',
    ),
    sanbartolameo: new StationDefinition(
        'Trento S. Bartolameo',
        4079,
        [46.04760529365945, 11.135257245851609],
        'Ferrovia della Valsugana',
    ),
    villazzano: new StationDefinition(
        'Villazzano',
        3106,
        [46.04592632342654, 11.139324479257006],
        'Ferrovia della Valsugana',
    ),
    povomesiano: new StationDefinition(
        'Povo-Mesiano',
        2270,
        [46.06535630630152, 11.14263561042483],
        'Ferrovia della Valsugana',
        'mesianofs'
    ),
    pergine: new StationDefinition(
        'Pergine Valsugana',
        2088,
        [46.0627963, 11.2323359],
        'Ferrovia della Valsugana',
    ),
    caldonazzo: new StationDefinition(
        'Caldonazzo',
        803,
        [45.99747507490504, 11.26455984902087],
        'Ferrovia della Valsugana',
    ),
    levicoterme: new StationDefinition(
        'Levico Terme',
        1568,
        [46.005760868708784, 11.30499111417164],
        'Ferrovia della Valsugana',
    ),
    borgoest: new StationDefinition(
        'Borgo Valsugana Est',
        3503,
        [46.0523749376969, 11.463952179084858],
        'Ferrovia della Valsugana',
    ),
    grigno: new StationDefinition(
        'Grigno',
        1463,
        [46.015132389836545, 11.624921009185599],
        'Ferrovia della Valsugana',
    ),
    strigno: new StationDefinition(
        'Strigno',
        2795,
        [46.05119734847815, 11.514409175358631],
        'Ferrovia della Valsugana',
    ),
    primolano: new StationDefinition(
        'Primolano',
        2292,
        [45.9654632157231, 11.700971759327679],
        'Ferrovia della Valsugana',
    ),
    cismondelgrappa: new StationDefinition(
        'Cismon del Grappa',
        1112,
        [45.91962872949797, 11.729705735866421],
        'Ferrovia della Valsugana',
    ),
    carpanevalstagna: new StationDefinition(
        'Carpanè-Valstagna',
        911,
        [45.86016708056311, 11.66111335438478],
        'Ferrovia della Valsugana',
    ),
    bassano: new StationDefinition(
        'Bassano del Grappa',
        602,
        [45.7666368664187, 11.741322752385827],
        'Ferrovia della Valsugana',
    )
};

export default stations;
