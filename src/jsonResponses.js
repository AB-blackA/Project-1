/* Author: Andrew Black
 * Since: 10/4/24
 * Purpose: jsonResponses handles GET, HEAD, and POST requests for an API
 * regarding Pokemon data
 * TO DO LIST
 * 1) update and move utility functions NOT related to json responses to a different file
 * - currently, this is determineDupes, determineWeaknesses, and errorMessage
 * 2) update 'addPokemon' method to have proper logic for determining the proper
 * - 'num' and 'evolutions'
 * 3) update 'addPokemon' to sort any newly added Pokemon to the proper index
 * - (currently, just pushes all)
 * - new Pokemon to the end regardless of id. id 0, for example, could be pushed
 * - after id 999, which I despise
 * 4) update 'getPokemonByType' method to handle multiple types
 */

// storage of Pokemon added by client side
const pokemonJSON = require('../data/pokedex.json');

// function for handling JSON responses
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

// function for handling response for GET getPokemon
// returns an empty object if the JSON is empty (not loaded in)
// always returns a success (200)
const getPokemon = (request, response) => {
  if (Object.keys(pokemonJSON).length !== 0) {
    respondJSON(request, response, 200, pokemonJSON);
  } else {
    respondJSON(request, response, 200, {});
  }
};

// function for handling response for HEAD getPokemon
// always returns a success (200), returns no data
const headPokemon = (request, response) => {
  respondJSON(request, response, 200, {});
};

// function for handling response for GET getPokemonById
// returns the Pokemon if found along with a 200
// returns an empty object if the JSON is empty (not loaded in) (200)
const getPokemonById = (request, response, id) => {
  // if the JSON never loaded in, return an empty object
  if (Object.keys(pokemonJSON).length === 0) {
    respondJSON(request, response, 200, {});
  }

  // look for the id and return the proper Pokemon if found or nothing if not found
  const pokemon = pokemonJSON.find((p) => p.id === Number(id));

  if (pokemon) respondJSON(request, response, 200, pokemon);
  respondJSON(request, response, 200, {});
};

// HEAD function for getPokemonById
// returns a success 200
const headPokemonById = (request, response) => {
  respondJSON(request, response, 200, {});
};

// function for handling response for GET getPokemonByName
// returns the Pokemon along with a 200 (could be empty if not found)
// returns an empty object if the JSON is empty (not loaded in) (200)
const getPokemonByName = (request, response, name) => {
  // return empty if JSON not loaded
  if (Object.keys(pokemonJSON).length === 0) {
    respondJSON(request, response, 200, {});
  }

  // else, return pokemon or empty
  const pokemon = pokemonJSON.find((p) => p.name.toLowerCase() === name.toLowerCase());

  if (pokemon) respondJSON(request, response, 200, pokemon);
  respondJSON(request, response, 200, {});
};

// HEAD function for getPokemonByName
// returns a success
const headPokemonByName = (request, response) => {
  respondJSON(request, response, 200, {});
};

// function for handling response for GET getPokemonByHeight
// returns the Pokemon (plural) if found along with a 200
// returns an empty object if the JSON is empty (not loaded in) (200)
const getPokemonByHeight = (request, response, height) => {
  if (Object.keys(pokemonJSON).length === 0) {
    respondJSON(request, response, 200, {});
  }

  const pokemon = pokemonJSON.filter((p) => p.height === height);

  if (pokemon) respondJSON(request, response, 200, pokemon);
  respondJSON(request, response, 200, {});
};

// HEAD function for getPokemonByHeight
// returns a success
const headPokemonByHeight = (request, response) => {
  respondJSON(request, response, 200, {});
};

// function for handling response for GET getPokemonByHeight
// returns the Pokemon (plural) if found along with a 200
// returns an empty object if the JSON is empty (not loaded in) (200)
const getPokemonByWeight = (request, response, weight) => {
  if (Object.keys(pokemonJSON).length === 0) {
    respondJSON(request, response, 200, {});
  }

  const pokemon = pokemonJSON.filter((p) => p.weight === weight);

  if (pokemon) respondJSON(request, response, 200, pokemon);
  respondJSON(request, response, 200, {});
};

// HEAD function for getPokemonByWeight
// returns a success
const headPokemonByWeight = (request, response) => {
  respondJSON(request, response, 200, {});
};

// function for handling response for GET getPokemonByType
// returns a 200 code and the found pokemon, or an empty array if none
// match (should be impossible for the latter currently)
const getPokemonByType = (request, response, type1) => {
  let responseObj = [];

  if (Object.keys(pokemonJSON).length === 0) {
    respondJSON(request, response, 200, responseObj);
  }

  responseObj = pokemonJSON.filter((p) => p.type.includes(type1));

  respondJSON(request, response, 200, responseObj);
};

// HEAD function for getPokemonByType
// returns a success
const headPokemonByType = (request, response) => {
  respondJSON(request, response, 200, {});
};

// helper function for determining what issues were with pokemon creation
// should have logic to determine what params are wrong to help user
// currently A PLACEHOLDER
const errorMessage = (params) => `you done messed up${params}`;

// helper function to determine if a pokemon being added already has the same id
// returns TRUE if a dupe is found, FALSE otherwise
const determineDupe = (id) => {
  const dupe = pokemonJSON.filter((p) => p.id === id);

  return !(dupe.length > 0);
};

// function for determining the weakness based off the types
// not functional yet, should be moved to external utilities
/* const determineWeaknesses = (types) => {

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
    [], // fire

  ]

  let weaknesses = [types];

  return weaknesses;
} */

// function for handling POST addPokemon responses to:
// add a pokemon to the data (201), update an existing mon (204)
// yell at user for fuding up the data somehow (400)
// note that the actual data isn't saved since there is no database
const addPokemon = (request, response) => {
  const body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const params = JSON.parse(bodyString);

    // check for required params, and return a 400 with custom error code
    // if something doesn't add up (missing crucial information) or duplicate id
    if ((!params.id || !params.name || !params.img || !params.type || !params.height
      || !params.weight)
      || determineDupe(params.id)) {
      const responseObj = {
        message: errorMessage(params),
        id: 'pokemonMissingParams',
      };
      return respondJSON(request, response, 400, responseObj);
    }

    // create the new pokemon for the JSON, but don't add it yet!
    // still have to check if its an update or not
    const newPokemon = {
      id: params.id,

      // note that the num is not technically the same as the id, as a number
      // has a trailing '0' if id is less than 99.
      // this requires fixing and is kept in for the check up because
      // i am tired
      num: params.id,
      name: params.name,
      img: params.img,
      type: params.type,
      height: params.height,
      weight: params.weight,

      // determinedWeaknesses is not real - yet
      // to be added eventually
      // weaknesses: determineWeaknesses(params.type),

      // evolution not yet implemented as im unsure at this moment
      // how to account for those that don't have them
      // evolution: something something idk yet
    };

    // look and try to find a Pokemon with the same id, taking note of the index
    // if index is not -1, that means we are UPDATING
    const index = pokemonJSON.findIndex((p) => p.id === Number(params.id));

    // update check
    // if = update
    // else = add
    if (index !== -1) {
      pokemonJSON[index] = newPokemon;
      return respondJSON(request, response, 204, { message: 'Succesfully updated Pokemon!', id: 'pokemonUpdated' });
    }
    pokemonJSON.push(newPokemon);
    return respondJSON(request, response, 201, { message: 'Succesfully Added Pokemon!', id: 'pokemonAdded' });
  });
};

// function for handling POST deletePokemon
// returns a 204 if found, or returns a 400 if the id isn't valid
const deletePokemon = (request, response, id) => {
  // try to find the Mon, an index of -1 means it's nonexistent
  const index = pokemonJSON.findIndex((p) => p.id === Number(id));
  if (index !== -1) {
    pokemonJSON.splice(index, 1);
    respondJSON(request, response, 204, { message: 'Pokemon deleted!', id: 'pokemonDeleted' });
  } else {
    respondJSON(request, response, 400, { message: 'Invalid Pokemon ID for deletion', id: 'pokemonIDInvalid' });
  }
};

// general 404 not found response
const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseObj);
};

module.exports = {
  getPokemon,
  headPokemon,
  getPokemonById,
  headPokemonById,
  getPokemonByName,
  headPokemonByName,
  getPokemonByHeight,
  headPokemonByHeight,
  getPokemonByWeight,
  headPokemonByWeight,
  getPokemonByType,
  headPokemonByType,
  addPokemon,
  deletePokemon,
  notFound,
};
