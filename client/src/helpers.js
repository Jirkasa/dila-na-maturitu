import { v4 as uuid } from 'uuid';

export function getInitialMaterialSetup() {
    return [
        {
            heading: "Analýza uměleckého textu",
            content: [
                {
                    name: "Téma a motiv",
                    type: "TEXTAREA",
                    textAreaRows: 6,
                    checked: true,
                    value: ""
                },
                {
                    name: "Časoprostor",
                    type: "TEXTAREA",
                    textAreaRows: 5,
                    checked: true,
                    value: ""
                },
                {
                    name: "Kompozice",
                    type: "TEXTAREA",
                    textAreaRows: 4,
                    checked: false,
                    value: ""
                },
                {
                    name: "Literární druh",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Literární žánr",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Vypravěč",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Lyrický subjekt",
                    type: "TEXT",
                    checked: false,
                    value: ""
                },
                {
                    name: "Vyprávěcí způsob",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Postavy",
                    type: "CHARACTERS",
                    characters: [
                        {
                            id: uuid(),
                            name: "",
                            description: ""
                        }
                    ],
                    checked: true
                },
                {
                    name: "Typy promluv",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Veršovaná výstavba",
                    type: "TEXT",
                    checked: false,
                    value: ""
                },
                {
                    name: "Jazykové prostředky",
                    type: "TEXTAREA",
                    textAreaRows: 5,
                    checked: true,
                    value: ""
                },
                {
                    name: "Děj",
                    type: "PLOT",
                    plot: [
                        {
                            id: uuid(),
                            text: ""
                        }
                    ],
                    checked: true
                }
            ]
        },
        {
            heading: "Literárněhistorický kontext",
            content: [
                {
                    name: "Umělecký směr",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Období",
                    type: "TEXT",
                    checked: true,
                    value: ""
                },
                {
                    name: "Další autoři ze stejného období",
                    type: "TEXT",
                    checked: true,
                    value: ""
                }
            ]
        }
    ];
}

export function convertMaterialForEditation(material) {
    const defaultMaterialSetup = getInitialMaterialSetup();

    for (let i = 0; i < defaultMaterialSetup.length; i++) {
        if (!material[i] || material[i].heading !== defaultMaterialSetup[i].heading) {
            material.splice(i, 0, defaultMaterialSetup[i]);
            continue;
        }

        for (let j = 0; j < defaultMaterialSetup[i].content.length; j++) {
            const materialPart = material[i].content[j];
            const defaultMaterialSetupPart = defaultMaterialSetup[i].content[j];
            if (materialPart.name !== defaultMaterialSetupPart.name) {
                const part = defaultMaterialSetupPart;
                part.checked = false;
                material[i].content.splice(j, 0, part);
            } else {
                materialPart.checked = true;
                switch (materialPart.type) {
                    case "CHARACTERS":
                        for (let character of materialPart.characters)
                            character.id = uuid();
                        break;
                    case "PLOT":
                        for (let plotPart of materialPart.plot)
                            plotPart.id = uuid();
                        break;
                }
            }
        }
    }

    return material;
}

export function reorderList(list, startIndex, endIndex) {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
}