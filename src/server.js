/* Author: Andrew Black
 *Since: 9/27/24
 *Purpose: server.js is responsible for getting the server up, while also
 *routing the user to the correct pages.
 *As per some of the other scripts, thank you to Austin Willoughby for providing
 *many examples of a properly structured server.js file, which this one is a modification of
 *Source: https://github.com/IGM-RichMedia-at-RIT/head-request-example-done/blob/master/src/server.js
 */

const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// structure for handling page routing
// note the different types of requests!
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    // returns all Pokemon
    '/getPokemon': jsonHandler.getPokemon,

    // returns by specifics
    '/getPokemonById': jsonHandler.getPokemonById,
    '/getPokemonByName': jsonHandler.getPokemonByName,
    '/getPokemonByHeight': jsonHandler.getPokemonByHeight,
    '/getPokemonByWeight': jsonHandler.getPokemonByHeight,
    '/getPokemonByType': jsonHandler.getPokemonByHeight,
  },
  HEAD: {
    '/getPokemon': jsonHandler.headPokemon,
    '/getPokemonById': jsonHandler.headPokemonById,
    '/getPokemonByName': jsonHandler.headPokemonByName,
    '/getPokemonByHeight': jsonHandler.headPokemonByHeight,
    '/getPokemonByWeight': jsonHandler.headPokemonByWeight,
    '/getPokemonByType': jsonHandler.headPokemonByType,
  },
  POST: {
    '/addPokemon': jsonHandler.addPokemon,
    '/deletePokemon': jsonHandler.deletePokemon,
  },
  notFound: jsonHandler.notFound,
};

// function for handling all requests
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // determine request method, then call the appropriate function from urlStruct
  const method = request.method.toUpperCase();

  if (urlStruct[method] && urlStruct[method][parsedUrl.pathname]) {
    urlStruct[method][parsedUrl.pathname](request, response, parsedUrl);
  } else {
    // default return 404 notFound
    urlStruct.notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
