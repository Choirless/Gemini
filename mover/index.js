const storage = require(`${__dirname}/storage`);

function main(params){
    console.log(params);

    const SOURCE_STORAGE = storage({
        endpoint : process.env.SOURCE_COS_ENDPOINT,
        accessKeyId: process.env.SOURCE_COS_ACCESS_KEY_ID,
        secretAccessKey: process.env.SOURCE_COS_ACCESS_KEY_SECRET,
        region: process.env.SOURCE_COS_REGION || 'eu-geo'
    });
    
    const DESTINATION_STORAGE = storage({
        endpoint : process.env.DESTINATION_COS_ENDPOINT,
        accessKeyId: process.env.DESTINATION_COS_ACCESS_KEY_ID,
        secretAccessKey: process.env.DESTINATION_COS_ACCESS_KEY_SECRET,
        region: process.env.DESTINATION_COS_REGION || 'eu-geo'
    });
    
    const SOURCE_STORAGE = new ibm.S3(SOURCE_CONFIG);
    const DESTINATION_STORAGE = new ibm.S3(DESTINATION_CONFIG);

    return SOURCE_STORAGE.get(params.Key, params.SOURCE_BUCKET)
        .then(data => {

            debug(data);
            return DESTINATION_STORAGE.put(params.Key, data.Body, params.DEST_BUCKET);
            
        })
    ;

}

module.exports = main;