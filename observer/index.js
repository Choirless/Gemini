require('dotenv').config( {silent : process.env.NODE_ENV === "production"} );
const debug = require('debug')('gemini:index');
const storage = require(`${__dirname}/storage`);
const transfer = require(`${__dirname}/transfer`);

const MAX_CONCURRENT_FUNCTIONS = process.env.MAX_CONCURRENT_FUNCTIONS || 500;

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

const SOURCE_BUCKETS = process.env.SOURCE_BUCKETS_LIST.split(',');
const DESTINATION_BUCKETS = process.env.DESTINATION_BUCKETS_LIST.split(',');

const BUCKET_PAIRINGS = SOURCE_BUCKETS.map( (bucket, idx) => {

    return [bucket, DESTINATION_BUCKETS[idx] ];

});

function prepareTransfers(pairing){
    
    console.log(pairing);
        
    const OBJECTS_IN_BUCKETS = [];

    OBJECTS_IN_BUCKETS.push( SOURCE_STORAGE.list(pairing[0], true ) );
    OBJECTS_IN_BUCKETS.push( DESTINATION_STORAGE.list(pairing[1], true ) )

    Promise.all(OBJECTS_IN_BUCKETS)
        .then(results => {

            const OBJECTS_IN_SOURCE_BUCKET = results[0];
            const OBJECTS_IN_DESTINATION_BUCKET = results[1];

            debug("Pairing:", pairing);
            debug(OBJECTS_IN_SOURCE_BUCKET.length, OBJECTS_IN_DESTINATION_BUCKET.length, `${OBJECTS_IN_SOURCE_BUCKET.length - OBJECTS_IN_DESTINATION_BUCKET.length} objects missing from destination bucket.`);
            
            const LOOKUP = {}

            OBJECTS_IN_DESTINATION_BUCKET.forEach(bucketObject => {
                LOOKUP[bucketObject.Key] = bucketObject;
            });

            const FILES_TO_TRANSFER = OBJECTS_IN_SOURCE_BUCKET.filter(objectInSourceBucket => {

                return !LOOKUP[objectInSourceBucket.Key];

            });
            
            if(FILES_TO_TRANSFER.length > MAX_CONCURRENT_FUNCTIONS){
                FILES_TO_TRANSFER.length = MAX_CONCURRENT_FUNCTIONS;
            }

            const transfers = FILES_TO_TRANSFER.map(FILE => {
                debug(FILE);
                return transfer(FILE.Key, pairing[0], pairing[1]);
            });

            return Promise.all(transfers)

        })
        .then(results => {
            debug(results);
            debug('Tranfers completed:', results.length);
        })
        .catch(err => {
            debug(err);
        })
    ;
}

BUCKET_PAIRINGS.forEach(pairing => {

    setInterval(function(){
        
        prepareTransfers(pairing);

    }, 530 * 1000);

    prepareTransfers(pairing);


});
