const fs = require("fs-extra");
const sass = require("./build/sass-process");
const readRepositories = require("./build/github.js");
const devto = require("./build/devto");

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

  const devtoPromise = devto.getAll();
  const githubprojectpromise = readRepositories();
  const drawings = filterTweets(["digitalart", "comic", "cartoon", "draw", "drawing"]);

  eleventyConfig.addCollection("tweets", () => drawings);
  eleventyConfig.addCollection("tweetsSlice", () => drawings.slice(0, 3));
  
  eleventyConfig.addCollection("repos", () => githubprojectpromise);
  eleventyConfig.addCollection("reposSlice", async () => (await githubprojectpromise).slice(0, 3));
  
  eleventyConfig.addCollection("blogposts", () => devtoPromise);
  eleventyConfig.addCollection("postsSlice", async () => (await devtoPromise).slice(0, 3));

  eleventyConfig.addPassthroughCopy({
    "./assets": "assets",
    "./data/images": "data/images",
    "./node_modules/wordcloud/src/wordcloud2.js": "assets/wordcloud2.js"
  });

  sass('./styles/index.scss', './dist/index.css');

  return {
    dir: {
      input: "./views",
      output: "./dist",
      includes: "../_includes"
    }
  }
}