const tweetDownloader = require("tweet-downloader");

async function getLatestEarningsPost() {
    let tweets = tweetDownloader.readTweets("./data/tweets.json");
    
    let maxId = BigInt(1);
    if (tweets.length > 0) {
        maxId = tweets.map(x => x.id).reduce((x, y) => x > y ? x : y);
    }
    
    const jbTweets = await tweetDownloader.getLatestEarningsPost(maxId.toString(), "JosefBiehler", "./data/images",
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);

    const kackDevTweets = await tweetDownloader.getLatestEarningsPost(maxId.toString(), "KackDev", "./data/images",
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);

    tweets = [...jbTweets, ...kackDevTweets];

    tweetDownloader.mergeAndWriteWithExisting("./data/tweets.json", tweets);

    return tweets;
}

getLatestEarningsPost().catch(e => {
    console.error(e);
    throw e;
});
