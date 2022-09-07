import StopsGroup from '~/server/StopsGroup';
import Stop from '~/server/Stop';

// prettier-ignore
const stopsMapping: { [key: string]: StopsGroup } = {
    stazione: new StopsGroup(
        'Stazione FS (piazza Dante)',
        [
            new Stop(247, '', 12)
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
    ),
    smm: new StopsGroup(
        'Santa Maria Maggiore',
        [
            new Stop(407, '» Sud'),
            new Stop(406, '» Nord')
        ]
    ),
    travai: new StopsGroup(
        'Via Travai',
        [
            new Stop(444, '', 7)
        ]
    ),
    fiera: new StopsGroup(
        'Piazza Fiera',
        [
            new Stop(165, '', 7)
        ]
    ),
    portanuova: new StopsGroup(
        'Via S. Francesco - Porta Nuova',
        [
            new Stop(166, '» Nord'),
            new Stop(410, '» Sud')

        ]
    ),
    portaquila: new StopsGroup(
        'Piazza Venezia - Port\'Aquila',
        [
            new Stop(2927, '» Povo')
        ]
    ),
    corallo: new StopsGroup(
        'Via Venezia - Corallo',
        [
            new Stop(452, '» Povo'),
            new Stop(453, '» Trento')
        ]
    )
};

export default stopsMapping;
