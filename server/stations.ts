import StationDefinition from '~/server/StationDefinition';

/* prettier-ignore */
const stations: { [key: string]: StationDefinition } = {
    trentofs: new StationDefinition(
        'Trento FS',
        2912,
        [46.06514315843706, 11.142636316353439]
    ),
    trentosantachiara: new StationDefinition(
        'Trento S. Chiara',
        4030,
        [46.05413549349008, 11.135663623408977]
    ),
    trentosanbartolameo: new StationDefinition(
        'Trento S. Bartolameo',
        4079,
        [46.04760529365945, 11.135257245851609]
    ),
    povomesiano: new StationDefinition(
        'Povo-Mesiano',
        2270,
        [46.06535630630152, 11.14263561042483]
    ),
};

export default stations;
