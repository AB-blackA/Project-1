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
// return an empty object if the JSON is empty (not loaded in)
// always a success (unless you count the JSON not loading in)
const getPokemon = (request, response) => {
  if (Object.keys(pokemonJSON).length !== 0) {
    respondJSON(request, response, 200, pokemonJSON);
  } else {
    respondJSON(request, response, 200, {});
  }
};

// helper function for determining what issues were with pokemon creation
// loops through params and determines the proper issues
// PLACEHOLDER FOR NOW
const errorMessage = (params) => `you done messed up${params}`;

// helper function for determining if there's a type validation issue
/* let typeValidator = (types) => {
  if (types.some((type) => type !== 'goodType')) {
    return 'Type Mismatch';
  }
  return '';
}; */

// function for handling POST addPokemon responses to:
// add a pokemon to the data (204)
// note that the actualy data isn't saved since there is no database
const addPokemon = (request, response) => {
  const body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const params = JSON.parse(bodyString);

    // if there's an issue with required params, throw the 400 at em
    // note that the params are not abritrary - you'll notice that Weaknesses
    // is not included. This is because of the api scope I'm trying to achieve

    // a user should be able to add any pokemon they see fit, real or not
    // weaknesses should be based off the pokemons type and are a function
    // in the utilities.js file
    // sometimes a pokemon may be custom and not have evolutions
    // therefor, there's always the possibility someone enters a real pokemon but
    // fudges the information. There is no code that could reliably predict that,
    // so the optionality for the user to make those mistakes is up to them purely
    // and to use the editPokemon functionality to correct mistakes

    // update these params to check for:
    // id (remember, id = num), name, img location, type (max of two, min of one, check for valid)
    // height, and weight
    if (!params.id || !params.name || !params.img || !params.type
      || !params.height || !params.weight) {
      const responseObj = {
        message: errorMessage(params),
        id: 'pokemonMissingParams',
      };
      return respondJSON(request, response, 400, responseObj);
    }

    // placeholder return
    return 'default';
  });
};

module.export = {
  respondJSON,
  getPokemon,
  addPokemon,
};
