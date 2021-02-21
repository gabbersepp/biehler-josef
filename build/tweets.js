const tweetDownloader = require("tweet-downloader");
const fs = require("fs");
const path = require("path");

const basePath = path.resolve(".");
const imagesBasePath = `${basePath}/app/data/images`;
const tweetsBasePath = `${basePath}/app/data/tweets.json`;

async function getLatestTweets() { 
    let tweets = tweetDownloader.readTweets(tweetsBasePath);
    
    let maxId = BigInt(1);
    if (tweets.length > 0) {
        maxId = tweets.map(x => x.id).reduce((x, y) => x > y ? x : y);
    }
    
 
    const jbTweets = await tweetDownloader.getLatestTweets(maxId.toString(), "JosefBiehler", imagesBasePath,
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET, 3200);

    const kackDevTweets = await tweetDownloader.getLatestTweets(maxId.toString(), "KackDev", imagesBasePath,
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET, 3200);

    tweets = [...jbTweets, ...kackDevTweets];

    tweetDownloader.mergeAndWriteWithExisting(tweetsBasePath, tweets);

    return tweets;
}

async function getSpecificTweets() {
    const tweetIds = JSON.parse(fs.readFileSync(`${basePath}/app/data/devto-to-tweet.json`).toString()).map(x => x.tweetId);
    const tweets = await tweetDownloader.getSpecificTweets(tweetIds, imagesBasePath,
    process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
    tweetDownloader.mergeAndWriteWithExisting(tweetsBasePath, tweets);
}

getLatestTweets()
.then(getSpecificTweets)
.catch(e => {
    console.error(e)
    process.exit(-1)
});
