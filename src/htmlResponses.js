/*Author: AustinWilloughby
 *Since: Unknown
 *Purpose: html response handler for loading files, and getting the index page and
 *style.css page working.
 *NOTE: this code is ripped 100% from an in-class example by Austin at the
 *Rochester Institute of Technology. I didn't have to change a thing,
 *so all comments are left in tack and are NOT written by the student creating
 *this assignment, Andrew Black.
 *source: https://github.com/IGM-RichMedia-at-RIT/head-request-example-done/blob/master/src/htmlResponses.js
 */

 const fs = require('fs'); // pull in the file system module

 // load files into memory
 // This is a synchronous operation, so you'd only
 // want to do it on startup.
 // This not the best way to load files unless you have few files.
 const index = fs.readFileSync(`${__dirname}/../client/client.html`);
 const css = fs.readFileSync(`${__dirname}/../client/style.css`);
 
 // function to get the index page
 const getIndex = (request, response) => {
   response.writeHead(200, { 'Content-Type': 'text/html' });
   response.write(index);
   response.end();
 };
 
 // function to get css page
 const getCSS = (request, response) => {
   response.writeHead(200, { 'Content-Type': 'text/css' });
   response.write(css);
   response.end();
 };
 
 // set out public exports
 module.exports = {
   getIndex,
   getCSS,
 };
 