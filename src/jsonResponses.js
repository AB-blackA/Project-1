/* Author: Andrew Black
 * Since: 10/4/24
 * Purpose: jsonResponses handles GET, HEAD, and POST requests for an API
 * regarding Pokemon data
 */

// utility functions import
const {
  determineDupe,
  determineWeaknesses,
  errorMessage,
  convertIdToNum,
  insertPokemon,
} = require('./utilities.js');

// storage of Pokemon added by client side
let pokemonJSON = require('../data/pokedex.json');

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
  } else {
    // look for the id and return the proper Pokemon if found or nothing if not found
    const pokemon = pokemonJSON.find((p) => p.id === Number(id));

    if (pokemon) respondJSON(request, response, 200, pokemon);
    else {
      respondJSON(request, response, 200, {});
    }
  }
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
  } else {
    // else, return pokemon or empty
    const pokemon = pokemonJSON.find((p) => p.name.toLowerCase() === name.toLowerCase());

    if (pokemon) respondJSON(request, response, 200, pokemon);
    else {
      respondJSON(request, response, 200, {});
    }
  }
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
  } else {
    const pokemon = pokemonJSON.filter((p) => p.height === height);

    if (pokemon) respondJSON(request, response, 200, pokemon);
    else {
      respondJSON(request, response, 200, {});
    }
  }
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
  } else {
    const pokemon = pokemonJSON.filter((p) => p.weight === weight);

    if (pokemon) respondJSON(request, response, 200, pokemon);
    else {
      respondJSON(request, response, 200, {});
    }
  }
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
  } else {
    responseObj = pokemonJSON.filter((p) => p.type.includes(type1));

    respondJSON(request, response, 200, responseObj);
  }
};

// HEAD function for getPokemonByType
// returns a success
const headPokemonByType = (request, response) => {
  respondJSON(request, response, 200, {});
};

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
      || determineDupe(params.id, pokemonJSON)) {
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
      num: convertIdToNum(params.id),
      name: params.name,
      img: params.img,
      type: params.type,
      height: params.height,
      weight: params.weight,
      weaknesses: determineWeaknesses(params.type),
      evolution: params.evolutions && params.evolutions.length ? params.evolutions : [],
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
    pokemonJSON = insertPokemon(pokemonJSON, newPokemon);
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
