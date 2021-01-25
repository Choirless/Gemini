require('dotenv').config( {silent : process.env.NODE_ENV === "production"} );
const debug = require('debug')('index');
const storage = require(`${__dirname}/storage`);

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

SOURCE_STORAGE.list(BUCKET_PAIRINGS[0][0], true).then(items => debug(items))
DESTINATION_STORAGE.list(BUCKET_PAIRINGS[0][1]).then(items => debug(items))