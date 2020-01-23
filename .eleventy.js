const fs = require("fs");
const sass = require("./build/sass-process");
const readRepositories = require("./build/github.js");

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
  eleventyConfig.addFilter('markdown', function(value) {
      let markdown = require('markdown-it')({
          html: true
      });
      return markdown.render(value);
  });

  eleventyConfig.addCollection("tweets", () => filterTweets(["digitalart", "comic", "cartoon", "draw", "drawing"]));
  eleventyConfig.addCollection("repos", () => readRepositories());

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