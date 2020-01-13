const fs = require("fs");
const sass = require("./build/sass-process");

module.exports = function(eleventyConfig) {
  const tweetsStr = fs.readFileSync("./data/tweets.json").toString();
  const tweets = JSON.parse(tweetsStr);
  console.log(tweetsStr)
  eleventyConfig.addCollection("tweets", () => tweets);

  eleventyConfig.addPassthroughCopy("./assets");

  sass('./styles/index.scss', './dist/index.css');

  return {
    dir: {
      input: "./views",
      output: "./dist",
      includes: "../_includes"
    }
  }
}