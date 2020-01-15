const fs = require("fs");
const sass = require("./build/sass-process");

function filterTweets(hashtags) {
  const tweetsStr = fs.readFileSync("./data/tweets.json").toString();
  const tweets = JSON.parse(tweetsStr).filter(tweet => {
    const text = tweet.fullText.toLowerCase();
    return hashtags.some(ht => {
      return text.indexOf(ht) > -1 || tweet.hashtags.some(tag => {
        return tag.indexOf(ht) > -1
      });
    });
  });
  
  return tweets;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection("tweets", () => filterTweets(["digitalart", "comic", "cartoon", "draw", "drawing"]));

  eleventyConfig.addPassthroughCopy("./assets");
  eleventyConfig.addPassthroughCopy("./data/images");

  sass('./styles/index.scss', './dist/index.css');

  return {
    dir: {
      input: "./views",
      output: "./dist",
      includes: "../_includes"
    }
  }
}