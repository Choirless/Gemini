const debug = require('debug')('gemini:transfer');
const fetch = require('node-fetch');

module.exports = function(KEY){

    return Promise.resolve(`Transferring ${KEY}`);

    // fetch(`https://${TRANSFER_FUNCTION_ENDPOINT}/`);

};