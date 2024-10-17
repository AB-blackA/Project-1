/* Author: Andrew Black
   Since: 10/16/24
   Purpose: Utilities.js helps jsonResponses.js in determining some params and/or other odd
   functionalities
*/

// helper function to determine if a pokemon being added already has the same id
// returns TRUE if a dupe is found, FALSE otherwise
const determineDupe = (id, pokemonJSON) => {
    const dupe = pokemonJSON.filter((p) => p.id === id);
    return dupe.length <= 0;
};

// helper function to convert id to a num string
const convertIdToNum = (id) => {
    let stringId = id.toString();
    while (stringId.length < 3) {
        stringId = `0${stringId}`;
    }
    return stringId;
};

// helper function to find insertion index
const findInsertIndex = (arr, newId) => {
    for (let i = 0; i < arr.length; i++) {
        if (parseInt(arr[i].id, 10) > newId) {
            return i;
        }
    }
    return arr.length;
};

// helper function to insert pokemon in sorted position
const insertPokemon = (pokemonArray, newPokemon) => {
    const insertIndex = findInsertIndex(pokemonArray, parseInt(newPokemon.id, 10));
    pokemonArray.splice(insertIndex, 0, newPokemon);
    return pokemonArray;
};

// function for determining the weakness based off the types
// not functional yet, should be moved to external utilities
const determineWeaknesses = (types) => {
    const normal = 0;
    const fighting = 1;
    const flying = 2;
    const poison = 3;
    const ground = 4;
    const rock = 5;
    const bug = 6;
    const ghost = 7;
    const fire = 8;
    const water = 9;
    const grass = 10;
    const electric = 11;
    const psychic = 12;
    const ice = 13;
    const dragon = 14;

    const typeMatchupChart = [
        // N,Fi,Fl,Po,Gd, R, B,Gh,Fr, W,Gs, E,Py, I, D
        [1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1], // normal
        [1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 1, 1], // fighting
        [1, 0.5, 1, 1, 0, 2, 0.5, 1, 1, 1, 0.5, 2, 1, 2, 1], // flying
        [1, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1], // poison
        [1, 1, 1, 0.5, 1, 0.5, 1, 1, 1, 2, 2, 0, 1, 2, 1], // ground
        [1, 2, 0.5, 1, 2, 1, 1, 1, 0.5, 2, 2, 1, 1, 1, 1], // rock
        [1, 0.5, 2, 2, 0.5, 2, 1, 1, 2, 1, 0.5, 1, 1, 1], // bug
        [0, 0, 1, 0.5, 1, 1, 0.5, 2, 1, 1, 1, 1, 1, 1, 1], // ghost
        [1, 1, 1, 1, 2, 2, 0.5, 1, 0.5, 2, 0.5, 1, 1, 1, 1], // fire
        [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 2, 2, 1, 0.5, 1], // water
        [1, 1, 2, 2, 0.5, 1, 2, 1, 2, 0.5, 0.5, 0.5, 1, 2, 1], // grass
        [1, 1, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1], // electric
        [1, 0.5, 1, 1, 1, 1, 2, 0, 1, 1, 1, 0.5, 1, 1], // psychic
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1], // ice
        [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 2, 2], // dragon
    ];

    // arrays for weaknesses
    // base = first type based in
    let baseWeaknesses;

    // combined = weakness chart after multiplying second type weaknesses by base type
    // initialized for mapping multiplication within function if needed
    let combinedWeaknesses;

    // determine weakness through a forEach
    types.forEach((type) => {
        const lowerCaseType = type.toLowerCase();

        // find the index of the proper type as defined above
        const typeIndex = {
            normal,
            fighting,
            flying,
            poison,
            ground,
            rock,
            bug,
            ghost,
            fire,
            water,
            grass,
            electric,
            psychic,
            ice,
            dragon,
        }[lowerCaseType];

        // check if we're doing the first type (baseWeakness.length === 0 only possible this way)
        if (typeIndex !== undefined) {
            if (baseWeaknesses.length === 0) {
                baseWeaknesses = (typeMatchupChart[typeIndex]);

                // otherwise, multiply the second type by instantiating combinedWeaknesses
                // to values 1 (so it doesn't mess up the multiplication) and then map it such that
                // it is multiplied by both the baseWeaknesses and the new weakness of the second type
            } else {
                combinedWeaknesses = (typeMatchupChart[typeIndex]);
                combinedWeaknesses = combinedWeaknesses.map(
                    (weakness, index) => weakness * baseWeaknesses[index],
                );
            }
        }
    });

    if (combinedWeaknesses.length === 0) {
        return baseWeaknesses;
    }
    return combinedWeaknesses;
};

// returns custom errormessage based off missing params
const errorMessage = (params) => {
    const requiredParams = ['id', 'name', 'img', 'type', 'height', 'weight'];
    const missingParams = requiredParams.filter(param => !params[param]);
  
    if (missingParams.length > 0) {
      return `You missed the following parameters: ${missingParams.join(', ')}`;
    } else {
      return 'All required parameters are present.';
    }
  };

  module.exports = {
    determineDupe,
    determineWeaknesses,
    errorMessage,
    convertIdToNum,
    findInsertIndex,
    insertPokemon,
  };