import { v4 as uuid } from 'uuid';

// FUNCTION TO GET INITIAL MATERIAL SETUP
// - used on Create Material page
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

// FUNCTION TO CONVERT MATERIAL FETCHED FROM SERVER FOR EDITATION
export function convertMaterialForEditation(material) {
    // get default material setup
    const defaultMaterialSetup = getInitialMaterialSetup();

    // for each section in default material setup
    for (let i = 0; i < defaultMaterialSetup.length; i++) {
        // if material doesn't contain this section, it is added from default material setup
        if (!material[i] || material[i].heading !== defaultMaterialSetup[i].heading) {
            material.splice(i, 0, defaultMaterialSetup[i]);
            continue;
        }

        // for each part in default material setup section
        for (let j = 0; j < defaultMaterialSetup[i].content.length; j++) {
            // get part of material section
            const materialPart = material[i].content[j];
            // get part of default material setup section
            const defaultMaterialSetupPart = defaultMaterialSetup[i].content[j];
            
            // if material doesn't contain this section, is is added from default material setup
            if (!materialPart || materialPart.name !== defaultMaterialSetupPart.name) {
                const part = defaultMaterialSetupPart;
                // material didn't contain this part, so it is not checked
                part.checked = false;
                material[i].content.splice(j, 0, part);
            } else {
                // material contains this section, so it is marked as checked
                materialPart.checked = true;
                // genereate ids for characters and plot parts of section
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

// FUNCTION TO SWAP TWO ITEMS IN ARRAY
export function reorderList(list, startIndex, endIndex) {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
}

// FUNCTION TO GET QUESTIONS FROM MATERIAL
// - used on Edit Wrong Answers page
export function getQuestionsFromMaterial(material, wrongAnswersArr) {
    // get map of wrong answers
    // - key = question name
    // - value = answers array
    const wrongAnswers = {};
    for (let question of wrongAnswersArr) wrongAnswers[question.name] = question.answers;

    // array of questions to be returned at the end of function
    const questions = [];

    // for each section in material
    for (let section of material) {
        // for each part in section
        for (let part of section.content) {
            // questions are generated only for TEXT and TEXTAREA type parts
            if (part.type !== "TEXT" && part.type !== "TEXTAREA") continue;

            // create question
            const question = {
                name: part.name,
                rightAnswer: part.value,
                wrongAnswers: []
            };
            // set 4 wrong answers to question
            for (let i = 0; i < 3; i++) {
                // if map of wrong answers contains answer, it is added to question wrong answers array
                if (wrongAnswers[part.name] && wrongAnswers[part.name][i]) {
                    question.wrongAnswers.push({
                        value: wrongAnswers[part.name][i],
                        disabled: false
                    });
                } else {
                    // if map of wrong answers doesn't contain answer, new one is created
                    question.wrongAnswers.push({
                        value: "",
                        disabled: i === 2
                    })
                }
            }

            // add question to questions array
            questions.push(question);
        }
    }

    // return array of questions
    return questions;
}