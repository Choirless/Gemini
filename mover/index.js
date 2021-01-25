
const storage = require(`${__dirname}/storage`);

function main(params){
    console.log(params);

    if(params.FN_SECRET === params.USER_SECRET){
        
        const SOURCE_STORAGE = storage({
            endpoint : params.SOURCE_COS_ENDPOINT,
            accessKeyId: params.SOURCE_COS_ACCESS_KEY_ID,
            secretAccessKey: params.SOURCE_COS_ACCESS_KEY_SECRET,
            region: params.SOURCE_COS_REGION || 'eu-geo'
        });
        
        const DESTINATION_STORAGE = storage({
            endpoint : params.DESTINATION_COS_ENDPOINT,
            accessKeyId: params.DESTINATION_COS_ACCESS_KEY_ID,
            secretAccessKey: params.DESTINATION_COS_ACCESS_KEY_SECRET,
            region: params.DESTINATION_COS_REGION || 'eu-geo'
        });
    
        return SOURCE_STORAGE.get(params.Key, params.SOURCE_BUCKET)
            .then(data => {
    
                console.log(data);
                return DESTINATION_STORAGE.put(params.Key, data.Body, params.DEST_BUCKET);
                
            })
        ;

    } else {
        return Promise.reject("Invalid user credentials");
    }

}

exports.main = main;