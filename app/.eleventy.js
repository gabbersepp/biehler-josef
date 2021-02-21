const fs = require("fs");
const sass = require("../build/sass-process.js");

function readRepositories() {
  return Promise.resolve(JSON.parse(fs.readFileSync("app/data/repos.csv").toString()))
}

function getAllDevTo() {
  return Promise.resolve(JSON.parse(fs.readFileSync("app/data/devto.csv").toString()))
}

function readTweets() {
  const tweetsStr = fs.readFileSync("app/data/tweets.json").toString();
  const tweets = JSON.parse(tweetsStr);
  return tweets;
}

function filterTweets(hashtags) {
  const tweets = readTweets().filter(tweet => {  
    const text = tweet.fullText.toLowerCase();
    return tweet.localPath && hashtags.some(ht => {
      return text.indexOf(ht) > -1 || tweet.hashtags.some(tag => {
        return tag.indexOf(ht) > -1
      });
    });
  });
  
  return tweets.map(tweet => {
    if (tweet.localPath) {
      tweet.localPath = "/" + tweet.localPath;
    }
    return tweet;
  });
}

async function extendArticles(articlesPromise) {
  const articles = await articlesPromise;
  const tweets = readTweets();
  const devtoToTweet = JSON.parse(fs.readFileSync("app/data/devto-to-tweet.json").toString());
  articles.forEach(article => {
    article.devReactions = article.comments_count + article.public_reactions_count + article.page_views_count;
    
    article.twitterLikes = 0;
    article.shares = 0; 

    var tweetDevTo = devtoToTweet.find(x => x.articleId == article.id);
    if (tweetDevTo) {
      var tweet = tweets.find(t => t.id == tweetDevTo.tweetId);
      if (tweet) {
        article.twitterLikes = tweet.likeCount;
        article.shares = tweet.retweetCount; 
      }
    }
  })
  return articles;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('markdown', function(value) {
      let markdown = require('markdown-it')({
          html: true
      });
      return markdown.render(value);
  });

  const devtoPromise = extendArticles(getAllDevTo());
  const githubprojectpromise = readRepositories();
  const drawings = filterTweets(["digitalart", "comic", "cartoon", "draw", "drawing"]);

  eleventyConfig.addCollection("tweets", () => drawings);
  eleventyConfig.addCollection("tweetsSlice", () => drawings.slice(0, 3));
  
  eleventyConfig.addCollection("repos", () => githubprojectpromise);
  eleventyConfig.addCollection("reposSlice", async () => (await githubprojectpromise).slice(0, 3));
  
  eleventyConfig.addCollection("blogposts", () => devtoPromise);
  eleventyConfig.addCollection("postsSlice", async () => (await devtoPromise).slice(0, 3));

  eleventyConfig.addPassthroughCopy({
    "app/assets": "assets",
    "app/data/images": "app/data/images",
    "app/node_modules/wordcloud/src/wordcloud2.js": "assets/wordcloud2.js"
  });

  sass('app/styles/index.scss', 'app/dist/index.css');

  return {
    dir: {
      input: "app/views",
      output: "app/dist",
      includes: "../_includes"
    }
  }
}