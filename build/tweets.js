const tweetDownloader = require("tweet-downloader");
const fs = require("fs-extra");

async function getLatestTweets() {
    let tweets = tweetDownloader.readTweets("app/data/tweets.json");
    
    let maxId = BigInt(1);
    if (tweets.length > 0) {
        maxId = tweets.map(x => x.id).reduce((x, y) => x > y ? x : y);
    }
    
    const jbTweets = await tweetDownloader.getLatestTweets(maxId.toString(), "JosefBiehler", "app/data/images",
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET, 3200);

    const kackDevTweets = await tweetDownloader.getLatestTweets(maxId.toString(), "KackDev", "app/data/images",
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET, 3200);

    tweets = [...jbTweets, ...kackDevTweets];

    tweetDownloader.mergeAndWriteWithExisting("app/data/tweets.json", tweets);

    return tweets;
}

async function getSpecificTweets() {
    const tweetIds = JSON.parse(fs.readFileSync("app/data/devto-to-tweet.json").toString()).map(x => x.tweetId);
    const tweets = await tweetDownloader.getSpecificTweets(tweetIds, "app/data/images",
    process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
    tweetDownloader.mergeAndWriteWithExisting("app/data/tweets.json", tweets);
}

getLatestTweets()
.then(getSpecificTweets)
.catch(e => {
    console.error(e);
    throw e;
});
