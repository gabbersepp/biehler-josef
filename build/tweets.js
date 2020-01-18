const Twitter = require("twitter-lite");
const fs = require("fs");
const download = require("./downloader.js")

async function getLatestEarningsPost() {
    const existingTweets  = readTweets();
    const ids = existingTweets.map(x => x.id).sort().reverse();
    const maxId = ids.length > 0 ? ids[0] : 1;

    const client = new Twitter({
        subdomain: "api",
        consumer_key: process.env.TWTR_CKEY,
        consumer_secret: process.env.TWTR_CSECRET,
        access_token_key: process.env.TWTR_ATOKEN,
        access_token_secret: process.env.TWTR_ASECRET
    });

    let timeline;
    
    timeline = await client.get("statuses/user_timeline", {
        screen_name: "JosefBiehler",
        exclude_replies: true,
        include_rts: false,
        tweet_mode: "extended",
        count: 200,
        since_id: maxId.toString()
    });

    for (var i = 0; i < timeline.length; i++) {
        let tweet = timeline[i];
        timeline[i] = await client.get(`statuses/show/${tweet.id_str}`, {
            tweet_mode: "extended"
        });
    }

    const getHashtags = x => {
        if (x.entities && x.entities.hashtags) {
            return x.entities.hashtags.map(x => x.text);
        }
        return [];
    }

    const results = timeline.map(x => ({
        fullText: x.full_text,
        createdAt: x.created_at,
        id: x.id_str,
        mediaUrl: x.extended_entities ? x.extended_entities.media[0].media_url : null,
        hashtags: getHashtags(x)
    }));

    for (var i = 0; i < results.length; i++) {
        const x = results[i];
        if (!x.mediaUrl) {
            continue;
        }
        const path = await download(x.mediaUrl, x.id);
        x.twitterMediaUrl = x.mediaUrl;
        x.mediaUrl = path;
    }

    const merged = [...existingTweets, ...results]
        .map(x => {
            x.id = BigInt(x.id)
            return x;
        })
        .sort((a, b) => a.id < b.id ? 1 : -1)
    	.map(x => {
            x.id = x.id.toString();
            return x;
        });

    fs.writeFileSync("./data/tweets.json", JSON.stringify(merged));

    return merged;
}

function readTweets() {
    return JSON.parse(fs.readFileSync("./data/tweets.json").toString()).map(x => {
        x.id = BigInt(x.id);
        return x;        
    });
}

getLatestEarningsPost().catch(e => {
    console.error(e);
    throw e;
});
