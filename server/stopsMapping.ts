import StopsGroup from '~/server/StopsGroup';
import StopDefinition from '~/server/StopDefinition';

// prettier-ignore
const stopsMapping: { [key: string]: StopsGroup } = {
    stazione: new StopsGroup(
        'Stazione FS - Piazza Dante',
        [
            new StopDefinition(247, '', 12)
        ],
        [46.071938002445414, 11.119560915153672],
        'trentofs'
    ),
    valoni: new StopsGroup(
        'Povo - Via Valoni',
        [
            new StopDefinition(150, '» Trento'),
            new StopDefinition(149, '» Povo')
        ],
        [46.06574548186276, 11.146326675127716]
    ),
    scienze: new StopsGroup(
        'Povo - Fac. Scienze',
        [
            new StopDefinition(189, '» Trento'),
            new StopDefinition(188, '» Villazzano')
        ],
        [46.06330983749043, 11.150180452357045]
    ),
    povo1: new StopsGroup(
        'Povo - Polo Scientifico',
        [
            new StopDefinition(2833, '» Trento')
        ],
        [46.06734081167142, 11.150381339337152]
    ),
    manci: new StopsGroup(
        'Povo - Piazza Manci',
        [
            new StopDefinition(187, '» Trento'),
            new StopDefinition(186, '» Oltrecastello')
        ],
        [46.06595385343375, 11.154597879587431]
    ),
    pante: new StopsGroup(
        'Povo - Pantè',
        [
            new StopDefinition(2820, '» Trento'),
            new StopDefinition(2490, '» Oltrecastello')
        ],
        [46.063935518450585, 11.150593092316743]
    ),
    povocentrocivico: new StopsGroup(
        'Povo - Centro Civico',
        [
            new StopDefinition(184, '» Trento'),
            new StopDefinition(183, '» Oltrecastello')
        ],
        [46.0640125, 11.1519555]
    ),
    mesiano: new StopsGroup(
        'Mesiano - Fac. Ingegneria',
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
        [46.06506891439082, 11.14173376796036],
        'povomesiano'
    ),
    lodovico: new StopsGroup(
        'Ponte Lodovico',
        [
            new StopDefinition(174, '» Povo'),
            new StopDefinition(175, '» Trento')
        ],
        [46.069438500000004, 11.1395755]
    ),
    smm: new StopsGroup(
        'Santa Maria Maggiore',
        [
            new StopDefinition(407, '» Sud', 8),
            new StopDefinition(406, '» Nord', 8)
        ],
        [46.0681011850427, 11.118724710105349]
    ),
    travai: new StopsGroup(
        'Via Travai',
        [
            new StopDefinition(444, '', 10)
        ],
        [46.06458968825606, 11.120921511011897]
    ),
    fiera: new StopsGroup(
        'Piazza Fiera',
        [
            new StopDefinition(165, '', 10)
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
    romagnosi: new StopsGroup(
        'Via Romagnosi - Vannetti',
        [
            new StopDefinition(403, '', 10)
        ],
        [46.072994, 11.122647]
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
        'Martignano - Via alla Formigheta',
        [
            new StopDefinition(101, '» Cognola'),
            new StopDefinition(102, '» Trento')
        ],
        [46.089125294659915, 11.133128827075872]
    ),
    cavalleggeri: new StopsGroup(
        'Corso 3 Novembre - Ponte Cavalleggeri',
        [
            new StopDefinition(466, '» Nord'),
            new StopDefinition(524, '» Sud')
        ],
        [46.059292, 11.126667]
    ),
    gerola: new StopsGroup(
        'Via Gerola - Ospedale S. Chiara',
        [
            new StopDefinition(344, '', 7)
        ],
        [46.058390, 11.133083]
    ),
    fogazzaro: new StopsGroup(
        'Viale Verona - Fogazzaro',
        [
            new StopDefinition(457, '» Nord'),
            new StopDefinition(458, '» Sud')
        ],
        [46.056511, 11.128369]
    ),
    questura: new StopsGroup(
        'Viale Verona - Questura',
        [
            new StopDefinition(461, '» Sud'),
            new StopDefinition(464, '» Nord')
        ],
        [46.0479325, 11.131114]
    ),
    bolghera: new StopsGroup(
        'Via Bolghera - S. Antonio',
        [new StopDefinition(284, '', 7)],
        [46.058155, 11.131195]
    ),
    borino: new StopsGroup(
        'Borino',
        [
            new StopDefinition(9, '» Trento'),
            new StopDefinition(2530, '» Cimirlo')
        ],
        [46.0670554, 11.1656085]
    )
};

export default stopsMapping;
