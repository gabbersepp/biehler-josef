const Twitter = require("twitter-lite");
const fs = require("fs");

async function getLatestEarningsPost(hashtag) {
    let tweets = JSON.parse(fs.readFileSync("./data/tweets.json").toString());
    const ids = tweets.map(x => x.id).sort().reverse();
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
        count: 5,
        since_id: maxId
    });

    tweets = timeline
    //tweets = timeline.filter(x => x.full_text.indexOf(hashtag) > -1);

    if (!tweets || tweets.length == 0) {
        throw new Error("tweet_not_found");
    }

    for (var i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];
        tweets[i] = await client.get(`statuses/show/${tweet.id_str}`, {
            tweet_mode: "extended"
        });
    }

    const results = tweets.map(x => ({
        fullText: tweets[1].full_text,
        createdAt: tweets[1].created_at,
        id: tweets[1].id,
        mediaUrl: tweets[1].extended_entities.media[0].media_url
    }));

    fs.writeFileSync("./data/tweets.json", JSON.stringify(results));

    return results;
}

// if we add a new tag, we must delete the existing tweets? hm not sure how we can handle this
// at least if we add a tag that exists already in older tweets

getLatestEarningsPost("digitalart").catch(e => {
    console.error(e);
})


//module.exports = getLatestEarningsPost;