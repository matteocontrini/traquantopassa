import StopsGroup from '~/server/StopsGroup';
import Stop from '~/server/Stop';

// prettier-ignore
const stopsMapping: { [key: string]: StopsGroup } = {
    stazione: new StopsGroup(
        'Stazione FS (piazza Dante)',
        [
            new Stop(247, '', 10)
        ]
    ),
    valoni: new StopsGroup(
        'Povo (via Valoni)',
        [
            new Stop(150, '» Trento'),
            new Stop(149, '» Povo')
        ]
    ),
    manci: new StopsGroup(
        'Povo (piazza Manci)',
        [
            new Stop(187, '» Trento'),
            new Stop(186, '» Oltrecastello')
        ]
    ),
    mesiano: new StopsGroup(
        'Mesiano',
        [
            new Stop(146, '» Trento'),
            new Stop(145, '» Povo')
        ]
    ),
    mesianofs: new StopsGroup(
        'Mesiano FS',
        [
            new Stop(148, '» Trento'),
            new Stop(147, '» Povo')
        ]
    ),
    povo1: new StopsGroup(
        'Povo (Polo Scientifico)',
        [
            new Stop(2833, '» Trento')
        ]
    ),
    formigheta: new StopsGroup(
        'Martignano (via alla Formigheta)',
        [
            new Stop(101, '» Cognola'),
            new Stop(102, '» Trento')
        ]
    )
};

export default stopsMapping;
