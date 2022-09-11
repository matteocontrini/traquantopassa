import StopsGroup from '~/server/StopsGroup';
import StopDefinition from '~/server/StopDefinition';

// prettier-ignore
const stopsMapping: { [key: string]: StopsGroup } = {
    stazione: new StopsGroup(
        'Stazione FS (piazza Dante)',
        [
            new StopDefinition(247, '', 12)
        ],
        [46.071938002445414, 11.119560915153672]
    ),
    valoni: new StopsGroup(
        'Povo (via Valoni)',
        [
            new StopDefinition(150, '» Trento'),
            new StopDefinition(149, '» Povo')
        ],
        [46.06574548186276, 11.146326675127716]
    ),
    scienze: new StopsGroup(
        'Povo (Fac. Scienze)',
        [
            new StopDefinition(189, '» Trento')
        ],
        [46.06330983749043, 11.150180452357045]
    ),
    povo1: new StopsGroup(
        'Povo (Polo Scientifico)',
        [
            new StopDefinition(2833, '» Trento')
        ],
        [46.06734081167142, 11.150381339337152]
    ),
    manci: new StopsGroup(
        'Povo (piazza Manci)',
        [
            new StopDefinition(187, '» Trento'),
            new StopDefinition(186, '» Oltrecastello')
        ],
        [46.06595385343375, 11.154597879587431]
    ),
    pante: new StopsGroup(
        'Povo (Pantè)',
        [
            new StopDefinition(2820, '» Trento')
        ],
        [46.063935518450585, 11.150593092316743]
    ),
    mesiano: new StopsGroup(
        'Mesiano',
        [
            new StopDefinition(146, '» Trento'),
            new StopDefinition(145, '» Povo')
        ],
        [46.06719561754572, 11.13948725846796]
    ),
    mesianofs: new StopsGroup(
        'Mesiano FS',
        [
            new StopDefinition(148, '» Trento'),
            new StopDefinition(147, '» Povo')
        ],
        [46.06506891439082, 11.14173376796036]
    ),
    smm: new StopsGroup(
        'Santa Maria Maggiore',
        [
            new StopDefinition(407, '» Sud'),
            new StopDefinition(406, '» Nord')
        ],
        [46.0681011850427, 11.118724710105349]
    ),
    travai: new StopsGroup(
        'Via Travai',
        [
            new StopDefinition(444, '', 7)
        ],
        [46.06458968825606, 11.120921511011897]
    ),
    fiera: new StopsGroup(
        'Piazza Fiera',
        [
            new StopDefinition(165, '', 7)
        ],
        [46.06521475669664, 11.123203816817682]
    ),
    portanuova: new StopsGroup(
        'Via S. Francesco - Porta Nuova',
        [
            new StopDefinition(166, '» Nord'),
            new StopDefinition(410, '» Sud')
        ],
        [46.06685966076164, 11.126347507304343]
    ),
    portaquila: new StopsGroup(
        'Piazza Venezia - Port\'Aquila',
        [
            new StopDefinition(2927, '» Povo')
        ],
        [46.06953418561028, 11.12782013439054]
    ),
    corallo: new StopsGroup(
        'Via Venezia - Corallo',
        [
            new StopDefinition(452, '» Povo'),
            new StopDefinition(453, '» Trento')
        ],
        [46.06855693542798, 11.136371283967751]
    ),
    formigheta: new StopsGroup(
        'Martignano (via alla Formigheta)',
        [
            new StopDefinition(101, '» Cognola'),
            new StopDefinition(102, '» Trento')
        ],
        [46.089125294659915, 11.133128827075872]
    )
};

export default stopsMapping;
