const gcc = require("github-code-cloud");
const fs = require("fs-extra");
const path = require("path");

var a = path.resolve(path.resolve("./temp/cloud"));

async function run() {
    await gcc.generateCloud("gabbersepp", process.env.GITHUB_TOKEN, ["js", "asm", "cs", "ts", "java", "cpp"], path.resolve("./temp/cloud"), 0.8, { backgroundColor: "white", height: 800 });
    fs.copyFileSync("./temp/cloud/export/img.png", "./assets/codecloud.png");
}

run();