const fs = require("fs");

module.exports = function(eleventyConfig) {
  const tweetsStr = fs.readFileSync("./data/tweets.json").toString();
  const tweets = JSON.parse(tweetsStr);
  console.log(tweetsStr)
  eleventyConfig.addCollection("tweets", () => tweets);

  return {
    dir: {
      input: "page/views",
      output: "page/dist"
    }
  }
}