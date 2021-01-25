const debug = require('debug')('gemini:transfer');
const fetch = require('node-fetch');

module.exports = function(KEY, SOURCE_BUCKET, DEST_BUCKET){

    //return Promise.resolve(`Transferring ${KEY} from ${SOURCE_BUCKET} to ${DEST_BUCKET}`);

    return fetch(`https://${process.env.TRANSFER_FUNCTION_ENDPOINT}`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            USER_SECRET : process.env.TRANSFER_FUNCTION_SECRET,
            Key : KEY,
            SOURCE_BUCKET : SOURCE_BUCKET,
            DEST_BUCKET : DEST_BUCKET
        })
    });

};