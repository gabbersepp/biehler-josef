const  Twitter  = require( "twitter-lite");

class TwitterProvider {
    async getLatestEarningsPost(twitterAuthOptions) {
        const client = new Twitter({
            subdomain: "api",
            consumer_key: twitterAuthOptions.consumerKey,
            consumer_secret: twitterAuthOptions.consumerSecret,
            access_token_key: twitterAuthOptions.accessToken,
            access_token_secret: twitterAuthOptions.accessTokenSecret
          });

          let timeline;

          try {
        timeline = await client.get("statuses/user_timeline", {
            screen_name: "JosefBiehler",
            exclude_replies: true,
            include_rts: false,
            tweet_mode: "extended"
            });

        } catch (e) {
            return;
        }
        const tweets = timeline.filter(x => x.full_text.indexOf("#digitalart") > -1);

        if (!tweets || tweets.length == 0) {
            return { error: true, msg: "tweet_not_found" };
        }

        for(var i = 0; i < tweets.length; i++) {
            let tweet = tweets[i];
            tweets[i] = await client.get(`statuses/show/${tweet.id_str}`, {
                tweet_mode: "extended"
            }); 
        }

        /*const extendedTweet = 

        if (!extendedTweet || !extendedTweet || !extendedTweet.entities || !extendedTweet.entities.media) {
            return { error: true, msg: "tweet_not_found" };
        }*/

        return { imgUrl: extendedTweet.entities.media[0].media_url };
    }
}

 let twitterProvider = new TwitterProvider();

twitterProvider.getLatestEarningsPost({})